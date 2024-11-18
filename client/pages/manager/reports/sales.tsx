'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  pageStyle,
  overlayStyle,
  contentStyle,
  headingStyle,
  tableHeaderStyle,
  tableCellStyle,
} from '@/utils/tableStyles'
import BackButton from '@/components/ui/back_button'
import { useEffect } from 'react'

const Sales: React.FC = () => {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(),
    to: new Date(),
  })
  const [salesData, setSalesData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const generateReport = async () => {
    setLoading(true)
    try {
      const fromDate = dateRange.from.toISOString()
      const toDate = dateRange.to ? dateRange.to.toISOString() : new Date().toISOString()

      const response = await fetch(`/api/reports/sales?from=${fromDate}&to=${toDate}`)
      const data = await response.json()

      if (data.success) {
        setSalesData(data.data)
      } else {
        console.error('Failed to fetch sales data')
      }
    } catch (error) {
      console.error('Error fetching sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <BackButton />
        <h2 style={headingStyle}>Sales Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="col-span-1 md:col-span-2" style={{ maxWidth: '100%' }}>
            <CardHeader className="text-center">
              <CardTitle>Menu Items Sales</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading sales data...</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Menu Item</th>
                      <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Quantity Sold</th>
                      <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Sales Generated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map((item, index) => (
                      <tr key={index}>
                        <td style={{ ...tableCellStyle, textAlign: 'center' }}>{item.name}</td>
                        <td style={{ ...tableCellStyle, textAlign: 'center' }}>{item.quantity_sold}</td>
                        <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                          ${Number(item.sales_generated).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
          <Card className="col-span-1" style={{ maxHeight: '515px' }}>
            <CardHeader className="text-center">
              <CardTitle>Select Date Range</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) =>
                  setDateRange({
                    from: range?.from || new Date(),
                    to: range?.to || undefined,
                  })
                }
                className="rounded-md border"
              />
              <div className="mt-4 space-y-4 text-center">
                <div>
                  <p className="text-sm font-medium">From: {dateRange.from.toDateString()}</p>
                  <p className="text-sm font-medium">
                    To: {dateRange.to ? dateRange.to.toDateString() : 'Not selected'}
                  </p>
                </div>
                <Button
                  onClick={generateReport}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Sales
