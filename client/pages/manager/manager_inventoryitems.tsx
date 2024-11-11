import React from 'react';
import { useRouter } from 'next/router';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle } from '@/utils/tableStyles';

const ManagerInventoryItems: React.FC = () => {
  const router = useRouter();

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <h2 style={headingStyle}>Manage Inventory Items</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Item ID</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Stock</th>
              <th style={tableHeaderStyle}>Reorder Level</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample row */}
            <tr>
              <td style={tableCellStyle}>A101</td>
              <td style={tableCellStyle}>Soy Sauce</td>
              <td style={tableCellStyle}>120</td>
              <td style={tableCellStyle}>50</td>
              <td style={tableCellStyle}>Edit / Reorder</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerInventoryItems;
