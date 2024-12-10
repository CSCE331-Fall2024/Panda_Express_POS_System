/**
 * Menuboard Component
 * 
 * This component displays a menu board where users can select items such as combos, sides, and more.
 * The menu data is fetched dynamically from the server, and weather information is also displayed
 * using weather icons based on the current location's weather conditions.
 * 
 * @component
 */

import { FC, useState, useEffect } from 'react';
import { getUserLocation, getWeatherData } from "@/utils/apiHelpers";
import { Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";

/**
 * MenuItem Interface
 * Represents a menu item with its properties like ID, price, type, name, image, and description.
 * 
 * @interface
 */
interface MenuItem {
  menu_item_id: number;
  price: number;
  item_type: string;
  name: string;
  image: string;
  description: string;
}

/**
 * MenuItems Interface
 * Represents a collection of menu items categorized by their type.
 * 
 * @interface
 */
interface MenuItems {
  [key: string]: MenuItem[];
}

/**
 * Weather icons mapping
 * Maps weather conditions to corresponding icons using Lucide icons.
 */
const weatherIcons = {
  clear: <Sun className="h-6 w-6" />,
  clouds: <Cloud className="h-6 w-6" />,
  rain: <CloudRain className="h-6 w-6" />,
  snow: <CloudSnow className="h-6 w-6" />,
};

/**
 * Menuboard Functional Component
 * Renders the menu board and displays weather information based on the user's location.
 * 
 * @returns {JSX.Element} The rendered Menuboard component.
 */
const Menuboard: FC = () => {
  /**
   * State to store menu items categorized by type.
   * @state
   */
  const [menuItems, setMenuItems] = useState<MenuItems>({});

  /**
   * State to store the weather data including temperature and description.
   * @state
   */
  const [weather, setWeather] = useState<{ temperature?: number; description?: string } | null>(null);

  /**
   * State to indicate whether data is still being loaded.
   * @state
   */
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Effect to fetch menu items from the server API.
   * The data is organized into categories and stored in the `menuItems` state.
   */
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

  /**
   * Effect to fetch weather data based on the user's location.
   * Uses helper functions `getUserLocation` and `getWeatherData` for this purpose.
   */
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

  /**
   * Helper function to determine the appropriate weather icon based on the weather description.
   * 
   * @returns {JSX.Element | null} A weather icon component or null if no description is available.
   */
  const getWeatherIcon = () => {
    if (!weather?.description) return null;
    const description = weather.description.toLowerCase();

    if (description.includes('clear')) return weatherIcons.clear;
    if (description.includes('cloud')) return weatherIcons.clouds;
    if (description.includes('rain')) return weatherIcons.rain;
    if (description.includes('snow')) return weatherIcons.snow;

    return <Cloud className="h-6 w-6" />; // Default icon
  };

  /**
   * Combo items and side items extracted from `menuItems` state.
   */
  const comboItems = menuItems['Combos'] || [];
  const sideItems = menuItems['Side'] || [];

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundImage:
            'url(https://thecounter.org/wp-content/uploads/2022/02/worker-takes-customers-order-at-panda-express-garden-grove-CA-Nov-17-2021-1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dim Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // 50% black overlay to dim background
          }}
        ></div>

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
          </div>

          {/* Order Now Icon aligned to the center */}
          <a
            href="/manager"
            style={{
              color: '#FFFFFF',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <span style={{ fontWeight: 'bold', fontSize: "1.8rem" }}>Welcome to Panda Express</span>
          </a>

          {/* Weather Data */}
          {weather && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {getWeatherIcon()} {/* Weather icon */}
              <span>
                {weather.temperature !== undefined ? `${Math.round(weather.temperature)}°F` : 'N/A'}
              </span>
            </div>
          )}
        </nav>

        {/* Menu viewing options */}
        <div style={{ zIndex: 2 }}>
          <div className="mt-2 w-full flex flex-col items-center">
            <h2 className="text-white text-2xl font-semibold mb-2 pt-10">Step 1: Choose Your Plate</h2>
            <div className="grid grid-cols-4 gap-2">
              {comboItems.map((item) => (
                <div key={item.menu_item_id} className="bg-white rounded-md shadow-sm p-2 flex items-center">
                  <div className="flex items-center w-full">
                    <img src={item.image} alt={item.name} className="object-cover rounded-md mr-4" />
                    <div className="flex flex-col w-full">
                      <h3 className="font-medium text-gray-800 text-left">{item.name}</h3>
                      <p className="hidden lg:block text-gray-600 mb-1">{item.description}</p>
                      <p className="text-red-600 font-bold">{`$${item.price.toFixed(2)}`}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menuboard;
