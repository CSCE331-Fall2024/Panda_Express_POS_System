import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Pool } from 'pg';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import EditableTable, { Column } from '@/components/ui/editable_table';
import ManagerNavBar from '@/components/ui/manager_nav_bar';

interface InventoryItem {
  id: number;
  item_name: string;
  quantity: number;
}

interface ManagerInventoryItemsProps {
  inventoryItems: InventoryItem[];
}

const ManagerInventoryItems: React.FC<ManagerInventoryItemsProps> = ({ inventoryItems }) => {
  const [localInventoryItems, setLocalInventoryItems] = useState<InventoryItem[]>(inventoryItems);

  const columns: Column[] = [
    { key: 'inventory_item_id', header: 'Item ID' },
    { key: 'item_name', header: 'Item Name', editable: true, type: 'text' },
    { key: 'quantity', header: 'Quantity', editable: true, type: 'number' },
  ];

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
      <ManagerNavBar />
      <div style={{ ...pageStyle, paddingTop: '40px' }}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          <h2 style={headingStyle}>Manage Inventory Items</h2>
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
