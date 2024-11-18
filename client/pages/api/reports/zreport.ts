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
      const query = `
        WITH EmployeeStats AS (
          SELECT 
            e.name AS employee_name,
            COALESCE(COUNT(o.order_id), 0) AS total_transactions,
            COALESCE(SUM(o.total), 0) AS total_sales
          FROM staff e
          LEFT JOIN orders o ON e.staff_id = o.staff_id AND DATE(o.time) = '2024-10-20'
          GROUP BY e.name
        )
        SELECT 
          employee_name,
          total_transactions,
          total_sales
        FROM EmployeeStats
        ORDER BY total_sales DESC;

        SELECT 
          COUNT(order_id) AS total_transactions,
          COALESCE(SUM(total), 0) AS total_sales
        FROM orders
        WHERE DATE(time) = '2024-10-20';
      `;

      const result = await pool.query(query);

      // Extract individual employee stats and daily totals
      const employeeStats = result[0].rows.map(row => ({
        employee_name: row.employee_name,
        total_transactions: Number(row.total_transactions),
        total_sales: Number(row.total_sales).toFixed(2),
      }));

      const dailyTotals = {
        totalTransactions: Number(result[1].rows[0].total_transactions),
        totalSales: Number(result[1].rows[0].total_sales).toFixed(2),
      };

      res.status(200).json({ success: true, report: employeeStats, totals: dailyTotals });
    } catch (error) {
      console.error('Error fetching Z Report data:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch Z Report data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
