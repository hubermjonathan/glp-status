import { LOWER_STACKS_REPORT_LIMIT, UPPER_STACKS_REPORT_LIMIT } from '../../constants/constants';
import { scan, put } from '../../db/dynamo';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const body = JSON.parse(req.body);
        const numberOfStacks = Math.floor(Number(body.stacks));
        
        if (numberOfStacks === Infinity ||
                (typeof body.numberOfStacks === 'string' && String(numberOfStacks) !== body.stacks) ||
                (typeof body.numberOfStacks === 'number' && numberOfStacks !== body.stacks) ||
                numberOfStacks < LOWER_STACKS_REPORT_LIMIT ||
                numberOfStacks > UPPER_STACKS_REPORT_LIMIT) {
            throw new Error(`unsupported value: ${numberOfStacks}`);
        }
        
        await put('stacks', numberOfStacks);

        const reports = await scan();

        return res.status(201).json(reports);
    }
};
