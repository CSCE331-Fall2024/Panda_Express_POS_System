import React from 'react';
import Home from '../customer';
import Orders from './manager_orders';
import Employees from './manager_employees';
import Reports from './manager_reports';
import MenuItems from './manager_menuitems';
import InventoryItems from './manager_inventoryitems';
import Login from '..';
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
          <Link href="/manager" style={buttonStyle}>Home</Link>
          <Link href="/manager/orders" style={buttonStyle}>Orders</Link>
          <Link href="/manager/employees" style={buttonStyle}>Employees</Link>
          <Link href="/manager/reports" style={buttonStyle}>Reports</Link>
          <Link href="/manager/menu-items" style={buttonStyle}>Menu Items</Link>
          <Link href="/manager/inventory-items" style={buttonStyle}>Inventory Items</Link>
          <Link href="/" style={buttonStyle}>Logout</Link>
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