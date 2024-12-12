/**
 * API endpoint for associating menu items with an order in the database.
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
export const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: Number(process.env.PSQL_PORT),
  ssl: { rejectUnauthorized: false },
});

/**
 * API route handler for associating menu items with an order in the database.
 *
 * @param req - The request object from Next.js API.
 * @param res - The response object from Next.js API.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId, menuItemIds } = req.body;

    try {
      const insertValues = menuItemIds.map((menuItemId: number) => `(${orderId}, ${menuItemId})`).join(', ');

      const result = await pool.query(
        `INSERT INTO menu_item_order_jt (order_id, menu_item_id) VALUES ${insertValues} RETURNING order_id, menu_item_id`
      );

      res.status(201).json({
        success: true,
        orderId,
        menuItemIds: result.rows.map((row: { menu_item_id: number }) => row.menu_item_id),
      });
    } catch (error) {
      console.error('Error inserting menu items for order:', error);
      res.status(500).json({ success: false, message: 'Failed to add menu items to order' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
