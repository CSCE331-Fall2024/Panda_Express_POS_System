// pages/api/sales.ts

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
    const { from, to } = req.query;
    if (!from || !to) {
      res.status(400).json({ success: false, message: 'Missing date range parameters' });
      return;
    }
    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      res.status(400).json({ success: false, message: 'Invalid date range parameters' });
      return;
    }
      try {
        const query = `
            SELECT
            menu_item.menu_item_id,
            menu_item.name,
            SUM(menu_item.price) AS sales_generated,
            COUNT(menu_item_order_jt.menu_item_id) AS quantity_sold
            FROM
            orders
            INNER JOIN
            menu_item_order_jt ON orders.order_id = menu_item_order_jt.order_id
            INNER JOIN
            menu_item ON menu_item_order_jt.menu_item_id = menu_item.menu_item_id
            WHERE
            orders.time BETWEEN $1 AND $2
            AND LOWER(menu_item.item_type) != 'combos'
            GROUP BY
            menu_item.menu_item_id, menu_item.name
            ORDER BY
            sales_generated DESC

        `;

      const values = [fromDate.toISOString(), toDate.toISOString()];

      const result = await pool.query(query, values);

      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching sales data:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch sales data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
