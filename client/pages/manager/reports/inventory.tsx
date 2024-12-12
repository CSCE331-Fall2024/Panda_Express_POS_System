/**
 * Displays a chart for total inventory usage across a date range for managers.
 * 
 * @remarks
 * This component uses Chart.js for rendering a line chart to visualize inventory usage.
 * It fetches data from the backend API and formats it for display in a chart.
 */
import { FC, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  pageStyle,
  overlayStyle,
  contentStyle,
  headingStyle,
} from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Represents the inventory usage data for an individual item.
 * @typedef {Object} InventoryUsageData
 * @property {string} inventory_name - The name of the inventory item.
 * @property {number} total_used - The total amount of the item used in the specified date range.
 * 
 * @example
 * ```typescript
 * const inventoryData: InventoryUsageData[] = [
 *   { inventory_name: 'Item 1', total_used: 100 },
 *   { inventory_name: 'Item 2', total_used: 50 },
 * ];
 * ```
 */
export interface InventoryUsageData {
  inventory_name: string;
  total_used: number;
}

/**
 * Represents the data for the inventory usage chart.
 * @typedef {Object} InventoryChartData
 * @property {string[]} labels - The labels for the chart.
 * @property {number[]} dataSet - The data for the chart.
 * 
 * @example
 * ```typescript
 * const inventoryChartData: InventoryChartData = {
 *   labels: ['Item 1', 'Item 2'],
 *   dataSet: [100, 50],
 * };
 * ```
 */
export interface InventoryChartData {
  labels: string[];
  dataSet: number[];
}

/**
 * Fetches inventory usage data for a given date range.
 * 
* @remarks 
 * This function fetches inventory usage data for a given date range from the backend API.
 * It returns a promise that resolves with the inventory usage data.
 * 
 * @example
 * ```typescript
 * const inventoryData = await fetchInventoryData('2024-01-01', '2024-01-31');
 * ```
 * 
 * @param {string} from - The start date of the date range in `YYYY-MM-DD` format.
 * @param {string} to - The end date of the date range in `YYYY-MM-DD` format.
 * @returns {Promise<InventoryUsageData[]>} A promise that resolves with the inventory usage data.
 * @throws {Error} Throws an error if the fetch request fails or the response is not successful.
 */
export const fetchInventoryData = async (from: string, to: string): Promise<InventoryUsageData[]> => {
  const response = await fetch(`/api/reports/inventory?from=${from}&to=${to}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch inventory data: ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Unknown error occurred');
  }
  return data.data;
};

/**
 * Formats raw inventory usage data for display in the chart.
 *
 * @remarks
 * This function formats raw inventory usage data for display in the chart.
 * It takes the raw inventory usage data and returns the formatted chart data.
 * 
 * @example
 * ```typescript
 * const inventoryChartData = formatChartData(inventoryData);
 * ```
 * 
 * @param {InventoryUsageData[]} usageData - The raw inventory usage data.
 * @returns {InventoryChartData} The formatted chart data.
 */
export const formatChartData = (usageData: InventoryUsageData[]): InventoryChartData => {
  const labels = usageData.map((item) => item.inventory_name);
  const dataSet = usageData.map((item) => Number(item.total_used));

  return { labels, dataSet };
};

/**
 * Displays an interactive chart for inventory usage across a date range.
 * 
 * @remarks 
 * This component displays an interactive chart for inventory usage across a date range.
 * It uses the fetchInventoryData function to get the inventory usage data from the backend API.
 * It then processes the data and displays it in a chart format.
 * 
 * @returns {JSX.Element} The rendered InventoryUsageChart component.
 */
export const InventoryUsageChart: FC = () => {
  const [chartData, setChartData] = useState<InventoryChartData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State variables for date range
  const [fromDate, setFromDate] = useState<string>('2023-01-01'); // Default start date
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]); // Today's date

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInventoryData(fromDate, toDate);
        const formattedData = formatChartData(data);
        setChartData(formattedData);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  if (error) {
    return (
      <>
        {/* <ManagerNavBar /> */}
        <div style={{ ...pageStyle, paddingTop: '40px' }}>
          <div style={overlayStyle}></div>
          <div style={contentStyle}>
            <BackButton />
            <h2 style={headingStyle}>Inventory Usage Chart</h2>
            <p>Error: {error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!chartData) {
    return (
      <>
        {/* <ManagerNavBar /> */}
        <div style={{ ...pageStyle, paddingTop: '40px' }}>
          <div style={overlayStyle}></div>
          <div style={contentStyle}>
            <BackButton />
            <h2 style={headingStyle}>Inventory Usage Chart</h2>
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: '', // Removed 'Total Used' label
        data: chartData.dataSet,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      title: {
        display: true,
        text: 'Inventory Usage Chart',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Inventory Items', // X-axis label
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Used', // Y-axis label
        },
      },
    },
  };

  return (
    <>
      {/* <ManagerNavBar /> */}
      <div style={{ ...pageStyle, paddingTop: '40px' }}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          <h2 style={headingStyle}>Inventory Usage Chart</h2>

          {/* Time Window Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label>From: </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ marginRight: '20px' }}
            />
            <label>To: </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <Line data={data} options={options} />
        </div>
      </div>
    </>
  );
};

export default InventoryUsageChart;
