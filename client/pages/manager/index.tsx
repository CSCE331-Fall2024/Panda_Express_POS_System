import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import ManagerNavBar from '@/components/ui/manager_nav_bar';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';


const Manager: React.FC = () => {

  return (
    <>
    <ManagerNavBar />
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          marginTop: '100px',
          width: '100%',
          maxWidth: '100%',
          height: '30%',
          maxHeight: '75%',
          zIndex: 20,
        }}
      >
        {/* Welcome Message-- placeholder text for now */}
        <h1
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '50px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '10px',
          }}
        >
          Welcome to the Manager View.
        </h1>
        <h2
        style={{
          fontSize:'20px',
          paddingBottom: '20px',
          fontStyle: 'italic',
          color: 'white'
        }}>
          Navigate to the ☰ to begin.
        </h2>
        </div>
      </div>
      </>
  );
};

export default Manager;