import React from 'react';
import { useRouter } from 'next/router';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle, buttonStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';

const ZReport: React.FC = () => {
  const router = useRouter();

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        {/* Back Button */}
        <BackButton/>
        <h2 style={headingStyle}>Z-Report</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {/* <th style={tableHeaderStyle}>Order ID</th>
              <th style={tableHeaderStyle}>Customer Name</th>
              <th style={tableHeaderStyle}>Order Total</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {/* Sample row */}
            <tr>
              {/* <td style={tableCellStyle}>12345</td>
              <td style={tableCellStyle}>John Doe</td>
              <td style={tableCellStyle}>$45.00</td>
              <td style={tableCellStyle}>Pending</td>
              <td style={tableCellStyle}>View / Edit</td> */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ZReport;
