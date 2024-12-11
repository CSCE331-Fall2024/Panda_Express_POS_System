/**
 * This file implements the ManagerReports component, which provides a user interface
 * for managers to generate and view different types of reports. It includes 
 * multilingual support for English and Spanish and links to specific report pages.
 */

import { CSSProperties, FC, useEffect, useState } from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import Link from 'next/link';
import ManagerNavBar from '@/components/ui/manager_nav_bar';

/**
 * ManagerReports component allows managers to select and generate various types of reports.
 *
 * @returns {JSX.Element} The rendered ManagerReports component.
 */
const ManagerReports: FC = () => {
  // State variables for language selection and translations
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  const staticTexts = [
    "Generate Reports",
    "Select a report type to view or generate a detailed report:",
    "Z Report",
    "X Report",
    "Inventory",
    "Sales"
  ];

  /**
   * Initializes the language state from localStorage.
   */
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'es') {
      setLanguage('es');
    }
  }, []);

  /**
   * Updates the translations map based on the selected language.
   */
  useEffect(() => {
    if (language === 'en') {
      const map: { [key: string]: string } = {};
      staticTexts.forEach((t) => (map[t] = t));
      setTranslations(map);
    } else {
      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: staticTexts, targetLanguage: 'es' }),
      })
        .then((res) => res.json())
        .then((data) => {
          const map: { [key: string]: string } = {};
          if (data.translatedTexts) {
            staticTexts.forEach((t, i) => {
              map[t] = data.translatedTexts[i];
            });
          } else {
            staticTexts.forEach((t) => (map[t] = t));
          }
          setTranslations(map);
        })
        .catch(() => {
          const map: { [key: string]: string } = {};
          staticTexts.forEach((t) => (map[t] = t));
          setTranslations(map);
        });
    }
    localStorage.setItem('language', language);
  }, [language]);

  /**
   * Translates the given text using the current translations map.
   *
   * @param {string} text - The text to be translated.
   * @returns {string} The translated text.
   */
  const t = (text: string) => translations[text] || text;

  return (
    <>
      <ManagerNavBar language={language} setLanguage={setLanguage} />
      <div style={pageStyle}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          <h2 style={headingStyle}>{t("Generate Reports")}</h2>
          <div style={{ padding: '3px', marginBottom: '20px' }}>
            <p style={{ marginBottom: '20px' }}>
              {t("Select a report type to view or generate a detailed report:")}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <Link href="/manager/reports/z-report" style={buttonStyle}>
                {t("Z Report")}
              </Link>
              <Link href="/manager/reports/x-report" style={buttonStyle}>
                {t("X Report")}
              </Link>
              <Link href="/manager/reports/inventory" style={buttonStyle}>
                {t("Inventory")}
              </Link>
              <Link href="/manager/reports/sales" style={buttonStyle}>
                {t("Sales")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * CSS styles for the report selection buttons.
 *
 * @type {CSSProperties}
 */
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
