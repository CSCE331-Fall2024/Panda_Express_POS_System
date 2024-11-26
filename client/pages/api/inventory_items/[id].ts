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
    return res.status(400).json({ success: false, message: 'Invalid inventory item ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const result = await pool.query('SELECT * FROM non_food_inventory_items WHERE inventory_item_id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Inventory item not found' });
        }
        const inventoryItem = { ...result.rows[0], price: Number(result.rows[0].price) };
        res.status(200).json({ success: true, inventoryItem });
      } catch (error) {
        console.error('Error fetching inventory item:', error);
        res.status(500).json({ success: false, message: 'Failed to inventory menu item' });
      }
      break;

    case 'PUT':
      try {
        const { item_name, quantity } = req.body;
        const updateFields = [];
        const values = [];
        let valueCounter = 1;

        if (item_name !== undefined) {
          updateFields.push(`item_name = $${valueCounter}`);
          values.push(item_name);
          valueCounter++;
        }
        if (quantity !== undefined) {
          updateFields.push(`quantity = $${valueCounter}`);
          values.push(quantity);
          valueCounter++;
        }

        if (updateFields.length === 0) {
          return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        values.push(id);
        const query = `
          UPDATE non_food_inventory_items 
          SET ${updateFields.join(', ')} 
          WHERE inventory_item_id = $${valueCounter} 
          RETURNING *
        `;

        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Inventory item not found' });
        }

        const updatedItem = { ...result.rows[0], price: Number(result.rows[0].price) };
        res.status(200).json({ success: true, menuItem: updatedItem });
      } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ success: false, message: 'Failed to update inventory item' });
      }
      break;

    case 'DELETE':
      try {
        const result = await pool.query(
          'DELETE FROM non_food_inventory_items WHERE inventory_item_id = $1 RETURNING *',
          [id]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Inventory item not found' });
        }

        res.status(200).json({ success: true, message: 'Inventory item deleted successfully' });
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ success: false, message: 'Failed to inventory menu item' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}