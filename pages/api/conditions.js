import { ACCEPTED_CONDITIONS } from '../../constants/constants';
import { scan, put } from '../../db/dynamo';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const body = JSON.parse(req.body);
        const conditions = body.conditions;
        
        if (!ACCEPTED_CONDITIONS.includes(conditions)) {
            throw new Error(`unsupported value: ${conditions}`);
        }
        
        await put('conditions', conditions);

        const reports = await scan();

        return res.status(201).json(reports);
    }
};
