import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Pool } from 'pg';

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
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [newRole, setNewRole] = useState('');

  // Update employee role
  const updateRole = async (id: number) => {
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
        setEditingEmployeeId(null);
        setNewRole('');
      } else {
        console.error('Error updating role:', await response.json());
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'url(https://thecounter.org/wp-content/uploads/2022/02/worker-takes-customers-order-at-panda-express-garden-grove-CA-Nov-17-2021-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dim Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% black overlay to dim background
        }}
      ></div>

      {/* Employee Table */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          width: '90%',
          maxWidth: '800px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <h2 style={{ fontSize: '24px', color: '#D32F2F', marginBottom: '20px' }}>Manage Employees</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Staff ID</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Position</th>
              <th style={tableHeaderStyle}>Username</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localEmployees.map((employee) => (
              <tr key={employee.staff_id}>
                <td style={tableCellStyle}>{employee.staff_id}</td>
                <td style={tableCellStyle}>{employee.name}</td>
                <td style={tableCellStyle}>
                  {editingEmployeeId === employee.staff_id ? (
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    employee.position
                  )}
                </td>
                <td style={tableCellStyle}>{employee.username}</td>
                <td style={tableCellStyle}>
                  {editingEmployeeId === employee.staff_id ? (
                    <>
                      <button onClick={() => updateRole(employee.staff_id)} style={buttonStyle}>
                        Save
                      </button>
                      <button onClick={() => setEditingEmployeeId(null)} style={buttonStyle}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditingEmployeeId(employee.staff_id)} style={buttonStyle}>
                      Edit Role
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styling for table headers and cells
const tableHeaderStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: '#D32F2F',
  color: '#FFFFFF',
  textAlign: 'left',
  fontWeight: 'bold',
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid #dddddd',
};

const buttonStyle: React.CSSProperties = {
  margin: '0 5px',
  padding: '8px',
  backgroundColor: '#D32F2F',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #cccccc',
};

// Fetch employees server-side
// export const getServerSideProps: GetServerSideProps = async () => {
//   const pool = new Pool({
//     user: process.env.PSQL_USER,
//     host: process.env.PSQL_HOST,
//     database: process.env.PSQL_DATABASE,
//     password: process.env.PSQL_PASSWORD,
//     port: Number(process.env.PSQL_PORT),
//     ssl: { rejectUnauthorized: false },
//   });

//   try {
//     const result = await pool.query('SELECT * FROM staff');
//     return { props: { employees: result.rows } };
//   } catch (error) {
//     console.error('Error fetching employees:', error);
//     return { props: { employees: [] } };
//   } finally {
//     pool.end();
//   }
// };

export default ManagerEmployees;
