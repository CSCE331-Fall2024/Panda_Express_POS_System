'use client'

import React, { useState, useEffect } from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles'
import BackButton from '@/components/ui/back_button'

interface XReportItem {
  hour: string
  total_transactions: number
  total_sales: number
  tamu_id_sales: number
  credit_card_sales: number
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
        const response = await fetch('/api/reports/xreport')
        const data = await response.json()

        if (data.success) {
          const allHours = Array.from({ length: 8 }, (_, i) => ({
            hour: `${i + 8}:00`,
            total_transactions: 0,
            total_sales: 0.0,
            tamu_id_sales: 0.0,
            credit_card_sales: 0.0,
          }))

          const mergedData = allHours.map(hourItem => {
            const match = data.report.find((item: XReportItem) => item.hour === hourItem.hour)
            return match ? { ...hourItem, ...match } : hourItem
          })
          setXReportData(mergedData)

          // Calculate totals
          const totals = mergedData.reduce((acc, item) => ({
            totalTransactions: acc.totalTransactions + item.total_transactions,
            totalTamuIdSales: acc.totalTamuIdSales + item.tamu_id_sales,
            totalCreditCardSales: acc.totalCreditCardSales + item.credit_card_sales,
            totalSales: acc.totalSales + item.total_sales,
          }), { totalTransactions: 0, totalTamuIdSales: 0, totalCreditCardSales: 0, totalSales: 0 })

          setTotalTransactions(totals.totalTransactions)
          setTotalTamuIdTransactions(Math.round(totals.totalTamuIdSales))
          setTotalCreditCardTransactions(Math.round(totals.totalCreditCardSales))
          setTotalSales(totals.totalSales)
          setReportGenerationTime(new Date().toLocaleString())
        }
      } catch (error) {
        console.error('Failed to fetch X Report data:', error)
      }
    }

    fetchXReport()
  }, [])

  return (
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
              <div className="w-full max-w-3xl">
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
                  className="h-[300px]"
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
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="credit_card_sales"
                        fill="hsl(var(--secondary))"
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
                  <p>${totalSales.toFixed(2)}</p>
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
                    <tr className="bg-muted">
                      <th className="px-6 py-3 text-center font-medium">Hour</th>
                      <th className="px-6 py-3 text-center font-medium">Total Transactions</th>
                      <th className="px-6 py-3 text-center font-medium">Total Sales</th>
                      <th className="px-6 py-3 text-center font-medium">TAMU ID Sales</th>
                      <th className="px-6 py-3 text-center font-medium">Credit Card Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {xReportData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-6 py-4 text-center">{item.hour}</td>
                        <td className="px-6 py-4 text-center">{item.total_transactions}</td>
                        <td className="px-6 py-4 text-center">${item.total_sales.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">${item.tamu_id_sales.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">${item.credit_card_sales.toFixed(2)}</td>
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
  )
}