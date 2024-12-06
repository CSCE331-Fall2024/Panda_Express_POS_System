// pages/manager_reports.tsx
import {CSSProperties, FC, useEffect, useState } from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import Link from 'next/link';
import ManagerNavBar from '@/components/ui/manager_nav_bar';

const ManagerReports: FC = () => {
  // Language and translation states
  const [language, setLanguage] = useState<'en'|'es'>('en');
  const [translations, setTranslations] = useState<{[key:string]:string}>({});

  const staticTexts = [
    "Generate Reports",
    "Select a report type to view or generate a detailed report:",
    "Z Report",
    "X Report",
    "Inventory",
    "Sales"
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'es') {
      setLanguage('es');
    }
  }, []);

  useEffect(() => {
    if (language === 'en') {
      const map: {[k:string]:string} = {};
      staticTexts.forEach(t => map[t] = t);
      setTranslations(map);
    } else {
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
          // Fallback if no translations
          const map: {[k:string]:string} = {};
          staticTexts.forEach(t => map[t] = t);
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

  const t = (text:string) => translations[text] || text;

  return (
    <>
      <ManagerNavBar language={language} setLanguage={setLanguage} />
      <div style={pageStyle}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton/>
          <h2 style={headingStyle}>{t("Generate Reports")}</h2>
          <div style={{ padding: '3px', marginBottom:'20px' }}>
            <p style={{marginBottom:'20px' }}>{t("Select a report type to view or generate a detailed report:")}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/manager/reports/z-report" style={buttonStyle}>{t("Z Report")}</Link>
              <Link href="/manager/reports/x-report" style={buttonStyle}>{t("X Report")}</Link>
              <Link href="/manager/reports/inventory" style={buttonStyle}>{t("Inventory")}</Link>
              <Link href="/manager/reports/sales" style={buttonStyle}>{t("Sales")}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const buttonStyle: CSSProperties = {
  margin: '0 5px',
  padding: '8px',
  backgroundColor: '#D32F2F',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default ManagerReports;
