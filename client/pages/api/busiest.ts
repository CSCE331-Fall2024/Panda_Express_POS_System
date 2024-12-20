// pages/api/busiest.ts
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
 * Represents attributes of the busiest day
 * @typedef {Object} BusiestDay
 * @property {string} period - The time period (week, month, year).
 * @property {string} date - The date of the busiest day in the period.
 * @property {string} day - The day name of the busiest day (e.g., Monday).
 * @property {number} total_sales - The total sales for the busiest day.
 */
export interface BusiestDay {
  period: string;
  date: string;
  day: string;
  total_sales: number;
}

/**
 * API handler for fetching the busiest day for given time periods (week, month, year).
 * It queries the database for the highest total sales within each time period.
 * 
 * @param req - The request object from Next.js API.
 * @param res - The response object from Next.js API.
 * 
 * @returns {void} A JSON response with the busiest days or an error message.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const periods = [
        { name: 'week', days: 7 },
        { name: 'month', days: 30 },
        { name: 'year', days: 365 },
      ];

      const busiestDays: BusiestDay[] = [];

      for (const period of periods) {
        const now = new Date();
        const pastDate = new Date();
        pastDate.setDate(now.getDate() - period.days);

        const query = `
          SELECT
            DATE(orders.time) AS date,
            TO_CHAR(orders.time, 'Day') AS day_name,
            SUM(menu_item.price) AS total_sales
          FROM
            orders
          INNER JOIN
            menu_item_order_jt ON orders.order_id = menu_item_order_jt.order_id
          INNER JOIN
            menu_item ON menu_item_order_jt.menu_item_id = menu_item.menu_item_id
          WHERE
            orders.time BETWEEN $1 AND $2
          GROUP BY
            DATE(orders.time), day_name
          ORDER BY
            total_sales DESC
          LIMIT 1
        `;

        const values = [pastDate.toISOString(), now.toISOString()];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
          const date = result.rows[0].date;
          const dayName = result.rows[0].day_name.trim();
          const totalSales = parseFloat(result.rows[0].total_sales);

          busiestDays.push({
            period: period.name,
            date,
            day: dayName,
            total_sales: totalSales,
          });
        } else {
          busiestDays.push({
            period: period.name,
            date: 'N/A',
            day: 'No data',
            total_sales: 0,
          });
        }
      }

      res.status(200).json({ success: true, data: busiestDays });
    } catch (error) {
      console.error('Error fetching busiest days:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch busiest days' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
