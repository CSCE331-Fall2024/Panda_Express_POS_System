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
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ success: false, message: 'Invalid menu item ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const result = await pool.query('SELECT * FROM menu_item WHERE menu_item_id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        const menuItem = { ...result.rows[0], price: Number(result.rows[0].price) };
        res.status(200).json({ success: true, menuItem });
      } catch (error) {
        console.error('Error fetching menu item:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch menu item' });
      }
      break;

    case 'PUT':
      try {
        const { name, item_type, price, is_deleted } = req.body;
        const updateFields = [];
        const values = [];
        let valueCounter = 1;

        if (name !== undefined) {
          updateFields.push(`name = $${valueCounter}`);
          values.push(name);
          valueCounter++;
        }
        if (item_type !== undefined) {
          updateFields.push(`item_type = $${valueCounter}`);
          values.push(item_type);
          valueCounter++;
        }
        if (price !== undefined) {
          updateFields.push(`price = $${valueCounter}`);
          values.push(price);
          valueCounter++;
        }
        if (is_deleted !== undefined) {
          updateFields.push(`is_deleted = $${valueCounter}`);
          values.push(is_deleted === 'Available' ? false : true);
          valueCounter++;
        }

        if (updateFields.length === 0) {
          return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        values.push(id);
        const query = `
          UPDATE menu_item 
          SET ${updateFields.join(', ')} 
          WHERE menu_item_id = $${valueCounter} 
          RETURNING *
        `;

        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Menu item not found' });
        }

        const updatedItem = { ...result.rows[0], price: Number(result.rows[0].price) };
        res.status(200).json({ success: true, menuItem: updatedItem });
      } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ success: false, message: 'Failed to update menu item' });
      }
      break;

    case 'DELETE':
      try {
        const result = await pool.query(
          'DELETE FROM menu_item WHERE menu_item_id = $1 RETURNING *',
          [id]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Menu item not found' });
        }

        res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
      } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ success: false, message: 'Failed to delete menu item' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}