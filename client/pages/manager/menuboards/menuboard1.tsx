import { FC, useState, useEffect } from 'react';
import { getUserLocation, getWeatherData } from "@/utils/apiHelpers";
import { Cloud, Sun, CloudRain, CloudSnow} from "lucide-react";

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
  const [weather, setWeather] = useState<{ temperature?: number; description?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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

    if (description.includes('clear')) return weatherIcons.clear;
    if (description.includes('cloud')) return weatherIcons.clouds;
    if (description.includes('rain')) return weatherIcons.rain;
    if (description.includes('snow')) return weatherIcons.snow;

    return <Cloud className="h-6 w-6" />; // Default icon
  };
  
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

        {/* Order Now Icon aligned to the center*/}
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
          <span style={{ fontWeight: 'bold', fontSize:"1.8rem"}}>Welcome to Panda Express</span>
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

      {/* Menu viewing options - Spans Full Screen Width */}
      <div
        style={{
          zIndex: 2,
        }}
      >
        <div className="mt-2 w-full flex flex-col items-center">
        <h2 className="text-white text-2xl font-semibold mb-2 pt-10">Step 1: Choose Your Plate</h2>
        <div className="grid grid-cols-4 gap-2">
            {comboItems.map((item) => (
            <div key={item.menu_item_id} className="bg-white rounded-md shadow-sm p-2 flex items-center">
                <div className="flex items-center w-full">
                <img src={item.image} alt={item.name} className="sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 object-cover rounded-md mr-4" />
                
                <div className="flex flex-col w-full">
                    <h3 className="sm: text-xs md:text-sm lg:text-lg font-medium text-gray-800 text-left">{item.name}</h3>
                    <p className="hidden lg:block md:text-xs lg:text-base text-gray-600 text-xs mb-1">{item.description}</p>
                    <p className="sm:text-xs md:text-sm lg:text-base text-red-600 font-bold text-sm">{`$${item.price.toFixed(2)}`}</p>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
        <div className="mt-.5 w-full flex flex-col items-center">
        <h2 className="text-white text-2xl font-semibold mb-2 pt-10">Step 2: Choose Your Side</h2>
        <div className="grid grid-cols-3 gap-2">
            {sideItems.map((item) => (
            <div key={item.menu_item_id} className="bg-white rounded-md shadow-sm p-2 flex items-center">
                <div className="flex items-center w-full">
                <img src={item.image} alt={item.name} className="sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 object-cover rounded-md mr-4" />
                
                <div className="flex flex-col w-full">
                    <h3 className="sm: text-xs md:text-sm lg:text-lg font-medium text-gray-800 text-left">{item.name}</h3>
                    <p className="hidden lg:block md:text-xs lg:text-base text-gray-600 text-xs mb-1">{item.description}</p>
                    <p className="sm:text-xs md:text-sm lg:text-base text-red-600 font-bold text-sm">{`$${item.price.toFixed(2)}`}</p>
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
