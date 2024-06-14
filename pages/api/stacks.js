import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";


// CONSTANTS
const TABLE_NAME = 'glp-queue';
const TTL = 3600;


// AWS
const dynamoClient = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ID,
        secretAccessKey: process.env.KEY,
    }
});
const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);


// UTILITY
const getCurrentTime = () => {
    return Math.floor(new Date() / 1000);
};

const retrieveStacks = async () => {
    const scanCommand = new ScanCommand({
        TableName: TABLE_NAME,
    });
    const tableResults = await dynamoDocumentClient.send(scanCommand);

    return tableResults["Items"]
        .filter(item => getCurrentTime() < item.ttl)
        .map(item => {
            delete item.report_id;
            delete item.ttl;
            
            return item;
        })
        .sort((a,b) => b['report_time'] - a['report_time']);
};

const submitStacks = async (numberOfStacks) => {
    let currentTime = getCurrentTime();
    const putCommand = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            report_id: "stack",
            report_time: currentTime,
            ttl: currentTime + TTL,
            number_of_stacks: Number(numberOfStacks)
        },
    });
    
    await dynamoDocumentClient.send(putCommand);
};


// HANDLER
export default async function handler(req, res) {
    if (req.method === 'GET') {
        const stacks = await retrieveStacks();

        return res.status(200).json(stacks);
    }

    if (req.method === 'PUT') {
        const body = JSON.parse(req.body);
        const numberOfStacks = Math.floor(Number(body.numberOfStacks));
        
        if (numberOfStacks === Infinity ||
                (typeof body.numberOfStacks === 'string' && String(numberOfStacks) !== body.numberOfStacks) ||
                (typeof body.numberOfStacks === 'number' && numberOfStacks !== body.numberOfStacks) ||
                numberOfStacks < 0 ||
                numberOfStacks > 20) {
            throw new Error(`Unsupported value "${numberOfStacks}"`);
        }
        
        await submitStacks(numberOfStacks);

        const stacks = await retrieveStacks();

        return res.status(201).json(stacks);
    }
}
