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
      </div>
      </>
  );
};

export default Manager;