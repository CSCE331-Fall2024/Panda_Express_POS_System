/**
 * This file implements a ManagerInventoryItems component that allows managers to 
 * view, edit, and manage inventory item details through a user interface. It includes 
 * server-side rendering to fetch inventory data and client-side functionalities 
 * for adding and updating inventory records.
 */

import { FC, useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { Pool } from 'pg';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import EditableTable, { Column } from '@/components/ui/editable_table';
import ManagerNavBar from '@/components/ui/manager_nav_bar';

/**
 * Represents the attributes of an inventory item.
 *
 * @interface InventoryItem
 * @property {number} id - The unique identifier for the inventory item.
 * @property {string} item_name - The name of the inventory item.
 * @property {number} quantity - The current quantity of the inventory item.
 */
export interface InventoryItem {
  id: number;
  item_name: string;
  quantity: number;
}

/**
 * Represents the properties passed to the ManagerInventoryItems component.
 *
 * @interface ManagerInventoryItemsProps
 * @property {InventoryItem[]} inventoryItems - The list of inventory items managed by the component.
 */
export interface ManagerInventoryItemsProps {
  inventoryItems: InventoryItem[];
}

/**
 * ManagerInventoryItems component allows managers to view and edit inventory item details.
 *
 * @param {ManagerInventoryItemsProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered ManagerInventoryItems component.
 */
const ManagerInventoryItems: FC<ManagerInventoryItemsProps> = ({ inventoryItems }) => {
  const [localInventoryItems, setLocalInventoryItems] = useState<InventoryItem[]>(inventoryItems);

  // State variables for language selection and translations.
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  const staticTexts = [
    "Manage Inventory Items",
    "Item ID",
    "Item Name",
    "Quantity"
  ];

  /**
   * Initializes the language setting from localStorage.
   */
  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'es') setLanguage('es');
  }, []);

  /**
   * Updates the translations based on the selected language.
   */
  useEffect(() => {
    if (language === 'en') {
      const map: { [k: string]: string } = {};
      staticTexts.forEach((t) => (map[t] = t));
      setTranslations(map);
    } else {
      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: staticTexts, targetLanguage: 'es' }),
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
    localStorage.setItem('language', language);
  }, [language]);

  /**
   * Translates the given text using the current translations.
   *
   * @param {string} text - The text to be translated.
   * @returns {string} The translated text.
   */
  const t = (text: string) => translations[text] || text;

  const columns: Column[] = [
    { key: 'inventory_item_id', header: t("Item ID") },
    { key: 'item_name', header: t("Item Name"), editable: true, type: 'text' },
    { key: 'quantity', header: t("Quantity"), editable: true, type: 'number' },
  ];

  /**
   * Updates an inventory item's details by sending a PUT request to the server.
   *
   * @param {number} id - The unique identifier of the inventory item to update.
   * @param {string} field - The field to be updated.
   * @param {any} value - The new value for the field.
   */
  const updateInventoryItem = async (id: number, field: string, value: any) => {
    try {
      const response = await fetch(`/api/inventory_items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value }),
      });

      if (!response.ok) throw new Error('Failed to update inventory item');

      setLocalInventoryItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  /**
   * Adds a new inventory item by sending a POST request to the server.
   *
   * @param {Omit<InventoryItem, 'id'>} item - The inventory item details excluding the ID.
   */
  const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
    try {
      const response = await fetch('/api/inventory_items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error('Failed to add inventory item');

      const { inventoryItem } = await response.json();
      setLocalInventoryItems((items) => [...items, inventoryItem]);
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  return (
    <>
      <ManagerNavBar language={language} setLanguage={setLanguage} />
      <div style={{ ...pageStyle, paddingTop: '40px' }}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          <h2 style={headingStyle}>{t("Manage Inventory Items")}</h2>
          <EditableTable<InventoryItem>
            items={localInventoryItems}
            columns={columns}
            idField={"inventory_item_id" as keyof InventoryItem}
            onUpdate={updateInventoryItem}
            onAdd={addInventoryItem}
          />
        </div>
      </div>
    </>
  );
};

/**
 * Fetches inventory data from the database and passes it to the component as props.
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
    const result = await pool.query('SELECT inventory_item_id, item_name, quantity FROM non_food_inventory_items');
    return { props: { inventoryItems: result.rows } };
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return { props: { inventoryItems: [] } };
  } finally {
    pool.end();
  }
};

export default ManagerInventoryItems;
