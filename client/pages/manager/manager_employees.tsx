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
import React, { useState, useEffect } from "react";

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
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(employees || []);

  // Language and translation
  const [language, setLanguage] = useState<'en'|'es'>('en');
  const [translations, setTranslations] = useState<{[key:string]:string}>({});

  const staticTexts = [
    "Manage Employees",
    "Staff ID",
    "Name",
    "Position",
    "Username",
    "Currently Employed",
    "Employed",
    "Fired/Resigned"
  ];

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved==='es') setLanguage('es');
  }, []);

  useEffect(()=>{
    if(language==='en'){
      const map:{[k:string]:string}={};
      staticTexts.forEach(t=>map[t]=t);
      setTranslations(map);
    } else {
      fetch('/api/translate',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({texts:staticTexts,targetLanguage:'es'})
      })
      .then(r=>r.json())
      .then(data=>{
        if(data.translatedTexts){
          const map:{[k:string]:string}={};
          staticTexts.forEach((t,i)=>map[t]=data.translatedTexts[i]);
          setTranslations(map);
        } else {
          const map:{[k:string]:string}={};
          staticTexts.forEach(t=>map[t]=t);
          setTranslations(map);
        }
      })
      .catch(()=>{
        const map:{[k:string]:string}={};
        staticTexts.forEach(t=>map[t]=t);
        setTranslations(map);
      })
    }
    localStorage.setItem('language', language);
  },[language]);

  const t=(text:string)=>translations[text]||text;

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
