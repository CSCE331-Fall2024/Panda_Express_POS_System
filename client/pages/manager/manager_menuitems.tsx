import React from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';

const ManagerMenuItems: React.FC = () => {
  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton/>
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
            {/* Sample row */}
            <tr>
              <td style={tableCellStyle}>001</td>
              <td style={tableCellStyle}>Orange Chicken</td>
              <td style={tableCellStyle}>Entree</td>
              <td style={tableCellStyle}>$10.00</td>
              <td style={tableCellStyle}>Edit / Delete</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerMenuItems;
