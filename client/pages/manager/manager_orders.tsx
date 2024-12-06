import { FC, useState, useEffect } from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import ManagerNavBar from '@/components/ui/manager_nav_bar';

const ManagerOrders: FC = () => {
  const [orders, setOrders] = useState([]);
  const [selectedYear, setSelectedYear] = useState('default');
  const [selectedMonth, setSelectedMonth] = useState('default');
  const [selectedDay, setSelectedDay] = useState('default');
  // Translation
  const [language, setLanguage] = useState<'en'|'es'>('en');
  const [translations, setTranslations] = useState<{[key:string]:string}>({});

  const staticTexts = [
    "Manage Orders",
    "Select Year",
    "Select Month",
    "Select Day",
    "Filter",
    "Order ID",
    "Order Total",
    "Order Time",
    "Staff ID",
    "Payment ID",
    "Actions",
    "View / Edit"
  ];

  useEffect(()=>{
    const saved=localStorage.getItem('language');
    if(saved==='es') setLanguage('es');
  },[]);

  useEffect(()=>{
    if(language==='en'){
      const map:{[k:string]:string}={};
      staticTexts.forEach(t=>map[t]=t);
      setTranslations(map);
    } else {
      fetch('/api/translate',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({texts:staticTexts, targetLanguage:'es'})
      })
      .then(r=>r.json())
      .then(data=>{
        if(data.translatedTexts){
          const map:{[k:string]:string}={};
          staticTexts.forEach((t,i)=>map[t]=data.translatedTexts[i]);
          setTranslations(map);
        } else {
          const map:{[k:string]:string}={};
          staticTexts.forEach(t=>map[t]=t);
          setTranslations(map);
        }
      })
      .catch(()=>{
        const map:{[k:string]:string}={};
        staticTexts.forEach(t=>map[t]=t);
        setTranslations(map);
      })
    }
    localStorage.setItem('language', language);
  },[language]);

  const t=(text:string)=>translations[text]||text;
  // Fetch orders based on the selected year, month, and day
  const fetchOrders = async () => {
    const query = new URLSearchParams();
    if (selectedYear !== 'default') query.append('year', selectedYear);
    if (selectedMonth !== 'default') query.append('month', selectedMonth);
    if (selectedDay !== 'default') query.append('day', selectedDay);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/orders?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return dateString.split('T')[0];
  };

  return (
    <> 
      <ManagerNavBar language={language} setLanguage={setLanguage} />
      <div style={pageStyle}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          <h2 style={headingStyle}>{t("Manage Orders")}</h2>
          {/* Dropdowns and Filter Button */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {/* Year Dropdown */}
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: '8px' }}>
              <option value="default">{t("Select Year")}</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
            {/* Month Dropdown */}
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ padding: '8px' }}>
              <option value="default">{t("Select Month")}</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                  {i + 1}
                </option>
              ))}
            </select>
            {/* Day Dropdown */}
            <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={{ padding: '8px' }}>
              <option value="default">{t("Select Day")}</option>
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
              {t("Filter")}
            </button>
          </div>
          {/* Orders Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>{t("Order ID")}</th>
                <th style={tableHeaderStyle}>{t("Order Total")}</th>
                <th style={tableHeaderStyle}>{t("Order Time")}</th>
                <th style={tableHeaderStyle}>{t("Staff ID")}</th>
                <th style={tableHeaderStyle}>{t("Payment ID")}</th>
                <th style={tableHeaderStyle}>{t("Actions")}</th>
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
                  <td style={tableCellStyle}>{t("View / Edit")}</td>
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
