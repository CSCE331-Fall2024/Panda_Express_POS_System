import React, { useEffect } from 'react';
import { getUserLocation, getWeatherData } from "@/utils/apiHelpers";
import { Cloud, Sun, CloudRain, CloudSnow, User } from "lucide-react";


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
  // const [selectedCategory, setSelectedCategory] = React.useState<MenuCategory>('Combos');
  const [weather, setWeather] = React.useState<{ temperature?: number; description?: string } | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);


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
  
  const entreeItems = menuItems['Entree'] || [];



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
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% black overlay to dim background
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

     {/* Entrees Section */}
     <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            marginTop:'80px',
            paddingLeft: '20px',
            paddingRight: '20px'
          }}
        >
          <h2
            style={{
              color: 'White',
              marginBottom: '15px',
              fontSize: '1.8rem'
            }}
          >
            Entrees
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '20px',
              width: '100%'
            }}
          >
            {entreeItems.map((item) => (
            <div
              key={item.menu_item_id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: '15px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginRight: '15px'
                }}
              />
              <div>
                <h3
                  style={{
                    fontSize: '1rem',
                    color: '#333',
                    marginBottom: '5px'
                  }}
                >
                  {item.name}
                </h3>
                <p
                  style={{
                    color: '#666',
                    marginBottom: '10px',
                    fontSize: '0.9rem'
                  }}
                >
                  {item.description}
                </p>
                <p
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#D32F2F'
                  }}
                >
                  ${item.price.toFixed(2)}
                </p>
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
