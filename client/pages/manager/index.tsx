import React from 'react';
import Link from 'next/link'

const Manager: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'url(https://thecounter.org/wp-content/uploads/2022/02/worker-takes-customers-order-at-panda-express-garden-grove-CA-Nov-17-2021-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Dim Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // 50% black overlay to dim background
      }}></div>

      {/* Manager Options Box */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight white background for readability
          borderRadius: '8px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <h2 style={{ fontSize: '24px', color: '#D32F2F', marginBottom: '20px' }}>Manager View</h2>
        {/* Navigation Links Styled as Buttons */}
        <nav style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Link href="/manager/manager_orders" style={buttonStyle}>Orders</Link>
          <Link href="/manager/manager_employees" style={buttonStyle}>Employees</Link>
          <Link href="/manager/manager_reports" style={buttonStyle}>Reports</Link>
          <Link href="/manager/manager_menuitems" style={buttonStyle}>Menu Items</Link>
          <Link href="/manager/manager_inventoryitems" style={buttonStyle}>Inventory Items</Link>
          <Link href="/login" style={buttonStyle}>Logout</Link>
        </nav>
      </div>
    </div>
  );
};

// Button style object to make links look like buttons
const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  margin: '8px 0',
  backgroundColor: '#D32F2F',
  color: '#FFFFFF',
  textAlign: 'center',
  textDecoration: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'block'
};

export default Manager;