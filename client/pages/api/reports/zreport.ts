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
      const today = new Date().toLocaleDateString('en-CA');
      const checkQuery = `
        SELECT 1
        FROM zreportgeneration
        WHERE date = $1 AND report_type = 'Z-Report'
        `;
        const checkResult = await pool.query(checkQuery, [today]);
        console.log('check',checkResult);

      if (checkResult.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Z-Report has already been generated for today.',
        });
      }
      const employeeStatsQuery = `
        WITH EmployeeStats AS (
          SELECT 
            e.name AS employee_name,
            COALESCE(COUNT(o.order_id), 0) AS total_transactions,
            COALESCE(SUM(o.total), 0) AS total_sales
          FROM staff e
          LEFT JOIN orders o ON e.staff_id = o.staff_id AND DATE(o.time) = $1
          GROUP BY e.name
        )
        SELECT 
          employee_name,
          total_transactions,
          total_sales
        FROM EmployeeStats
        ORDER BY total_sales DESC;
      `;

      const employeeStatsResult = await pool.query(employeeStatsQuery, [today]);


      // Extract individual employee stats and daily totals
      const employeeStats = employeeStatsResult.rows.map(row => ({
        employee_name: row.employee_name,
        total_transactions: Number(row.total_transactions),
        total_sales: Number(row.total_sales).toFixed(2),
      }));

      const dailyTotalsQuery = `
        SELECT 
          COUNT(order_id) AS total_transactions,
          COALESCE(SUM(total), 0) AS total_sales
        FROM orders
        WHERE DATE(time) = $1;
      `;

      const dailyTotalsResult = await pool.query(dailyTotalsQuery, [today]);
      const dailyTotals = {
        totalTransactions: Number(dailyTotalsResult.rows[0].total_transactions),
        totalSales: Number(dailyTotalsResult.rows[0].total_sales).toFixed(2),
      };

      const insertQuery = `
      INSERT INTO zreportgeneration (date, report_type)
      VALUES ($1, 'Z-Report')
    `;
    await pool.query(insertQuery, [today]);

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