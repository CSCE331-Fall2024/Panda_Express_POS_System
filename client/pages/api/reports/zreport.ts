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
  if (req.method === 'POST') {
    try {
      const { date } = req.body;
      if(!date) {
        res.status(400).json({ success: false, message: 'need date' });
        return;
      }

      const formattedDate = new Date(date as string).toISOString().split('T')[0];

      // Check if a report for this date already exists
      const checkReportQuery = `
        SELECT report_data FROM z_reports WHERE report_date = $1;
      `;
      const checkReportResult = await pool.query(checkReportQuery, [formattedDate]);

      if (checkReportResult.rows.length > 0) {
        // Report already exists, return the stored data
        const reportData = checkReportResult.rows[0].report_data;
        res.status(200).json({ success: true, alreadyGenerated: true, ...reportData });
        return;
      }

      const employeeStatsQuery = `
        SELECT 
          e.name AS employee_name,
          COALESCE(COUNT(o.order_id), 0) AS total_transactions,
          COALESCE(SUM(o.total), 0) AS total_sales
        FROM staff e
        LEFT JOIN orders o ON e.staff_id = o.staff_id AND DATE(o.time) = $1
        GROUP BY e.name
        ORDER BY total_sales DESC;
      `;

      const dailyTotalsQuery = `
        SELECT 
          COUNT(o.order_id) AS total_transactions,
          COALESCE(SUM(o.total), 0) AS total_sales,
          COALESCE(SUM(CASE WHEN p.payment_type = 'Credit Card' THEN o.total ELSE 0 END), 0) AS credit_card_sales,
          COALESCE(SUM(CASE WHEN p.payment_type = 'TAMU_ID' THEN o.total ELSE 0 END), 0) AS tamu_id_sales
        FROM orders o
        LEFT JOIN payments p ON o.payment_id = p.payment_id
        WHERE DATE(o.time) = $1;
      `;

      const [employeeStatsResult, dailyTotalsResult] = await Promise.all([
        pool.query(employeeStatsQuery, [formattedDate]),
        pool.query(dailyTotalsQuery, [formattedDate]),
      ]);
    
      const employeeStats = employeeStatsResult.rows.map((row) => ({
        employee_name: row.employee_name,
        total_transactions: Number(row.total_transactions),
        total_sales: Number(row.total_sales).toFixed(2),
      }));

      const dailyTotalsRow = dailyTotalsResult.rows[0] || {
        total_transactions: 0,
        total_sales: 0,
        credit_card_sales: 0,
        tamu_id_sales: 0,
      };

      const dailyTotals = {
        total_transactions: Number(dailyTotalsRow.total_transactions),
        total_sales: Number(dailyTotalsRow.total_sales).toFixed(2),
        credit_card_sales: Number(dailyTotalsRow.credit_card_sales).toFixed(2),
        tamu_id_sales: Number(dailyTotalsRow.tamu_id_sales).toFixed(2),
      };

      const reportData = { report: employeeStats, totals: dailyTotals };

      // Store the generated report in the database
      const insertReportQuery = `
        INSERT INTO z_reports (report_date, report_data)
        VALUES ($1, $2);
      `;
      await pool.query(insertReportQuery, [formattedDate, reportData]);

      res.status(200).json({ success: true, alreadyGenerated: false, ...reportData });
    } catch (error) {
      console.error('Error fetching Z Report data:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch Z Report data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}