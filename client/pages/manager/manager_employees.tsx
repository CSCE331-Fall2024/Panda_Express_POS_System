import BackButton from "@/components/ui/back_button";
import EditableTable, { Column } from "@/components/ui/editable_table";
import ManagerNavBar from "@/components/ui/manager_nav_bar";
import {
  pageStyle,
  overlayStyle,
  contentStyle,
  headingStyle,
} from "@/utils/tableStyles";
import { GetServerSideProps } from "next";
import { Pool } from "pg";
import React, { useState } from "react";

interface Employee {
  id: number;
  staff_id: number;
  name: string;
  position: string;
  username: string;
}

interface ManagerEmployeesProps {
  employees: Employee[];
}

const ManagerEmployees: React.FC<ManagerEmployeesProps> = ({ employees }) => {
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(
    employees || []
  );
  // const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  // const [newRole, setNewRole] = useState('');

  const columns: Column[] = [
    { key: "staff_id", header: "Staff ID" },
    { key: "name", header: "Name", editable: true, type: "text" },
    {
      key: "position",
      header: "Position",
      editable: true,
      type: "select",
      options: ["Manager", "Cashier"],
    },
    { key: "username", header: "Username" },
    {
      key: "is_deleted",
      header: "Currently Employed",
      editable: true,
      type: "select",
      options: ["Employed", "Fired/Resigned"],
      formatValue: (value: boolean) => (value ? "Fired/Resigned" : "Employed"),
    },
  ];

  const updateEmployee = async (id: number, field: string, value: any) => {
    const bodyContent: any = { staffId: id };
    if (field === "position") {
      bodyContent.newPosition = value;
    } else {
      bodyContent[field] = value;
    }
    try {
      const response = await fetch(`/api/employee/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyContent),
      });
      if (!response.ok)
        throw new Error(`Failed to update employee: ${await response.text()}`);
      setLocalEmployees(
        localEmployees.map((emp) =>
          emp.staff_id === id ? { ...emp, [field]: value } : emp
        )
      );
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const addEmployee = async (item: Omit<Employee, "id">) => {
    try {
      const response = await fetch("/api/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error("Failed to add menu item");
      }

      const { employee } = await response.json();
      setLocalEmployees([...localEmployees, employee]);
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  return (
    <>
      <ManagerNavBar />

      <div style={pageStyle}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          <h2 style={headingStyle}>Manage Employees</h2>
          <EditableTable<Employee>
            items={localEmployees}
            columns={columns}
            idField="staff_id"
            onAdd={addEmployee}
            onUpdate={updateEmployee}
          />
        </div>
      </div>
    </>
  );
};

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
    const result = await pool.query("SELECT * FROM staff");
    return { props: { employees: result.rows } };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { props: { employees: [] } };
  } finally {
    await pool.end();
  }
};

export default ManagerEmployees;
