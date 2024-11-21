import React, { useState } from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import ManagerNavBar from '@/components/ui/manager_nav_bar';

const ManagerOrders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [selectedYear, setSelectedYear] = useState('default');
  const [selectedMonth, setSelectedMonth] = useState('default');
  const [selectedDay, setSelectedDay] = useState('default');

  // Fetch orders based on the selected year, month, and day
  const fetchOrders = async () => {
    const query = new URLSearchParams();
    if (selectedYear !== 'default') query.append('year', selectedYear);
    if (selectedMonth !== 'default') query.append('month', selectedMonth);
    if (selectedDay !== 'default') query.append('day', selectedDay);

    try {
      const response = await fetch(`http://localhost:8080/api/orders?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const formatDate = (dateString: string) => {
    // Extract the year-month-day portion of the date
    return dateString.split('T')[0];
  };

  return (
    <> <ManagerNavBar />
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton />
        <h2 style={headingStyle}>Manage Orders</h2>

        {/* Dropdowns and Filter Button */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {/* Year Dropdown */}
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: '8px' }}>
            <option value="default">Select Year</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>

          {/* Month Dropdown */}
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ padding: '8px' }}>
            <option value="default">Select Month</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                {i + 1}
              </option>
            ))}
          </select>

          {/* Day Dropdown */}
          <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={{ padding: '8px' }}>
            <option value="default">Select Day</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                {i + 1}
              </option>
            ))}
          </select>

          {/* Filter Button */}
          <button
            onClick={fetchOrders}
            style={{
              padding: '8px 16px',
              backgroundColor: '#D32F2F',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Filter
          </button>
        </div>

        {/* Orders Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Order ID</th>
              <th style={tableHeaderStyle}>Order Total</th>
              <th style={tableHeaderStyle}>Order Time</th>
              <th style={tableHeaderStyle}>Staff ID</th>
              <th style={tableHeaderStyle}>Payment ID</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.order_id}>
                <td style={tableCellStyle}>{order.order_id}</td>
                <td style={tableCellStyle}>${order.total ? parseFloat(order.total).toFixed(2) : '0.00'}</td>
                <td style={tableCellStyle}>{formatDate(order.time)}</td>
                <td style={tableCellStyle}>{order.staff_id}</td>
                <td style={tableCellStyle}>{order.payment_id}</td>
                <td style={tableCellStyle}>View / Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default ManagerOrders;
