import React, { useState, useEffect } from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import { isDate } from 'date-fns';
import ManagerNavBar from '@/components/ui/manager_nav_bar';

interface ZReportItem {
  employee_name: string;
  total_transactions: number;
  total_sales: number;
}

const ZReport: React.FC = () => {
  const [zReportData, setZReportData] = useState<ZReportItem[]>([]);
  const [totals, setTotals] = useState({ totalTransactions: 0, totalSales: 0 });
  const [reportGenerated, setReportGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const today = new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    const fetchZReport = async () => {
      try {
        const response = await fetch('/api/reports/zreport');
        const data = await response.json();

        if (data.success) {
          setZReportData(data.report);
          setTotals({
            totalTransactions: data.totals.totalTransactions,
            totalSales: data.totals.totalSales,
          });
          setReportGenerated(true);
        } else if (data.message === 'Z-Report already generated for today') {
          setErrorMessage(data.message);
          setReportGenerated(true);
        }
      } catch (error) {
        console.error('Failed to fetch Z Report data:', error);
        setErrorMessage('Failed to fetch report. Please try again later.');
      }
    };

    fetchZReport();
  }, []);

  return (
    <> <ManagerNavBar />
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton />
        {/* change current date  */}
        <h2 style={headingStyle}>Z-Report for {today} </h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {!reportGenerated ? (
            <div>
              <p>Z-Report has already been generated for today.</p>
              </div>
          ) : (
            <>
        <div>
          <table style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ paddingRight: '20px' }}><p>Total Transactions:</p></th>
                <th style={{ paddingLeft: '20px' }}><p>Total Sales:</p></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totals.totalTransactions}</td>
                <td>${totals.totalSales}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Employee</th>
              <th style={tableHeaderStyle}>Total Transactions</th>
              <th style={tableHeaderStyle}>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {zReportData.map((item, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{item.employee_name}</td>
                <td style={tableCellStyle}>{item.total_transactions}</td>
                <td style={tableCellStyle}>${item.total_sales}</td>
                </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ZReport;
