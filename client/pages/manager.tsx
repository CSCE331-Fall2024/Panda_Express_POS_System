import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './';
import Orders from './manager_orders';
import Employees from './manager_employees';
import Reports from './manager_reports';
import MenuItems from './manager_menuitems';
import InventoryItems from './manager_inventoryitems';
import Login from './login';

const Manager: React.FC = () => {
  return (
    <div>
      <h1>Manager View</h1>
      {/* <nav>
        <Link to="/manager">Home</Link>
        <Link to="/manager/orders">Orders</Link>
        <Link to="/manager/employees">Employees</Link>
        <Link to="/manager/reports">Reports</Link>
        <Link to="/manager/menu-items">Menu Items</Link>
        <Link to="/manager/inventory-items">Inventory Items</Link>
        <Link to="/login">Logout</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="orders" element={<Orders />} />
        <Route path="employees" element={<Employees />} />
        <Route path="reports" element={<Reports />} />
        <Route path="menu-items" element={<MenuItems />} />
        <Route path="inventory-items" element={<InventoryItems />} />
      </Routes> */}
    </div>
  );
};

export default Manager;