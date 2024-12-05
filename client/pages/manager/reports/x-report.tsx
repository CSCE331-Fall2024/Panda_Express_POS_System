'use client'

import React, { useState, useEffect } from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button'
import ManagerNavBar from '@/components/ui/manager_nav_bar';


interface XReportItem {
  hour: string
  total_transactions: number
  total_sales: number
  tamu_id_sales: number
  credit_card_sales: number
}

interface Totals {
  totalTransactions: number;
  totalTamuIdSales: number;
  totalCreditCardSales: number;
  totalSales: number;
}


export default function XReport() {
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

  const cardStyle = {
    backgroundColor: '#0a0a0a',
    color: '#ededed',
  };

  return (
    <> <ManagerNavBar />
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton />
        <h2 style={headingStyle}>X-Report</h2>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sales Per Hour</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div style={{ width: '800px', height: '300px' }} className="w-full">
                <ChartContainer
                  config={{
                    tamu_id_sales: {
                      label: "TAMU ID Sales",
                      color: "hsl(var(--primary))",
                    },
                    credit_card_sales: {
                      label: "Credit Card Sales",
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
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
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
              <CardTitle className="text-center">Report Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="font-semibold">Report Generation Time:</p>
                  <p>{reportGenerationTime}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Transactions:</p>
                  <p>{totalTransactions}</p>
                </div>
                <div>
                  <p className="font-semibold">Total TAMU ID Transactions:</p>
                  <p>{totalTamuIdTransactions}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Credit Card Transactions:</p>
                  <p>{totalCreditCardTransactions}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Sales:</p>
                  <p>${Number(totalSales).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Hourly Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full">
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

