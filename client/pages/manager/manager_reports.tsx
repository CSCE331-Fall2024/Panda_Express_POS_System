import React from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';

const ManagerReports: React.FC = () => {
  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton/>
        <h2 style={headingStyle}>Generate Reports</h2>
        <div style={{ padding: '10px' }}>
          <p>Select a report type to view or generate a detailed report:</p>
          <ul>
            <li>Sales Report</li>
            <li>X Report</li>
            <li>Z Report</li>
            <li>Employee Performance</li>
            <li>Customer Feedback</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;
