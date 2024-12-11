/**
 * This file implements a ManagerEmployees component that allows a manager to 
 * view, edit, and manage employee information through a user interface. It includes 
 * server-side rendering to fetch employee data and client-side functionalities 
 * for adding and updating employee records.
 */

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
import { FC, useState, useEffect } from "react";

/**
 * Represents the attributes of an employee.
 *
 * @interface Employee
 * @property {number} id - The unique identifier of the employee.
 * @property {number} staff_id - The staff ID of the employee.
 * @property {string} name - The name of the employee.
 * @property {string} position - The role or position of the employee.
 * @property {string} username - The username assigned to the employee.
 */
export interface Employee {
  id: number;
  staff_id: number;
  name: string;
  position: string;
  username: string;
}

/**
 * Represents the properties passed to the ManagerEmployees component.
 *
 * @interface ManagerEmployeesProps
 * @property {Employee[]} employees - The list of employees managed by the component.
 */
export interface ManagerEmployeesProps {
  employees: Employee[];
}

/**
 * ManagerEmployees component allows managers to view and edit employee details.
 *
 * @param {ManagerEmployeesProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered ManagerEmployees component.
 */
const ManagerEmployees: FC<ManagerEmployeesProps> = ({ employees }) => {
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(employees || []);

  // State variables for language selection and translations.
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  const staticTexts = [
    "Manage Employees",
    "Staff ID",
    "Name",
    "Position",
    "Username",
    "Currently Employed",
    "Employed",
    "Fired/Resigned",
  ];

  /**
   * Retrieves the saved language preference from localStorage.
   */
  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved === "es") setLanguage("es");
  }, []);

  /**
   * Updates the translations based on the selected language.
   */
  useEffect(() => {
    if (language === "en") {
      const map: { [k: string]: string } = {};
      staticTexts.forEach((t) => (map[t] = t));
      setTranslations(map);
    } else {
      fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: staticTexts, targetLanguage: "es" }),
      })
        .then((r) => r.json())
        .then((data) => {
          const map: { [k: string]: string } = {};
          if (data.translatedTexts) {
            staticTexts.forEach((t, i) => (map[t] = data.translatedTexts[i]));
          } else {
            staticTexts.forEach((t) => (map[t] = t));
          }
          setTranslations(map);
        })
        .catch(() => {
          const map: { [k: string]: string } = {};
          staticTexts.forEach((t) => (map[t] = t));
          setTranslations(map);
        });
    }
    localStorage.setItem("language", language);
  }, [language]);

  /**
   * Translates the given text using the current translations.
   *
   * @param {string} text - The text to be translated.
   * @returns {string} The translated text.
   */
  const t = (text: string) => translations[text] || text;

  const columns: Column[] = [
    { key: "staff_id", header: t("Staff ID") },
    { key: "name", header: t("Name"), editable: true, type: "text" },
    {
      key: "position",
      header: t("Position"),
      editable: true,
      type: "select",
      options: ["Manager", "Cashier"],
    },
    { key: "username", header: t("Username") },
    {
      key: "is_deleted",
      header: t("Currently Employed"),
      editable: true,
      type: "select",
      options: [t("Employed"), t("Fired/Resigned")],
      formatValue: (value: boolean) => (value ? t("Fired/Resigned") : t("Employed")),
    },
  ];

  /**
   * Updates an employee's details by sending a PUT request to the server.
   *
   * @param {number} id - The staff ID of the employee to update.
   * @param {string} field - The field to be updated.
   * @param {any} value - The new value for the field.
   */
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
      if (!response.ok) throw new Error(`Failed to update employee: ${await response.text()}`);
      setLocalEmployees(
        localEmployees.map((emp) =>
          emp.staff_id === id ? { ...emp, [field]: value } : emp
        )
      );
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  /**
   * Adds a new employee by sending a POST request to the server.
   *
   * @param {Omit<Employee, "id">} item - The employee details excluding the ID.
   */
  const addEmployee = async (item: Omit<Employee, "id">) => {
    try {
      const response = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error("Failed to add employee");

      const { employee } = await response.json();
      setLocalEmployees([...localEmployees, employee]);
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <>
      <ManagerNavBar language={language} setLanguage={setLanguage} />
      <div style={pageStyle}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          <h2 style={headingStyle}>{t("Manage Employees")}</h2>
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

/**
 * Fetches employee data from the database and passes it to the component as props.
 *
 * @type {GetServerSideProps}
 */
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
