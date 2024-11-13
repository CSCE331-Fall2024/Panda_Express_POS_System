import React from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import { useRouter } from 'next/router';
import Link from 'next/link';



const ManagerReports: React.FC = () => {

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton/>
        <h2 style={headingStyle}>Generate Reports</h2>
        <div style={{ padding: '3px', marginBottom:'20px' }}>
          <p style={{marginBottom:'20px' }}>Select a report type to view or generate a detailed report:</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/manager/reports/z-report" style={buttonStyle}>Z Report</Link>
              <Link href="/manager/reports/x-report" style={buttonStyle}>X Report</Link>
              <Link href="/manager/reports/inventory" style={buttonStyle}>Inventory</Link>
              <Link href="/manager/reports/sales" style={buttonStyle}>Sales</Link>
              </div>
        </div>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  margin: '0 5px',
  padding: '8px',
  backgroundColor: '#D32F2F',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default ManagerReports;
