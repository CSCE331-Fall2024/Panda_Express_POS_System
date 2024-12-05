import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

type MenuCategory = string;

const Menuboard: React.FC = () => {
  const [menuItems, setMenuItems] = React.useState<MenuItems>({});
  const [selectedCategory, setSelectedCategory] = React.useState<MenuCategory>('Combos');
  const [weather, setWeather] = React.useState<{ temperature?: number; description?: string; isDay?: boolean } | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const categories: MenuCategory[] = ['Combos', 'Appetizer', 'Entree', 'Side', 'Drink'];
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
      {/* Dim Overlay
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // 20% black overlay to dim background
        }}
      ></div> */}

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
            style={{ width: '80px' }}
          />

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
            <span style={{ fontWeight: 'bold', color:'var(--foreground)' }}>Employee Sign In</span>
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
            style={{ width: '90px' }}
          />
          Welcome to Panda Express!
        </h1>
        <h2
        style={{
          fontSize:'20px',
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
    </div>
  );
};

export default Menuboard;
