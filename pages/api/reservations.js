import { LOWER_RESERVATIONS_REPORT_LIMIT, UPPER_RESERVATIONS_REPORT_LIMIT } from '../../constants/constants';
import { scan, put } from '../../db/dynamo';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const body = JSON.parse(req.body);
        const numberOfReservations = Math.floor(Number(body.reservations));
        
        if (numberOfReservations === Infinity ||
                (typeof body.numberOfReservations === 'string' && String(numberOfReservations) !== body.reservations) ||
                (typeof body.numberOfReservations === 'number' && numberOfReservations !== body.reservations) ||
                numberOfReservations < LOWER_RESERVATIONS_REPORT_LIMIT ||
                numberOfReservations > UPPER_RESERVATIONS_REPORT_LIMIT) {
            throw new Error(`unsupported value: ${numberOfReservations}`);
        }
        
        await put('reservations', numberOfReservations);

        const reports = await scan();

        return res.status(201).json(reports);
    }
};
