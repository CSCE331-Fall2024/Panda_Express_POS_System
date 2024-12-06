'use client';

import React, { useState, useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import ManagerNavBar from '@/components/ui/manager_nav_bar';

interface XReportItem {
  hour: string;
  total_transactions: number;
  total_sales: number;
  tamu_id_sales: number;
  credit_card_sales: number;
}

const XReport: React.FC = () => {
  const [xReportData, setXReportData] = useState<XReportItem[]>([]);
  const [reportGenerationTime, setReportGenerationTime] = useState('');
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  const staticTexts = [
    'Sales Per Hour',
    'Report Summary',
    'Report Generation Time',
    'Total Transactions',
    'Total Sales',
    'Hourly Transaction Details',
  ];

  useEffect(() => {
    if (language === 'en') {
      const map: { [key: string]: string } = {};
      staticTexts.forEach((t) => (map[t] = t));
      setTranslations(map);
    } else {
      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: staticTexts, targetLanguage: 'es' }),
      })
        .then((res) => res.json())
        .then((data) => {
          const map: { [key: string]: string } = {};
          staticTexts.forEach((t, i) => (map[t] = data.translatedTexts[i]));
          setTranslations(map);
        })
        .catch(() => {
          const map: { [key: string]: string } = {};
          staticTexts.forEach((t) => (map[t] = t));
          setTranslations(map);
        });
    }
  }, [language]);

  const t = (text: string) => translations[text] || text;

  useEffect(() => {
    const fetchXReport = async () => {
      try {
        const date = new Date().toISOString().split('T')[0];
        const response = await fetch('/api/reports/xreport', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date }),
        });

        const data = await response.json();
        if (data.success) {
          setXReportData(data.report);
          const totals = data.report.reduce(
            (acc: { totalTransactions: number; totalSales: number }, item: XReportItem) => ({
              totalTransactions: acc.totalTransactions + item.total_transactions,
              totalSales: acc.totalSales + item.total_sales,
            }),
            { totalTransactions: 0, totalSales: 0 }
          );
          setTotalTransactions(totals.totalTransactions);
          setTotalSales(totals.totalSales);
          setReportGenerationTime(new Date().toLocaleString());
        }
      } catch (error) {
        console.error('Failed to fetch X Report data:', error);
      }
    };
    fetchXReport();
  }, []);

  return (
    <>
      <ManagerNavBar language={language} setLanguage={setLanguage} />
      <div style={pageStyle}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          <h2 style={headingStyle}>{t('Sales Per Hour')}</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{t('Report Summary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t('Report Generation Time')}: {reportGenerationTime}</p>
              <p>{t('Total Transactions')}: {totalTransactions}</p>
              <p>{t('Total Sales')}: ${totalSales.toFixed(2)}</p>
            </CardContent>
          </Card>
          {/* Add BarChart or Table rendering here */}
        </div>
      </div>
    </>
  );
};

export default XReport;
