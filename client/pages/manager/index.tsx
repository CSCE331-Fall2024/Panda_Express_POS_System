import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ManagerNavBar from '@/components/ui/manager_nav_bar';
import { pageStyle, overlayStyle } from '@/utils/tableStyles';
import { useUser } from '@/components/ui/user_context';
import BusiestDaysBox from '@/components/ui/BusiestDayBox';

interface BusiestDay {
  period: string;
  date: string;
  day: string;
  total_sales: number;
}

const Manager: React.FC = () => {
  const router = useRouter();
  const { user, isManager, isCashier } = useUser();
  const [busiestDaysData, setBusiestDaysData] = useState<BusiestDay[]>([]);

  useEffect(() => {
    if (!isManager()) {
      router.push('/login'); 
    }
  }, [user, router, isManager, isCashier]);

  useEffect(() => {
    fetchBusiestDays();
  }, []);

  const fetchBusiestDays = async () => {
    try {
      const response = await fetch('/api/busiest');
      const data = await response.json();

      if (data.success) {
        setBusiestDaysData(data.data);
      } else {
        console.error('Failed to fetch busiest days:', data.message);
      }
    } catch (error) {
      console.error('Error fetching busiest days:', error);
    }
  };

  if (!isManager()) return null;

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
            zIndex: 20,
          }}
        >
          {/* Welcome Message */}
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
              fontSize: '20px',
              paddingBottom: '20px',
              fontStyle: 'italic',
              color: 'white',
            }}
          >
            Navigate to the ☰ to begin.
          </h2>
          {busiestDaysData.length > 0 && (
            <BusiestDaysBox busiestDaysData={busiestDaysData} />
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
