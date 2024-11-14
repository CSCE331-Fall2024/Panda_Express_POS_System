import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle, buttonStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';

interface XReportItem {
  hour: string;
  total_transactions: number;
  total_sales: number;
  tamu_id_sales: number;
  credit_card_sales: number;
}

const XReport: React.FC = () => {
  const [xReportData, setXReportData] = useState<XReportItem[]>([]);

  useEffect(() => {
    const fetchXReport = async () => {
      try {
        const response = await fetch('/api/reports/xreport');
        const data = await response.json();

        if (data.success) {
          const allHours = Array.from({ length: 8 }, (_, i) => ({
            hour: `${i+8}:00`,
            total_transactions: 0,
            total_sales: 0.0,
            tamu_id_sales: 0.0,
            credit_card_sales: 0.0,
          }));

          const mergedData = allHours.map(hourItem => {
            const match = data.report.find((item: XReportItem) => item.hour === hourItem.hour);
            return match ? { ...hourItem, ...match } : hourItem;
          });
          setXReportData(mergedData);
        }
      } catch (error) {
        console.error('Failed to fetch X Report data:', error);
      }
    };

    fetchXReport();
  }, []);

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        {/* Back Button */}
        <BackButton/>
        <h2 style={headingStyle}>X-Report</h2>
        <table>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Hour</th>
              <th style={tableHeaderStyle}>Total Transactions</th>
              <th style={tableHeaderStyle}>Total Sales</th>
              <th style={tableHeaderStyle}>TAMU ID Sales</th>
              <th style={tableHeaderStyle}>Credit Card Sales</th>
              </tr>
          </thead>
          <tbody>
          {xReportData.map((item, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{item.hour}</td>
                <td style={tableCellStyle}>{item.total_transactions}</td>
                <td style={tableCellStyle}>{item.total_sales}</td>
                <td style={tableCellStyle}>{item.tamu_id_sales}</td>
                <td style={tableCellStyle}>{item.credit_card_sales}</td>

              </tr>
            ))}
          </tbody>
          </table>
      </div>
    </div>
  );
};

export default XReport;
