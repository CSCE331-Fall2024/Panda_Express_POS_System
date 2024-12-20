/**
 * API endpoint for managing payments in the database.
 * 
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {Promise<void>}
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

/**
 * PostgreSQL connection pool.
 */
const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: Number(process.env.PSQL_PORT),
  ssl: { rejectUnauthorized: false },
});

/**
 * API route handler for managing payment records in the database.
 * 
 * @param {NextApiRequest} req - The request object from Next.js API.
 * @param {NextApiResponse} res - The response object from Next.js API.
 * @returns {Promise<void>}
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {paymentType, paymentAmount} = req.body;
        
        try {
            const result = await pool.query(
                'INSERT INTO payments (payment_type, payment_amount, payment_time) VALUES ($1, $2, NOW()) RETURNING payment_id',
                [paymentType, paymentAmount]
            );

            const paymentId = result.rows[0].payment_id;
            res.status(201).json({ success: true, paymentId });
        } catch (error) {
            console.error('Error creating payment:', error);
            res.status(500).json({ success: false, error: 'Internal server error, failed to create payment' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
