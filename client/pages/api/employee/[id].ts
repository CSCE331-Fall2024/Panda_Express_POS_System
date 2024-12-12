/**
 * API endpoint for updating an employee.
 * 
 * @remarks
 * This endpoint allows updating an employee's information.
 * 
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {Promise<void>}
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

/**
 * Represents the database connection pool.
 * 
 * @type {Pool}
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
 * Handles the API request for updating an employee.
 * 
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {Promise<void>}
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ success: false, message: 'Invalid employee ID' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { name, position, is_deleted } = req.body;
        const updateFields = [];
        const values = [];
        let valueCounter = 1;

        if (name !== undefined) {
          updateFields.push(`name = $${valueCounter}`);
          values.push(name);
          valueCounter++;
        }

        if (position !== undefined) {
          updateFields.push(`position = $${valueCounter}`);
          values.push(position);
          valueCounter++;
        }

        if (is_deleted !== undefined) {
          updateFields.push(`is_deleted = $${valueCounter}`);
          values.push(is_deleted === 'Employed' ? false : true);
          valueCounter++;
        }

        if (updateFields.length === 0) {
          return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        values.push(id);
        const query = `
          UPDATE staff
          SET ${updateFields.join(', ')}
          WHERE staff_id = $${valueCounter}
          RETURNING *;
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.status(200).json({ success: true, employee: result.rows[0] });
      } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ success: false, message: 'Failed to update employee' });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
