import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Pool } from 'pg';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import EditableTable, { Column } from '@/components/ui/editable_table';
import ManagerNavBar from '@/components/ui/manager_nav_bar';
import { add } from 'date-fns';

// Default seasonal item pic link for when you can add a menu item
// https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_hqWlVhWklVyH_HBjiavsZvZJ-Xx1rm_xqQ&s

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
    { key: 'menu_item_id', header: 'Item ID' },
    { key: 'name', header: 'Name', editable: true, type: 'text' },
    { 
      key: 'item_type', 
      header: 'Item Type', 
      editable: true, 
      type: 'select',
      options: ['Appetizer', 'Entree', 'Side', 'Beverage']
    },
    { 
      key: 'price', 
      header: 'Price', 
      editable: true, 
      type: 'number',
      formatValue: formatPrice
    },
    {
      key: 'is_deleted',
      header: 'Availability',
      editable: true,
      type: 'select',
      options: ['Available', 'Unavailable'],
      formatValue: (value: boolean) => (value ? 'Unavailable' : 'Available')
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
    <> <ManagerNavBar />
    <div style={{...pageStyle, paddingTop:'40px'}}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton />
        <BackButton />
        <h2 style={headingStyle}>Manage Menu Items</h2>
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