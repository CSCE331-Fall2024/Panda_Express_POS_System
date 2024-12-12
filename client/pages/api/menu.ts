/**
 * API endpoint for fetching menu items.
 * 
 * @remarks
 * This endpoint allows fetching menu items from the database.
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
 * API route handler for fetching active menu items from the database.
 * 
 * @param req - The request object from Next.js API.
 * @param res - The response object from Next.js API.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM menu_item WHERE is_deleted = false ORDER BY menu_item_id');
      const menuItems = result.rows.map(item => ({
        ...item,
        price: Number(item.price),
      }));
      res.status(200).json({ success: true, menuItems });
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch menu items' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
