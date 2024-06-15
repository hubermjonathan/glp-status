import { scan } from '../../db/dynamo';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const reports = await scan();
    
        return res.status(200).json(reports);
    }
};
