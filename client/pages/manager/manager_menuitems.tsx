import { FC, useEffect, useState } from 'react';
import { getUserLocation, getWeatherData } from "@/utils/apiHelpers";
import { Sun, Moon, Cloud, CloudRain, CloudSnow, User } from "lucide-react";
import { useTheme } from "@/components/context/theme_context";

interface MenuItem {
  menu_item_id: number;
  price: number;
  item_type: string;
  name: string;
  image: string;
  description: string;
}

interface MenuItems {
  [key: string]: MenuItem[];
}

const weatherIcons = {
  clear: <Sun className="h-6 w-6" />,
  clouds: <Cloud className="h-6 w-6" />,
  rain: <CloudRain className="h-6 w-6" />,
  snow: <CloudSnow className="h-6 w-6" />,
};

const Menuboard: FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItems>({});
  const [weather, setWeather] = useState<{ temperature?: number; description?: string; isDay?: boolean } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme, toggleTheme } = useTheme();

  // Language State
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [translations, setTranslations] = useState<{[key:string]:string}>({});

  const staticTexts = [
    "Welcome to Panda Express!",
    "Chinese Flavors with American Tastes",
    "Order Now",
    "Employee Sign In"
  ];

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem('language');
    if (saved === 'es') {
      setLanguage('es');
    }
  }, []);

  useEffect(() => {
    // Translate texts when language changes
    if (language === 'en') {
      const map: {[key:string]:string} = {};
      staticTexts.forEach(t => map[t] = t);
      setTranslations(map);
    } else {
      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: staticTexts, targetLanguage: 'es' }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.translatedTexts) {
          const map: {[key:string]:string} = {};
          staticTexts.forEach((t, i) => {
            map[t] = data.translatedTexts[i];
          });
          setTranslations(map);
        }
      })
      .catch(() => {
        const map: {[key:string]:string} = {};
        staticTexts.forEach(t => map[t] = t);
        setTranslations(map);
      });
    }
    localStorage.setItem('language', language);
  }, [language]);

  // Helper to translate text
  const t = (text:string) => translations[text] || text;

  useEffect(() => {
    fetch('/api/menu')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const itemsByCategory = data.menuItems.reduce((acc: MenuItems, item: MenuItem) => {
            const category = item.item_type;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(item);
            return acc;
          }, {});
          setMenuItems(itemsByCategory);
          setLoading(false);
        } else {
          console.error('Failed to fetch menu items');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching menu items:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchWeatherForLocation = async () => {
      try {
        const location = await getUserLocation();
        if (location) {
          const weatherData = await getWeatherData(location.latitude, location.longitude);
          setWeather(weatherData);
        } else {
          console.log('Location access denied or unavailable.');
        }
      } catch (error) {
        console.error('Error fetching weather or location:', error);
      }
    };

    fetchWeatherForLocation();
  }, []);

  const getWeatherIcon = () => {
    if (!weather?.description) return null;
  
    const description = weather.description.toLowerCase();
  
    if (description.includes("clear")) return weatherIcons.clear;
    if (description.includes("cloud")) return weatherIcons.clouds;
    if (description.includes("rain")) return weatherIcons.rain;
    if (description.includes("snow")) return weatherIcons.snow;
  
    return <Cloud className="h-6 w-6" />;
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'var(--background-image)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <nav
        style={{
          backgroundColor: 'var(--primary)',
          color: 'var(--foreground)',
          padding: '15px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          position: 'absolute',
          top: 0,
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="https://s3.amazonaws.com/PandaExpressWebsite/Responsive/img/home/logo.png"
            alt="Panda Express Logo"
            style={{ width: '80px' }}
          />
          {weather && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--foreground)' }}>
              {getWeatherIcon()}
              <span>
                {weather.temperature !== undefined ? `${Math.round(weather.temperature)}°F` : 'N/A'}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
            style={{ padding: '5px' }}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 rounded bg-gray-800"
          >
            {theme === "night" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-500" />
            )}
          </button>
          <a
            href="/login"
            style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            <User size={20} style={{ marginRight: '5px', color: 'var(--foreground)' }} />
            <span style={{ fontWeight: 'bold', color:'var(--foreground)' }}>{t("Employee Sign In")}</span>
          </a>
        </div>
      </nav>

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
        <h1
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '50px',
            fontWeight: 'bold',
            marginBottom: '10px',
          }}
        >
          <img
            src="https://s3.amazonaws.com/PandaExpressWebsite/www/hyp23/pr-logo.png"
            alt="Panda Express Logo"
            style={{ width: '90px' }}
          />
          {t("Welcome to Panda Express!")}
        </h1>
        <h2
          style={{
            fontSize:'20px',
            fontWeight: 'bold',
            fontStyle: 'italic',
            paddingBottom: '20px'
          }}>
          {t("Chinese Flavors with American Tastes")}
        </h2>
        <a
          href="/customer"
          style={{
            width: '20%%',
            padding: '12px',
            backgroundColor: '#D32F2F',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {t("Order Now")}
        </a>        
      </div>
    </div>
  );
};

export default Menuboard;
