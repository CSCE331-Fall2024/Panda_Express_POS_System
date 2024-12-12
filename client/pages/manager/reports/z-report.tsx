/**
 * Z Report Component
 * 
 * @remarks
 * This component displays a Z Report for a given date.
 * It uses the fetchZReport function to get the Z Report data from the backend API.
 * It then processes the data and displays it in a table and chart format.
 */

'use client'

import { FC,  useState } from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

/**
 * Represents a single item in the Z Report with transaction and sales data.
 * 
 * @remarks
 * This interface defines the structure of transaction data for each employee.
 * 
 * @property {string} employee_name - The name of the employee.
 * @property {number} total_transactions - The total number of transactions for the employee.
 * @property {number} total_sales - The total sales for the employee.
 * 
 * @example
 * ```typescript
 * const zReportData: ZReportItem[] = [
 *   { employee_name: 'John Doe', total_transactions: 10, total_sales: 100 },
 *   { employee_name: 'Jane Smith', total_transactions: 5, total_sales: 50 },
 * ];
 * ```
 */
export interface ZReportItem {
  employee_name: string;
  total_transactions: number;
  total_sales: number;
}

/**
 * Z Report Component
 * 
 * @remarks
 * This component displays a Z Report for a given date.
 * It uses the fetchZReport function to get the Z Report data from the backend API.
 * It then processes the data and displays it in a table and chart format.
 */
export const ZReport: FC = () => {
  const [zReportData, setZReportData] = useState<ZReportItem[]>([]);
  const [totals, setTotals] = useState({
    totalTransactions: 0,
    totalSales: '0.00',
    creditCardSales: '0.00',
    tamuIdSales: '0.00',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyGenerated, setAlreadyGenerated] = useState(false);

  const fetchZReport = async () => {
    setIsLoading(true);
    setError(null);
    setAlreadyGenerated(false);
    try {
      const response = await fetch('/api/reports/zreport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ date: currentDate }),
        body: JSON.stringify({ date: "2023-09-21" }),
      });
      const data = await response.json();

      if (data.success) {
        const processedReportData = data.report.map((item: ZReportItem) => {
          const firstName = item.employee_name.split(' ')[0];
          const shortName = firstName.length > 6 ? `${firstName.substring(0, 6)}...` : firstName;
        
          return {
            ...item,
            total_sales: Number(item.total_sales),
            short_name: shortName, 
          };
        });

        setZReportData(processedReportData);
        setTotals({
          totalTransactions: data.totals.total_transactions,
          totalSales: data.totals.total_sales,
          creditCardSales: data.totals.credit_card_sales,
          tamuIdSales: data.totals.tamu_id_sales,
        });
        setAlreadyGenerated(data.alreadyGenerated);
      } else {
        setError(data.message || 'Failed to fetch Z Report data');
      }
    } catch (error) {
      console.error('Failed to fetch Z Report data:', error);
      setError('Failed to fetch Z Report data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <> 
      {/* <ManagerNavBar /> */}
      <div style={pageStyle}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          {/* change current date  */}
          <h2 style={headingStyle}>Z-Report for {new Date().toLocaleDateString()}</h2>

          <div className="mb-4"> {/* Adds margin-bottom for spacing */}
              <Button
                onClick={fetchZReport}
                variant="destructive"
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {alreadyGenerated && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Report Already Generated</AlertTitle>
              <AlertDescription>
                The Z-Report for today has already been generated. The data shown is from the stored report.
              </AlertDescription>
            </Alert>
          )}

          {zReportData.length > 0 && (
            <>
              <div>
                <table style={{ width: '100%', textAlign: 'center', marginBottom: '20px'}}>
                  <thead>
                  <tr>
                    <th style={{ paddingRight: '20px' }}>Total Transactions:</th>
                    <th style={{ paddingLeft: '20px' }}>Total Sales:</th>
                    <th style={{ paddingLeft: '20px' }}>Tax Collected:</th>
                    <th style={{ paddingLeft: '20px' }}>Credit Card Sales:</th>
                    <th style={{ paddingLeft: '20px' }}>TAMU ID Sales:</th>
                  </tr> 
                  </thead>
                  <tbody>
                  <tr>
                    <td>{totals.totalTransactions}</td>
                    <td>${totals.totalSales}</td>
                    <td>${(Number(totals.totalSales) * 0.0825).toFixed(2)}</td>
                    <td>${totals.creditCardSales}</td>
                    <td>${totals.tamuIdSales}</td>
                  </tr>   
                  </tbody>
                </table>
              </div>
              {/* Bar Chart for Sales per Employee */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-center">Sales per Employee</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div style={{ width: '800px', height: '300px' }} className="w-full">
                    <ChartContainer
                      config={{
                        total_sales: {
                          label: 'Total Sales',
                          color: 'hsl(var(--primary))',
                        },
                      }}
                      className="h-[300px] w-[95%]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={zReportData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis
                            dataKey="short_name"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            angle={-45} // Rotate labels by -45 degrees
                            textAnchor="end"
                            height={60}
                            interval={0}
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
                            dataKey="total_sales"
                            fill="#D32F2F"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <table className="w-4/5 mx-auto border-collapse">
                <thead>
                  <tr className="bg-[#D32F2F]">
                    <th className="w-1/3 px-4 py-2 text-center border-b text-white">Employee</th>
                    <th className="w-1/3 px-4 py-2 text-center border-b text-white">Total Transactions</th>
                    <th className="w-1/3 px-4 py-2 text-center border-b text-white">Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {zReportData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-4 py-2 text-center border-b border-gray-300">{item.employee_name}</td>
                      <td className="px-4 py-2 text-center border-b border-gray-300">{item.total_transactions}</td>
                      <td className="px-4 py-2 text-center border-b border-gray-300">${Number(item.total_sales).toFixed(2)}</td>
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