/**
 * Represents the busiest days overview component.
 * 
 * @remarks
 * This component displays the busiest days based on sales data.
 * 
 * @returns {JSX.Element} The rendered component.
 */
import {FC, CSSProperties} from 'react';

/**
 * Represents the busiest days overview component.
 * 
 * @remarks
 * This component displays the busiest days based on sales data.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export interface BusiestDay {
  period: string;
  date: string;
  day: string;
  total_sales: number;
}

export interface BusiestDaysBoxProps {
  busiestDaysData: BusiestDay[];
}

/**
 * Represents the busiest days overview component.
 * 
 * @remarks
 * This component displays the busiest days based on sales data.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export const BusiestDaysBox: FC<BusiestDaysBoxProps> = ({ busiestDaysData }) => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        marginTop: '20px',
        width: '60%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333',
        }}
      >
        📈 Busiest Days Overview
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Period</th>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Day</th>
            <th style={tableHeaderStyle}>Sales ($)</th>
          </tr>
        </thead>
        <tbody>
          {busiestDaysData.map((item, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>{capitalizeFirstLetter(item.period)}</td>
              <td style={tableCellStyle}>{item.date.substring(0,10)}</td>
              <td style={tableCellStyle}>{item.day}</td>
              <td style={tableCellStyle}>{item.total_sales.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle: CSSProperties = {
  borderBottom: '2px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  fontSize: '16px',
  color: '#555',
};

const tableCellStyle: CSSProperties = {
  borderBottom: '1px solid #ddd',
  padding: '8px',
  fontSize: '14px',
  color: '#333',
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default BusiestDaysBox;
