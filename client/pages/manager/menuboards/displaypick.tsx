// pages/manager_reports.tsx
import React from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import Link from 'next/link';
import ManagerNavBar from '@/components/ui/manager_nav_bar';


const ManagerReports: React.FC = () => {
  return (
    <> <ManagerNavBar />
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton/>
        <h2 style={headingStyle}>Display Menu Boards</h2>
        <div style={{ padding: '3px', marginBottom:'20px' }}>
          <p style={{marginBottom:'20px' }}>Select a menu board to display:</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/manager/menuboards/menuboard1" style={buttonStyle}>Display Combos, Sides, and Appetizers</Link>
              <Link href="/manager/menuboards/menuboard2" style={buttonStyle}>Display Entrees</Link>
              </div>
        </div>
      </div>
    </div>
    </>
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
