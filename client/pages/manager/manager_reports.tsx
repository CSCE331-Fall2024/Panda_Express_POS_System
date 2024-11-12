// pages/manager_reports.tsx
import React from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';

const ManagerReports: React.FC = () => {
  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton />
        <h2 style={headingStyle}>Manage Reports</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Report ID</th>
              <th style={tableHeaderStyle}>Report Name</th>
              <th style={tableHeaderStyle}>Created Date</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder content */}
            <tr>
              <td style={tableCellStyle}>001</td>
              <td style={tableCellStyle}>Monthly Sales Report</td>
              <td style={tableCellStyle}>2024-11-12</td>
              <td style={tableCellStyle}>View / Edit</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>002</td>
              <td style={tableCellStyle}>X Report</td>
              <td style={tableCellStyle}>2024-11-12</td>
              <td style={tableCellStyle}>View / Edit</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>003</td>
              <td style={tableCellStyle}>Z Report</td>
              <td style={tableCellStyle}>2024-11-12</td>
              <td style={tableCellStyle}>View / Edit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerReports;
