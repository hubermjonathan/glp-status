import { scan, put } from '../../db/dynamo';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const body = JSON.parse(req.body);
        const numberOfStacks = Math.floor(Number(body.numberOfStacks));
        
        if (numberOfStacks === Infinity ||
                (typeof body.numberOfStacks === 'string' && String(numberOfStacks) !== body.numberOfStacks) ||
                (typeof body.numberOfStacks === 'number' && numberOfStacks !== body.numberOfStacks) ||
                numberOfStacks < 0 ||
                numberOfStacks > 20) {
            throw new Error(`unsupported value: ${numberOfStacks}`);
        }
        
        await put('stacks', numberOfStacks);

        const reports = await scan();

        return res.status(201).json(reports);
    }
};
