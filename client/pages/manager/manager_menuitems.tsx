/**
 * This file implements the ManagerMenuItems component, allowing managers to 
 * view, edit, and manage menu items through a user interface. It includes 
 * server-side rendering to fetch menu data and client-side functionalities 
 * for adding and updating menu items.
 */

import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { Pool } from 'pg';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import EditableTable, { Column } from '@/components/ui/editable_table';
import ManagerNavBar from '@/components/ui/manager_nav_bar';

/**
 * Represents the attributes of a menu item.
 *
 * @interface MenuItem
 * @property {number} id - The unique identifier of the menu item.
 * @property {string} name - The name of the menu item.
 * @property {string} item_type - The category of the menu item (e.g., appetizer, entree).
 * @property {number} price - The price of the menu item.
 * @property {boolean} is_deleted - Whether the menu item is currently available.
 */
export interface MenuItem {
  id: number;
  name: string;
  item_type: string;
  price: number;
  is_deleted: boolean;
}

/**
 * Represents the properties passed to the ManagerMenuItems component.
 *
 * @interface ManagerMenuItemsProps
 * @property {MenuItem[]} menuItems - The list of menu items managed by the component.
 */
export interface ManagerMenuItemsProps {
  menuItems: MenuItem[];
}

/**
 * ManagerMenuItems component allows managers to view and edit menu item details.
 *
 * @param {ManagerMenuItemsProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered ManagerMenuItems component.
 */
const ManagerMenuItems: React.FC<ManagerMenuItemsProps> = ({ menuItems }) => {
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(menuItems);

  // State variables for language selection and translations.
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  const staticTexts = [
    "Manage Menu Items",
    "Item ID",
    "Name",
    "Item Type",
    "Price",
    "Availability",
    "Appetizer",
    "Entree",
    "Side",
    "Beverage",
    "Available",
    "Unavailable"
  ];

  /**
   * Updates the translations map based on the selected language.
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
        .then((res) => res.json())
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
  }, [language]);

  /**
   * Translates the given text using the current translations map.
   *
   * @param {string} text - The text to be translated.
   * @returns {string} The translated text.
   */
  const t = (text: string) => translations[text] || text;

  /**
   * Formats a price value to display as a string with two decimal places.
   *
   * @param {number | string | null | undefined} value - The value to be formatted.
   * @returns {string} The formatted price.
   */
  const formatPrice = (value: number | string | null | undefined): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (typeof numValue === 'number' && !isNaN(numValue)) {
      return `$${numValue.toFixed(2)}`;
    }
    return '$0.00';
  };

  const columns: Column[] = [
    { key: 'menu_item_id', header: t('Item ID') },
    { key: 'name', header: t('Name'), editable: true, type: 'text' },
    {
      key: 'item_type',
      header: t('Item Type'),
      editable: true,
      type: 'select',
      options: [t('Appetizer'), t('Entree'), t('Side'), t('Beverage')],
    },
    {
      key: 'price',
      header: t('Price'),
      editable: true,
      type: 'number',
      formatValue: formatPrice,
    },
    {
      key: 'is_deleted',
      header: t('Availability'),
      editable: true,
      type: 'select',
      options: [t('Available'), t('Unavailable')],
      formatValue: (value: boolean) => (value ? t('Unavailable') : t('Available')),
    },
  ];

  /**
   * Updates a menu item's details by sending a PUT request to the server.
   *
   * @param {number} id - The unique identifier of the menu item to update.
   * @param {string} field - The field to update.
   * @param {any} value - The new value for the field.
   */
  const updateMenuItem = async (id: number, field: string, value: any) => {
    try {
      if (field === 'price') {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numValue)) {
          throw new Error('Invalid price value');
        }
        value = numValue;
      }

      const response = await fetch(`/api/menu_items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update menu item');
      }

      setLocalMenuItems(
        localMenuItems.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  /**
   * Adds a new menu item by sending a POST request to the server.
   *
   * @param {Omit<MenuItem, 'id'>} item - The menu item details excluding the ID.
   */
  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const response = await fetch('/api/menu_items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('Failed to add menu item');
      }

      const { menuItem } = await response.json();
      setLocalMenuItems([...localMenuItems, menuItem]);
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  return (
    <>
      <ManagerNavBar language={language} setLanguage={setLanguage} />
      <div style={{ ...pageStyle, paddingTop: '40px' }}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          <h2 style={headingStyle}>{t('Manage Menu Items')}</h2>
          <EditableTable<MenuItem>
            items={localMenuItems}
            columns={columns}
            idField={'menu_item_id' as keyof MenuItem}
            onUpdate={updateMenuItem}
            onAdd={addMenuItem}
          />
        </div>
      </div>
    </>
  );
};

/**
 * Fetches menu data from the database and passes it to the component as props.
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
    const result = await pool.query('SELECT * FROM menu_item');
    return { props: { menuItems: result.rows } };
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return { props: { menuItems: [] } };
  } finally {
    await pool.end();
  }
};

export default ManagerMenuItems;