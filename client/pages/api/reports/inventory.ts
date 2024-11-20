// pages/api/reports/inventory.ts

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
  try {
    const query = `
      SELECT
        nfi.item_name AS inventory_name,
        SUM(nfi.quantity) AS total_used
      FROM
        non_food_inventory_items nfi
      GROUP BY
        nfi.item_name
      ORDER BY
        nfi.item_name;
    `;

    const result = await pool.query(query);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('Error fetching inventory usage data:', error.stack);
    res.status(500).json({ success: false, message: 'Error fetching inventory usage data' });
  }
}
