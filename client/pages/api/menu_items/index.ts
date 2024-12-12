// pages/api/menu-items/index.ts
/**
 * API endpoint for managing menu items
 * 
 * @remarks
 * This endpoint allows fetching and creating menu items.
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
 * API route handler for fetching menu items for Customer kiosk, Cashier
 * Point of Sale device and Menu Boards. Also used to add menu items to 
 * the database.
 * 
 * @param {NextApiRequest} req - The request object from Next.js API.
 * @param {NextApiResponse} res - The response object from Next.js API.
 * @returns {Promise<void>}
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM menu_item ORDER BY menu_item_id');
      const menuItems = result.rows.map(item => ({
        ...item,
        price: Number(item.price),
      }));
      res.status(200).json({ success: true, menuItems });
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch menu items' });
    }
  } else if (req.method === 'POST') {
    // Add new menu item
    try {
      const { name, item_type, price } = req.body;
      const result = await pool.query(
        'INSERT INTO menu_item (name, item_type, price) VALUES ($1, $2, $3) RETURNING *',
        [name, item_type, price]
      );
      const newItem = { ...result.rows[0], price: Number(result.rows[0].price) };
      res.status(201).json({ success: true, menuItem: newItem });
    } catch (error) {
      console.error('Error creating menu item:', error);
      res.status(500).json({ success: false, message: 'Failed to create menu item' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}