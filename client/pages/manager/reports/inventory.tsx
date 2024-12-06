// pages/manager/manager_reports/inventory_usage_chart.tsx
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

interface InventoryUsageData {
  inventory_name: string;
  total_used: number;
}

interface InventoryChartData {
  labels: string[];
  dataSet: number[];
}

// Fetch data from the `/api/reports/inventory` endpoint
const fetchInventoryData = async (from: string, to: string): Promise<InventoryUsageData[]> => {
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

// Format data for the chart
const formatChartData = (usageData: InventoryUsageData[]): InventoryChartData => {
  const labels = usageData.map((item) => item.inventory_name);
  const dataSet = usageData.map((item) => Number(item.total_used));

  return { labels, dataSet };
};

// Chart component
const InventoryUsageChart: FC = () => {
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
