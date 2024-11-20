import React, { useState } from 'react';
import { useRouter } from 'next/router';

const ManagerNavBar: React.FC = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <div>
      {/* Full-Width Navbar */}
      <nav
        style={{
          backgroundColor: '#FF0000',
          color: '#FFFFFF',
          padding: '15px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          position: 'absolute',
          top: 0,
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <img
          src="https://s3.amazonaws.com/PandaExpressWebsite/Responsive/img/home/logo.png"
          alt="Panda Express Logo"
          style={{ width: '80px' }}
        />

        {/* Hamburger Menu Icon */}
        <div
          style={{
            fontSize: '24px',
            cursor: 'pointer',
          }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      </nav>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 99999,
            overflow: 'hidden',
          }}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li style={menuItemStyle} onClick={() => handleNavigation('/cashier')}>Customer Ordering</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/manager_orders')}>Orders</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/manager_employees')}>Employees</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/manager_reports')}>Reports</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/manager_menuitems')}>Menu Items</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/manager_inventoryitems')}>Inventory Items</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/menuboards/menuboard1')}>Menu Board</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/login')}>Logout</li>
          </ul>
          </div>
      )}
    </div>
  );
};

// Style for dropdown menu items
const menuItemStyle: React.CSSProperties = {
  padding: '12px 20px',
  cursor: 'pointer',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #E0E0E0',
  fontSize: '16px',
  color: '#D32F2F',
  textAlign: 'left',
  transition: 'background-color 0.3s',
};

export default ManagerNavBar;