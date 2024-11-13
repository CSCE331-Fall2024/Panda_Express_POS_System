import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Pool } from 'pg';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import EditableTable, { Column } from '@/components/ui/editable_table';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface ManagerMenuItemsProps {
  menuItems: MenuItem[];
}

const ManagerMenuItems: React.FC<ManagerMenuItemsProps> = ({ menuItems }) => {
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(menuItems);
  
  const formatPrice = (value: number | string | null | undefined): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Check if we have a valid number
    if (typeof numValue === 'number' && !isNaN(numValue)) {
      return `$${numValue.toFixed(2)}`;
    }
    
    // Return a default value if the price is invalid
    return '$0.00';
  };

  const columns: Column[] = [
    { key: 'id', header: 'Item ID' },
    { key: 'name', header: 'Name', editable: true, type: 'text' },
    { 
      key: 'category', 
      header: 'Category', 
      editable: true, 
      type: 'select',
      options: ['Appetizer', 'Entree', 'Side', 'Dessert', 'Beverage']
    },
    { 
      key: 'price', 
      header: 'Price', 
      editable: true, 
      type: 'number',
      formatValue: formatPrice
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

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton />
        <h2 style={headingStyle}>Manage Menu Items</h2>
        <EditableTable<MenuItem>
          items={localMenuItems}
          columns={columns}
          idField="id"
          onUpdate={updateMenuItem}
        />
      </div>
    </div>
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