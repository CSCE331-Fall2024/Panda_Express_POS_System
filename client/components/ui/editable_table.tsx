import React, { useState } from 'react';

interface Employee {
  staff_id: number;
  name: string;
  position: string;
  username: string;
}

interface EditableTableProps {
  employees: Employee[];
  onUpdateRole: (id: number, newRole: string) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({ employees, onUpdateRole }) => {
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [newRole, setNewRole] = useState('');

  const handleEditClick = (employeeId: number, currentRole: string) => {
    setEditingEmployeeId(employeeId);
    setNewRole(currentRole); // Set the current role as the initial value for the select input
  };

  const handleSaveClick = (employeeId: number) => {
    if (newRole) {
      onUpdateRole(employeeId, newRole);
      setEditingEmployeeId(null); // Exit editing mode after saving
    }
  };

  const handleCancelClick = () => {
    setEditingEmployeeId(null);
    setNewRole(''); // Reset newRole when editing is canceled
  };

  return (
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
        {employees.map((employee) => (
          <tr key={employee.staff_id}>
            <td style={tableCellStyle}>{employee.staff_id}</td>
            <td style={tableCellStyle}>{employee.name}</td>
            <td style={tableCellStyle}>
              {editingEmployeeId === employee.staff_id ? (
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select Role</option>
                  <option value="Manager">Manager</option>
                  <option value="Cashier">Cashier</option>
                </select>
              ) : (
                employee.position
              )}
            </td>
            <td style={tableCellStyle}>{employee.username}</td>
            <td style={tableCellStyle}>
              {editingEmployeeId === employee.staff_id ? (
                <>
                  <button onClick={() => handleSaveClick(employee.staff_id)} style={buttonStyle}>
                    Save
                  </button>
                  <button onClick={handleCancelClick} style={buttonStyle}>
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => handleEditClick(employee.staff_id, employee.position)} style={buttonStyle}>
                  Edit Role
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Styling for table headers and cells
const tableHeaderStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: '#D32F2F',
  color: '#FFFFFF',
  textAlign: 'left' as const,
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

export default EditableTable;
