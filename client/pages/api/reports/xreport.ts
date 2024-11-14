import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// establish the database connection
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
    const query = ` SELECT 
                        EXTRACT(HOUR FROM payment_time) AS hour,
                        COUNT(payment_id) AS total_transactions,
                        SUM(payment_amount) AS total_sales, 
                        SUM(CASE WHEN payment_type = 'TAMU_ID' THEN payment_amount ELSE 0 END) AS tamu_id_sales,
                        SUM(CASE WHEN payment_type = 'Credit Card' THEN payment_amount ELSE 0 END) AS credit_card_sales
                    FROM payments
                    WHERE DATE(payment_time) = CURRENT_DATE
                    GROUP BY hour
                    ORDER BY hour;
                    `;
      const result = await pool.query(query);

      // manage output
      const report = result.rows.map(row => ({
        hour: `${row.hour}:00`,
        total_transactions: Number(row.total_transactions),
        total_sales: Number(row.total_sales).toFixed(2),
        tamu_id_sales: Number(row.tamu_id_sales).toFixed(2),
        credit_card_sales: Number(row.credit_card_sales).toFixed(2),
      }));

      res.status(200).json({ success: true, report });
    } catch (error) {
      console.error('Error fetching X Report data:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch X Report data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
