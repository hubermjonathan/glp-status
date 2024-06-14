import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';


// constants

const ROLE_ARN = 'arn:aws:iam::300537434890:role/service-role/AmplifySSRLoggingRole-e3440326-2cd9-4a40-a6ff-d2ca6f84d54a';
const TABLE_NAME = 'glp-queue';
const TTL = 3600;


// utility functions

const getCurrentTime = () => {
    return Math.floor(new Date() / 1000);
};

const retrieveStacks = async () => {
    let tableResults = await dynamo.scan({ TableName: TABLE_NAME });

    return tableResults["Items"]
        .filter(item => getCurrentTime() < item.ttl)
        .map(item => {
            delete item.report_id;
            delete item.ttl;
            
            return item;
        })
        .sort((a,b) => b['report_time'] - a['report_time']);
};


// aws setup

const sts = new STSClient();
const assumeRoleCommand = new AssumeRoleCommand({
    RoleArn: ROLE_ARN,
    RoleSessionName: `stacks-${getCurrentTime()}`,
    DurationSeconds: 900,
});
const credentials = await sts.send(assumeRoleCommand);
const dynamo = DynamoDBDocument.from(new DynamoDB({
    region: process.env.REGION,
    credentials: credentials.Credentials,
}));


// handler

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const stacks = await retrieveStacks();

        return res.status(200).json(stacks);
    }

    if (req.method === 'PUT') {
        let currentTime = getCurrentTime();
        let body = JSON.parse(req.body);
        let numberOfStacks = Math.floor(Number(body.numberOfStacks));
        
        if (numberOfStacks === Infinity ||
                (typeof body.numberOfStacks === 'string' && String(numberOfStacks) !== body.numberOfStacks) ||
                (typeof body.numberOfStacks === 'number' && numberOfStacks !== body.numberOfStacks) ||
                numberOfStacks < 0 ||
                numberOfStacks > 20) {
            throw new Error(`Unsupported value "${numberOfStacks}"`);
        }
        
        let item = {
            report_id: "stack",
            report_time: currentTime,
            ttl: currentTime + TTL,
            number_of_stacks: Number(numberOfStacks)
        };
        
        await dynamo.put({ TableName: TABLE_NAME, Item: item });
        
        let stacks = await retrieveStacks();

        return res.status(201).json(stacks);
    }
}
