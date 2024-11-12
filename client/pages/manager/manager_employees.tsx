import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Pool } from 'pg';
import BackButton from '@/components/ui/back_button';
import EditableTable from '@/components/ui/editable_table';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';

interface Employee {
  staff_id: number;
  name: string;
  position: string;
  username: string;
}

interface ManagerEmployeesProps {
  employees: Employee[];
}

const ManagerEmployees: React.FC<ManagerEmployeesProps> = ({ employees }) => {
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(employees);

  // Update employee role
  const updateRole = async (id: number, newRole: string) => {
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ staffId: id, newPosition: newRole }),
      });

      if (response.ok) {
        setLocalEmployees(
          localEmployees.map((emp) =>
            emp.staff_id === id ? { ...emp, position: newRole } : emp
          )
        );
      } else {
        console.error('Error updating role:', await response.json());
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton />
        <h2 style={headingStyle}>Manage Employees</h2>
        <EditableTable employees={localEmployees} onUpdateRole={updateRole} />
      </div>
    </div>
  );
};

// Fetch employees server-side
export const getServerSideProps: GetServerSideProps = async () => {
  const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: Number(process.env.PSQL_PORT),
    ssl: { rejectUnauthorized: false },
  });

  try {
    const result = await pool.query('SELECT * FROM staff');
    return { props: { employees: result.rows } };
  } catch (error) {
    console.error('Error fetching employees:', error);
    return { props: { employees: [] } };
  } finally {
    pool.end();
  }
};

export default ManagerEmployees;
