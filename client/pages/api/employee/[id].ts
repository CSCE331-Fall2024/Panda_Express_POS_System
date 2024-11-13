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

  if (req.method === 'PUT') {
    const { newPosition } = req.body;

    if (!newPosition) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
      await pool.query('UPDATE staff SET position = $1 WHERE staff_id = $2', [newPosition, id]);
      res.status(200).json({ success: true, message: 'Employee role updated successfully' });
    } catch (error) {
      console.error('Error updating employee role:', error);
      res.status(500).json({ success: false, message: 'Failed to update employee role' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
