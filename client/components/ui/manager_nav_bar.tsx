import { CSSProperties, FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface ManagerNavBarProps {
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
}

const ManagerNavBar: FC<ManagerNavBarProps> = ({ language, setLanguage }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Nav texts to translate
  const staticTexts = [
    "English",
    "Español",
    "Customer Ordering",
    "Orders",
    "Employees",
    "Reports",
    "Menu Items",
    "Inventory Items",
    "Menu Board",
    "Logout"
  ];

  const [translations, setTranslations] = useState<{[key:string]:string}>({});

  // Fetch translations when language changes
  useEffect(() => {
    if (language === 'en') {
      // English default - no need to translate
      const map: {[k:string]:string} = {};
      staticTexts.forEach(t => (map[t] = t));
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
          staticTexts.forEach((t, i) => {
            map[t] = data.translatedTexts[i];
          });
          setTranslations(map);
        } else {
          // If something goes wrong, fallback to original
          const map: {[k:string]:string} = {};
          staticTexts.forEach(t => (map[t] = t));
          setTranslations(map);
        }
      })
      .catch(() => {
        // On error, fallback to original text
        const map: {[k:string]:string} = {};
        staticTexts.forEach(t => (map[t] = t));
        setTranslations(map);
      });
    }
  }, [language]);

  const t = (text: string) => translations[text] || text;

  const handleNavigation = (path: string) => {
    setMenuOpen(false);
    if (path === "/login") {
      sessionStorage.setItem("staff_id", "0");
    }
    router.push(path);
  };

  return (
    <div>
      {/* Full-Width Navbar */}
      <nav
        style={{
          backgroundColor: '#FF0000',
          color: '#FFFFFF',
          padding: '15px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          position: 'fixed',
          top: 0,
          zIndex: 9999, 
        }}
      >
        {/* Logo */}
        <img
          src="https://s3.amazonaws.com/PandaExpressWebsite/Responsive/img/home/logo.png"
          alt="Panda Express Logo"
          style={{ width: '80px' }}
        />

        {/* Right side container: Language Selector and Hamburger Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en'|'es')}
            style={{ 
              padding: '5px', 
              border: '1px solid #FFFFFF', 
              backgroundColor: '#FF0000', 
              color: '#FFFFFF', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <option value="en">{t("English")}</option>
            <option value="es">{t("Español")}</option>
          </select>

          {/* Hamburger Menu Icon */}
          <div
            style={{
              fontSize: '24px',
              cursor: 'pointer',
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 99999,
            overflow: 'hidden',
          }}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li style={menuItemStyle} onClick={() => handleNavigation('/cashier')}>{t("Customer Ordering")}</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/manager_orders')}>{t("Orders")}</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/manager_employees')}>{t("Employees")}</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/manager_reports')}>{t("Reports")}</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/manager_menuitems')}>{t("Menu Items")}</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/manager_inventoryitems')}>{t("Inventory Items")}</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/manager/menuboards/displaypick')}>{t("Menu Board")}</li>
            <li style={menuItemStyle} onClick={() => handleNavigation('/login')}>{t("Logout")}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

// Style for dropdown menu items
const menuItemStyle: CSSProperties = {
  padding: '12px 20px',
  cursor: 'pointer',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #E0E0E0',
  fontSize: '16px',
  color: '#D32F2F',
  textAlign: 'left',
  transition: 'background-color 0.3s',
};

export default ManagerNavBar;
