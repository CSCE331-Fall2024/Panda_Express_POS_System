import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: Number(process.env.PSQL_PORT),
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM non_food_inventory_items ORDER BY inventory_item_id');
      const menuItems = result.rows.map(item => ({
        ...item,
        price: Number(item.price),
      }));
      res.status(200).json({ success: true, menuItems });
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch inventory items' });
    }
  } else if (req.method === 'POST') {
    // Add new inventory item
    try {
      const { item_name, quantity } = req.body;
      const result = await pool.query(
        'INSERT INTO non_food_inventory_items (item_name, quantity) VALUES ($1, $2) RETURNING *',
        [item_name, quantity]
      );
      const newItem = { ...result.rows[0], price: Number(result.rows[0].price) };
      res.status(201).json({ success: true, inventoryItem: newItem });
    } catch (error) {
      console.error('Error creating inventory item:', error);
      res.status(500).json({ success: false, message: 'Failed to create inventory item' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}