import React from 'react';
import { useRouter } from 'next/router';
import { pageStyle, overlayStyle, contentStyle, headingStyle, tableHeaderStyle, tableCellStyle, buttonStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';

const XReport: React.FC = () => {
    const handleGenerate = (generate: boolean) =>{

    }
  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        {/* Back Button */}
        <BackButton/>
        <h2 style={headingStyle}>X-Report</h2>
      </div>
    </div>
  );
};


export default XReport;
