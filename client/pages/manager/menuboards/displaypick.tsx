/**
 * This file is part of the menu boards page in the Manager section.
 * It includes the functionality for displaying different menu items and uses
 * hooks like `useState` and `useEffect` to fetch and display data dynamically.
 */

import { CSSProperties, FC, useEffect, useState } from 'react';
import { pageStyle, overlayStyle, contentStyle, headingStyle } from '@/utils/tableStyles';
import BackButton from '@/components/ui/back_button';
import Link from 'next/link';
import ManagerNavBar from '@/components/ui/manager_nav_bar';

/**
 * ManagerReports Component
 * 
 * This component renders the Manager Reports page, allowing users to display menu boards
 * and toggle language preferences. The language can be toggled between English ('en') 
 * and Spanish ('es'), with translations fetched dynamically if needed.
 * 
 * @component
 */
const ManagerReports: FC = () => {
  /**
   * @state {string} language - The current language ('en' or 'es').
   */
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  /**
   * @state {Object} translations - A map of static text to their translated values.
   */
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  /**
   * @constant {string[]} staticTexts - Array of static texts used in the component.
   */
  const staticTexts = [
    "Display Menu Boards",
    "Select a menu board to display:",
    "Display Combos, Sides, and Appetizers",
    "Display Entrees"
  ];

  /**
   * Effect to load the saved language from localStorage.
   */
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'es') setLanguage('es');
  }, []);

  /**
   * Effect to handle translations based on the selected language.
   * Fetches translations from the server when the language is set to Spanish ('es').
   */
  useEffect(() => {
    if (language === 'en') {
      const map: { [k: string]: string } = {};
      staticTexts.forEach(t => (map[t] = t));
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
            const map: { [k: string]: string } = {};
            staticTexts.forEach((t, i) => (map[t] = data.translatedTexts[i]));
            setTranslations(map);
          } else {
            const map: { [k: string]: string } = {};
            staticTexts.forEach(t => (map[t] = t));
            setTranslations(map);
          }
        })
        .catch(() => {
          const map: { [k: string]: string } = {};
          staticTexts.forEach(t => (map[t] = t));
          setTranslations(map);
        });
    }
    localStorage.setItem('language', language);
  }, [language]);

  /**
   * Translation helper function.
   *
   * @function
   * @param {string} text - The text to translate.
   * @returns {string} The translated text if available; otherwise, the input text.
   */
  const t = (text: string) => translations[text] || text;

  return (
    <>
      <ManagerNavBar language={language} setLanguage={setLanguage} />
      <div style={pageStyle}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <BackButton />
          <h2 style={headingStyle}>{t("Display Menu Boards")}</h2>
          <div style={{ padding: '3px', marginBottom: '20px' }}>
            <p style={{ marginBottom: '20px' }}>{t("Select a menu board to display:")}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/manager/menuboards/menuboard1" style={buttonStyle}>{t("Display Combos, Sides, and Appetizers")}</Link>
              <Link href="/manager/menuboards/menuboard2" style={buttonStyle}>{t("Display Entrees")}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * @constant {CSSProperties} buttonStyle - CSS styles for the menu board buttons.
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
