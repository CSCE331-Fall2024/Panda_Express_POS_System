import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { Pool } from 'pg';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import EditableTable, { Column } from '@/components/ui/editable_table';
import ManagerNavBar from '@/components/ui/manager_nav_bar';

interface MenuItem {
  id: number;
  name: string;
  item_type: string;
  price: number;
  is_deleted: boolean;
}

interface ManagerMenuItemsProps {
  menuItems: MenuItem[];
}

const ManagerMenuItems: React.FC<ManagerMenuItemsProps> = ({ menuItems }) => {
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(menuItems);

  // Introduce a language state and a translations map
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [translations, setTranslations] = useState<{[key:string]:string}>({});

  // Define texts that you want to translate
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

  useEffect(() => {
    if (language === 'en') {
      // English default - no need to translate
      const map: {[k:string]:string} = {};
      staticTexts.forEach(t => (map[t] = t));
      setTranslations(map);
    } else {
      // Translate to Spanish
      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: staticTexts, targetLanguage: 'es' })
      })
      .then(res => res.json())
      .then(data => {
        if (data.translatedTexts) {
          const map: {[k:string]:string} = {};
          staticTexts.forEach((t, i) => {
            map[t] = data.translatedTexts[i];
          });
          setTranslations(map);
        } else {
          // If something goes wrong, fallback to original
          const map: {[k:string]:string} = {};
          staticTexts.forEach(t => (map[t] = t));
          setTranslations(map);
        }
      })
      .catch(() => {
        // On error, fallback to original text
        const map: {[k:string]:string} = {};
        staticTexts.forEach(t => (map[t] = t));
        setTranslations(map);
      });
    }
  }, [language]);

  const t = (text: string) => translations[text] || text;

  const formatPrice = (value: number | string | null | undefined): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    // Check if we have a valid number
    if (typeof numValue === 'number' && !isNaN(numValue)) {
      return `$${numValue.toFixed(2)}`;
    }
    // Invalid Price
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
      options: [t('Appetizer'), t('Entree'), t('Side'), t('Beverage')]
    },
    { 
      key: 'price', 
      header: t('Price'), 
      editable: true, 
      type: 'number',
      formatValue: formatPrice
    },
    {
      key: 'is_deleted',
      header: t('Availability'),
      editable: true,
      type: 'select',
      options: [t('Available'), t('Unavailable')],
      formatValue: (value: boolean) => value ? t('Unavailable') : t('Available')
    }
  ];

  const updateMenuItem = async (id: number, field: string, value: any) => {
    try {
      // If updating price, ensure it's a valid number
      if (field === 'price') {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numValue)) {
          throw new Error('Invalid price value');
        }
        value = numValue;
      }

      const response = await fetch(`/api/menu_items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const response = await fetch('/api/menu_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      {/* Pass language and setLanguage to the ManagerNavBar */}
      <ManagerNavBar language={language} setLanguage={setLanguage} />
      <div style={{...pageStyle, paddingTop:'40px'}}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          <BackButton />
          <h2 style={headingStyle}>{t('Manage Menu Items')}</h2>
          <EditableTable<MenuItem>
            items={localMenuItems}
            columns={columns}
            idField={"menu_item_id" as keyof MenuItem}
            onUpdate={updateMenuItem}
            onAdd={addMenuItem}
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