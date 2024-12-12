// pages/api/xreport.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

/**
 * PostgreSQL connection pool.
 */
const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: Number(process.env.PSQL_PORT),
  ssl: { rejectUnauthorized: false },
});

/**
 * API handler to fetch hourly sales data for a given date.
 * The report contains total transactions, total sales, TAMU ID sales, and credit card sales for each hour.
 * 
 * @param req - The request object from Next.js API.
 * @param res - The response object from Next.js API.
 * 
 * @returns {void} A JSON response with the hourly sales report or an error message.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { date } = req.body;
      if(!date) {
        res.status(400).json({ success: false, message: 'need date' });
        return;
      }

      const formattedDate = new Date(date as string).toISOString().split('T')[0];

      const query = `
        SELECT 
          EXTRACT(HOUR FROM payment_time) AS hour,
          COUNT(payment_id) AS total_transactions,
          SUM(payment_amount) AS total_sales, 
          SUM(CASE WHEN payment_type = 'TAMU_ID' THEN payment_amount ELSE 0 END) AS tamu_id_sales,
          SUM(CASE WHEN payment_type = 'Credit Card' THEN payment_amount ELSE 0 END) AS credit_card_sales
        FROM payments
        WHERE DATE(payment_time) = $1
        GROUP BY hour
        ORDER BY hour;
      `;

      const result = await pool.query(query, [formattedDate]);

      // Dynamically get the range of hours
      const allHours = Array.from(
        { length: Math.max(...result.rows.map(row => row.hour)) - Math.min(...result.rows.map(row => row.hour)) + 1 },
        (_, i) => ({
          hour: `${Math.min(...result.rows.map(row => row.hour)) + i}:00`,
          total_transactions: 0,
          total_sales: 0.0,
          tamu_id_sales: 0.0,
          credit_card_sales: 0.0,
        })
      );

      // Merge SQL result into the complete hour range
      const mergedData = allHours.map(hourItem => {
        const match = result.rows.find(row => `${row.hour}:00` === hourItem.hour);
        return match
          ? {
              hour: `${match.hour}:00`,
              total_transactions: Number(match.total_transactions),
              total_sales: Number(match.total_sales).toFixed(2),
              tamu_id_sales: Number(match.tamu_id_sales).toFixed(2),
              credit_card_sales: Number(match.credit_card_sales).toFixed(2),
            }
          : hourItem;
      });

      res.status(200).json({ success: true, report: mergedData });
    } catch (error) {
      console.error('Error fetching X Report data:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch X Report data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
