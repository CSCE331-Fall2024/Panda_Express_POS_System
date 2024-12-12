/**
 * Represents the main Menuboard component.
 * 
 * @remarks
 * Represents the main Menuboard component.
 * 
 * @returns {JSX.Element} The rendered component.
 */
import { FC, useEffect, useState } from 'react';
import { getUserLocation, getWeatherData } from "@/utils/apiHelpers";
import { Sun, Moon, Cloud, CloudRain, CloudSnow, User } from "lucide-react";
import { useTheme } from "@/components/context/theme_context";
import Head from 'next/head';


/**
 * Represents a single menu item.
 * 
 * @typedef {Object} MenuItem
 * @property {number} menu_item_id - Unique ID for the menu item.
 * @property {number} price - Price of the menu item.
 * @property {string} item_type - Type of the menu item (Side, Entree, Appetizer, Drink).
 * @property {string} name - Name of the menu item.
 * @property {string} image - URL to the item's image.
 * @property {string} description - Description of the menu item.
 */
export interface MenuItem {
  menu_item_id: number;
  price: number;
  item_type: string;
  name: string;
  image: string;
  description: string;
}

/**
 * Represents categorized menu items.
 * 
 * @typedef {Object} MenuItems
 * @property {[key: string]: MenuItem[]} [key: string] - The key is the category of the menu item.
 */
export interface MenuItems {
  [key: string]: MenuItem[];
}

/**
 * Represents weather icons.
 * 
 * @typedef {Object} WeatherIcons
 * @property {JSX.Element} clear - The icon for clear weather.
 * @property {JSX.Element} clouds - The icon for cloudy weather.
 * @property {JSX.Element} rain - The icon for rainy weather.
 * @property {JSX.Element} snow - The icon for snowy weather.
 */
export const weatherIcons = {
  clear: <Sun className="h-6 w-6" />,
  clouds: <Cloud className="h-6 w-6" />,
  rain: <CloudRain className="h-6 w-6" />,
  snow: <CloudSnow className="h-6 w-6" />,
};

/**
 * Represents the main Menuboard component.
 * 
 * @remarks
 * Represents the main Menuboard component.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export const Menuboard: FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItems>({});
  const [weather, setWeather] = useState<{ temperature?: number; description?: string; isDay?: boolean } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme, toggleTheme } = useTheme();
  // Fetch menu items from the API
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

  // Get weather data based on the location
  useEffect(() => {
    const fetchWeatherForLocation = async () => {
      try {
        console.log('Fetching weather data...');
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
  
    return <Cloud className="h-6 w-6" />; // Default icon
  };

  return (
    <><Head>
      <title>Panda Express Menu Board</title>
    </Head><div
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
        {/* Full-Width Navbar */}
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
            {/* Panda Express Logo aligned to the left */}
            <img
              src="https://s3.amazonaws.com/PandaExpressWebsite/Responsive/img/home/logo.png"
              alt="Panda Express Logo"
              style={{ width: '80px' }} />

            {/* Weather Data */}
            {weather && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--foreground)' }}>
                {getWeatherIcon()} {/* Weather icon */}
                <span>
                  {weather.temperature !== undefined ? `${Math.round(weather.temperature)}°F` : 'N/A'}
                </span>
              </div>
            )}
          </div>
          {/* Employee Signin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              id='themetogglebutton'
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
              <span style={{ fontWeight: 'bold', color: 'var(--foreground)' }}>Employee Sign In</span>
            </a>
          </div>
        </nav>

        {/* Menu viewing options - Spans Full Screen Width */}
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
          {/* Welcome Message */}
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
              style={{ width: '90px' }} />
            Welcome to Panda Express!
          </h1>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              fontStyle: 'italic',
              paddingBottom: '20px'
            }}>
            Chinese Flavors with American Tastes
          </h2>
          {/* order now button */}
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
            Order Now
            {/* </button> */}
          </a>
        </div>
      </div></>
  );
};

export default Menuboard;
