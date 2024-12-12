/**
 * X Report Component
 * 
 * @remarks
 * This component displays an X Report for a given date.
 * It uses the fetchXReport function to get the X Report data from the backend API.
 * It then processes the data and displays it in a table and chart format.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button'
import ManagerNavBar from '@/components/ui/manager_nav_bar';

/**
 * Represents a single item in the X Report with transaction and sales data.
 * 
 * @remarks
 * This interface defines the structure of transaction data for each hour.
 * 
 * @property {string} hour - The hour of the day.
 * @property {number} total_transactions - The total number of transactions for the hour.
 * @property {number} total_sales - The total sales for the hour.
 * 
 * @example
 * ```typescript
 * const xReportData: XReportItem[] = [
 *   { hour: '00:00', total_transactions: 10, total_sales: 100, tamu_id_sales: 50, credit_card_sales: 50 },
 *   { hour: '01:00', total_transactions: 5, total_sales: 50, tamu_id_sales: 25, credit_card_sales: 25 },
 * ];
 * ```
 */
export interface XReportItem {
  hour: string
  total_transactions: number
  total_sales: number
  tamu_id_sales: number
  credit_card_sales: number
}

/**
 * Represents the totals for the X Report.
 *  
 * @remarks
 * This interface defines the structure of totals for the X Report.
 * 
 * @property {number} totalTransactions - The total number of transactions.
 * @property {number} totalTamuIdSales - The total number of TAMU ID sales.
 * @property {number} totalCreditCardSales - The total number of credit card sales.
 * @property {number} totalSales - The total sales.
 * 
 * @example
 * ```typescript
 * const totals: Totals = { totalTransactions: 100, totalTamuIdSales: 50, totalCreditCardSales: 50, totalSales: 100 };
 * ```
 */
export interface Totals {
  totalTransactions: number;
  totalTamuIdSales: number;
  totalCreditCardSales: number;
  totalSales: number;
}

/**
 * X Report Component
 * 
 * @remarks
 * This component displays an X Report for a given date.
 * It uses the fetchXReport function to get the X Report data from the backend API.
 * It then processes the data and displays it in a table and chart format.
 * 
 */
export default function XReport() {
  // Language state
  const [language, setLanguage] = useState<'en'|'es'>('en');

  // Static texts to be translated on this page
  const staticTexts = [
    "X-Report",
    "Sales Per Hour",
    "Report Summary",
    "Report Generation Time:",
    "Total Transactions:",
    "Total TAMU ID Transactions:",
    "Total Credit Card Transactions:",
    "Total Sales:",
    "Hourly Transaction Details",
    "Hour",
    "Total Transactions",
    "Total Sales",
    "TAMU ID Sales",
    "Credit Card Sales",
    "Sign in with Google"
  ];

  const [translations, setTranslations] = useState<{[key:string]:string}>({});

  // Fetch translations when language changes
  useEffect(() => {
    if (language === 'en') {
      // English default - no need to translate
      const map: {[k:string]:string} = {};
      staticTexts.forEach(t => (map[t] = t));
      setTranslations(map);
    } else {
      // Translate to Spanish
      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: staticTexts, targetLanguage: 'es' })
      })
      .then(res => res.json())
      .then(data => {
        if (data.translatedTexts) {
          const map: {[k:string]:string} = {};
          staticTexts.forEach((t, i) => {
            map[t] = data.translatedTexts[i];
          });
          setTranslations(map);
        } else {
          // If something goes wrong, fallback to original
          const map: {[k:string]:string} = {};
          staticTexts.forEach(t => (map[t] = t));
          setTranslations(map);
        }
      })
      .catch(() => {
        // On error, fallback to original text
        const map: {[k:string]:string} = {};
        staticTexts.forEach(t => (map[t] = t));
        setTranslations(map);
      });
    }
  }, [language]);

  const t = (text: string) => translations[text] || text;

  const [xReportData, setXReportData] = useState<XReportItem[]>([])
  const [reportGenerationTime, setReportGenerationTime] = useState<string>('')
  const [totalTransactions, setTotalTransactions] = useState<number>(0)
  const [totalTamuIdTransactions, setTotalTamuIdTransactions] = useState<number>(0)
  const [totalCreditCardTransactions, setTotalCreditCardTransactions] = useState<number>(0)
  const [totalSales, setTotalSales] = useState<number>(0)

  useEffect(() => {
    const fetchXReport = async () => {
      try {
        // const date = new Date().toISOString().split('T')[0];
        const date = "2023-09-21";
        // const date = "2024-12-3";

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
  
          // Calculate totals
          const totals: Totals = data.report.reduce(
            (acc: Totals, item: XReportItem) => ({
              totalTransactions: acc.totalTransactions + item.total_transactions,
              totalTamuIdSales: acc.totalTamuIdSales + Number(item.tamu_id_sales),
              totalCreditCardSales: acc.totalCreditCardSales + Number(item.credit_card_sales),
              totalSales: acc.totalSales + Number(item.total_sales),
            }),
            { totalTransactions: 0, totalTamuIdSales: 0, totalCreditCardSales: 0, totalSales: 0 }
          );
  
          setTotalTransactions(totals.totalTransactions);
          setTotalTamuIdTransactions(Math.round(totals.totalTamuIdSales));
          setTotalCreditCardTransactions(Math.round(totals.totalCreditCardSales));
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
          <h2 style={headingStyle}>{t("X-Report")}</h2>
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">{t("Sales Per Hour")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div style={{ width: '800px', height: '300px' }} className="w-full">
                  <ChartContainer
                    config={{
                      tamu_id_sales: {
                        label: t("TAMU ID Sales"),
                        color: "hsl(var(--primary))",
                      },
                      credit_card_sales: {
                        label: t("Credit Card Sales"),
                        color: "hsl(var(--secondary))",
                      },
                    }}
                    className="h-[300px] w-[95%]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={xReportData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="hour"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          label={{ value: t("Hour"), position: 'insideBottomCenter', offset: -5 }}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${value}`}
                          label={{ value: t("Total Sales"), angle: -90, position: 'insideLeft', offset: 10 }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="tamu_id_sales"
                          fill="#D32F2F"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="credit_card_sales"
                          fill="#0a0a0a"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">{t("Report Summary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <p className="font-semibold">{t("Report Generation Time:")}</p>
                    <p>{reportGenerationTime}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{t("Total Transactions:")}</p>
                    <p>{totalTransactions}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{t("Total TAMU ID Transactions:")}</p>
                    <p>{totalTamuIdTransactions}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{t("Total Credit Card Transactions:")}</p>
                    <p>{totalCreditCardTransactions}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{t("Total Sales:")}</p>
                    <p>${Number(totalSales).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">{t("Hourly Transaction Details")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>{t("Hour")}</th>
                        <th style={tableHeaderStyle}>{t("Total Transactions")}</th>
                        <th style={tableHeaderStyle}>{t("Total Sales")}</th>
                        <th style={tableHeaderStyle}>{t("TAMU ID Sales")}</th>
                        <th style={tableHeaderStyle}>{t("Credit Card Sales")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {xReportData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100 border-b">
                          <td className="px-6 py-4 text-center">{item.hour}</td>
                          <td className="px-6 py-4 text-center">{item.total_transactions}</td>
                          <td className="px-6 py-4 text-center">${Number(item.total_sales).toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">${Number(item.tamu_id_sales).toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">${Number(item.credit_card_sales).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}