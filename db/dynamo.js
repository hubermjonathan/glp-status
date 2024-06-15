import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.TABLE_NAME;

const dynamoClient = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ID,
        secretAccessKey: process.env.KEY,
    },
});
const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);

const getCurrentTime = () => {
    return Math.floor(new Date() / 1000);
};

export const scan = async () => {
    let scanCommand = new ScanCommand({
        TableName: TABLE_NAME,
    });

    const tableResults = (await dynamoDocumentClient.send(scanCommand)).Items.filter(item => getCurrentTime() < item.ttl);
    const reportIds = [...new Set(tableResults.map(item => item.report_id))];
    const reports = {};
    
    reportIds.forEach(id => reports[id] = []);
    tableResults.forEach(report => {
        reports[report.report_id].push(report);
        delete report.report_id;
        delete report.ttl;
    });
    Object.keys(reports).forEach(key => {
        reports[key].sort((a,b) => b.report_time - a.report_time);
    });

    return reports;
};

export const put = async (reportId, value) => {
    const currentTime = getCurrentTime();
    const typedValue = typeof value === 'number'
        ? Number(value)
        : String(value);
    const putCommand = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            report_id: reportId,
            report_time: currentTime,
            ttl: currentTime + 3600,
            value: typedValue,
        },
    });
    
    await dynamoDocumentClient.send(putCommand);
};
