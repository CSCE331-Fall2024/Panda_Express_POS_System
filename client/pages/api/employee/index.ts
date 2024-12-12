/**
 * API endpoint for managing employees.
 * 
 * @remarks
 * This endpoint allows fetching and creating employees.
 * 
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {Promise<void>}
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

/**
 * Represents the database connection pool.
 * 
 * @type {Pool}
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
 * Handles the API request for managing employees.
 * 
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {Promise<void>}
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM staff');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch employees' });
    }
  } 
  else if (req.method === 'POST') {
    const { name, position } = req.body;

    if (!name || !position) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
      const result = await pool.query('INSERT INTO staff (name, position) VALUES ($1, $2) RETURNING *', [name, position]);
      const newItem = { ...result.rows[0], price: Number(result.rows[0].price) };
      res.status(201).json({ success: true, employee: newItem });
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ success: false, message: 'Failed to create employee' });
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
