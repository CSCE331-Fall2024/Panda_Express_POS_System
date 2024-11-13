import React from 'react';
import { GetServerSideProps } from 'next';
import { Pool } from 'pg';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';

interface InventoryItem {
  inventory_item_id: number | string;
  item_name: string;
  quantity: number;
}

interface ManagerInventoryItemsProps {
  inventoryItems: InventoryItem[];
}

// Component to render the inventory items in a table
const ManagerInventoryItems: React.FC<ManagerInventoryItemsProps> = ({ inventoryItems }) => {
  // Ensure inventory_item_id is treated as a number for sorting
  const sortedItems = [...inventoryItems].sort(
    (a, b) => Number(a.inventory_item_id) - Number(b.inventory_item_id)
  );

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton />
        <h2 style={headingStyle}>Manage Inventory Items</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Inventory Item ID</th>
              <th style={tableHeaderStyle}>Item Name</th>
              <th style={tableHeaderStyle}>Quantity</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.inventory_item_id}>
                <td style={tableCellStyle}>{item.inventory_item_id}</td>
                <td style={tableCellStyle}>{item.item_name}</td>
                <td style={tableCellStyle}>{item.quantity}</td>
                <td style={tableCellStyle}>Edit / Reorder</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Server-side data fetching with SQL query
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
