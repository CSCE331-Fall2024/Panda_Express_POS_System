import React from 'react';
import { GetServerSideProps } from 'next';
import { Pool } from 'pg';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';

interface MenuItem {
  menu_item_id: number | string;
  name: string;
  item_type: string;
  price: string | number;
}

interface ManagerMenuItemsProps {
  menuItems: MenuItem[];
}

// Component to render the menu items in a table
const ManagerMenuItems: React.FC<ManagerMenuItemsProps> = ({ menuItems }) => {
  // Ensure menu_item_id is treated as a number for sorting
  const sortedItems = [...menuItems].sort(
    (a, b) => Number(a.menu_item_id) - Number(b.menu_item_id)
  );

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton />
        <h2 style={headingStyle}>Manage Menu Items</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Item ID</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Category</th>
              <th style={tableHeaderStyle}>Price</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.menu_item_id}>
                <td style={tableCellStyle}>{item.menu_item_id}</td>
                <td style={tableCellStyle}>{item.name}</td>
                <td style={tableCellStyle}>{item.item_type}</td>
                <td style={tableCellStyle}>${Number(item.price).toFixed(2)}</td>
                <td style={tableCellStyle}>Edit / Delete</td>
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
    const result = await pool.query('SELECT menu_item_id, price, item_type, name FROM menu_item');
    return { props: { menuItems: result.rows } };
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return { props: { menuItems: [] } };
  } finally {
    pool.end();
  }
};

export default ManagerMenuItems;
