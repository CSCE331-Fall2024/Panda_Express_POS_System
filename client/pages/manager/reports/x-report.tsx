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
        <h2 style={headingStyle}>X-Reports</h2>
        <div style={{ padding: '3px', marginBottom:'20px' }}>
          <p style={{marginBottom:'20px' }}>Select a report type to view or generate a detailed report:</p>
            {/* <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button style={{...buttonStyle, padding: '10px 20px', fontSize: '16px'}}
                    onClick ={() => handleGenerate(true)}> Generate</button>
                </div> */}
            </div>
        </div>
    </div>
  );
};


export default XReport;
