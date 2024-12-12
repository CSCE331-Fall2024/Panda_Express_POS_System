/**
 * This file is part of the Manager section of the application.
 * It includes the functionality for displaying the manager dashboard and managing various reports and settings.
 * 
 * @remarks
 * This component renders the Manager Dashboard page, displaying a welcome message and navigation options.
 * It also includes a section to display the busiest days of the week based on sales data.
 * 
 * @returns {JSX.Element} The rendered Manager component.
 */
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ManagerNavBar from '@/components/ui/manager_nav_bar';
import { pageStyle, overlayStyle } from '@/utils/tableStyles';
import { useUser } from '@/components/ui/user_context';
import BusiestDaysBox from '@/components/ui/BusiestDayBox';

/**
 * @interface
 * @property {string} period - The period of the busiest day.
 * @property {string} date - The date of the busiest day.
 * @property {string} day - The day of the busiest day.
 * @property {number} total_sales - The total sales for the busiest day.
 * 
 * @example
 * ```typescript
 * const busiestDay: BusiestDay = { period: 'Morning', date: '2024-01-01', day: 'Monday', total_sales: 1000 };
 * ```
 */
export interface BusiestDay {
  period: string;
  date: string;
  day: string;
  total_sales: number;
}

/**
 * Manager Component
 * 
 * This component renders the Manager Dashboard page, displaying a welcome message and navigation options.
 * It also includes a section to display the busiest days of the week based on sales data.
 * 
 * @returns {JSX.Element} The rendered Manager component.
 */
export const Manager: FC = () => {
  const router = useRouter();
  const { user, isManager, isCashier } = useUser();
  const [busiestDaysData, setBusiestDaysData] = useState<BusiestDay[]>([]);

  // Language and translation states
  const [language, setLanguage] = useState<'en'|'es'>('en');
  const [translations, setTranslations] = useState<{[key:string]:string}>({});

  // Texts to translate
  const staticTexts = [
    "Welcome to the Manager View.",
    "Navigate to the ☰ to begin."
  ];

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'es') {
      setLanguage('es');
    }
  }, []);

  // When language changes, translate texts if needed
  useEffect(() => {
    if (language === 'en') {
      // English is default
      const map: {[k:string]:string} = {};
      staticTexts.forEach(t => map[t] = t);
      setTranslations(map);
    } else {
      // Translate to Spanish
      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: staticTexts, targetLanguage: 'es' })
      })
      .then(res => res.json())
      .then(data => {
        if (data.translatedTexts) {
          const map: {[k:string]:string} = {};
          staticTexts.forEach((t,i) => {
            map[t] = data.translatedTexts[i];
          });
          setTranslations(map);
        } else {
          // If something went wrong, fallback to original
          const map: {[k:string]:string} = {};
          staticTexts.forEach(t => map[t]=t);
          setTranslations(map);
        }
      })
      .catch(() => {
        // On error, fallback to original text
        const map: {[k:string]:string} = {};
        staticTexts.forEach(t => map[t] = t);
        setTranslations(map);
      });
    }
    localStorage.setItem('language', language);
  }, [language]);

  const t = (text: string) => translations[text] || text;

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
      {/* Pass language and setLanguage to ManagerNavBar so it controls language */}
      <ManagerNavBar language={language} setLanguage={setLanguage} />

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
          {/* Translated Welcome Message */}
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
            {t("Welcome to the Manager View.")}
          </h1>
          <h2
            style={{
              fontSize: '20px',
              paddingBottom: '20px',
              fontStyle: 'italic',
              color: 'white',
            }}
          >
            {t("Navigate to the ☰ to begin.")}
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
