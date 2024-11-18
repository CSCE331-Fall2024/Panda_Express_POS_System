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
  const [selectedCategory, setSelectedCategory] = React.useState<MenuCategory>('Combos');
  const [weather, setWeather] = React.useState<{ temperature?: number; description?: string } | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const categories: MenuCategory[] = ['Combos', 'Appetizer', 'Entree', 'Side', 'Drink'];

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

  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         height: '100vh',
  //         backgroundColor: '#fff',
  //       }}
  //     >
  //       Loading menu items...
  //     </div>
  //   );
  // }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage:
          'url(https://images.firstwefeast.com/complex/image/upload/c_fill,dpr_auto,f_auto,fl_lossy,g_face,q_auto,w_1280/folmh1obxcvowjpgk1kr.jpg)',
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

          {/* Weather Data */}
          {weather && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {getWeatherIcon()} {/* Weather icon */}
              <span>
                {weather.temperature !== undefined ? `${Math.round(weather.temperature)}°F` : 'N/A'}
              </span>
            </div>
          )}
        </div>

        {/* Order Now Icon aligned to the center*/}
        <a
          href="/customer"
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
          <span style={{ fontWeight: 'bold' }}>Order Now</span>
        </a>

        {/* Employee Sign In aligned to the right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="/login"
            style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            <User size={20} style={{ marginRight: '5px' }} />
            <span style={{ fontWeight: 'bold' }}>Employee Sign In</span>
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
          marginTop: '60px',
          width: '100%',
          maxWidth: '80%',
          height: '100%',
          maxHeight: '75%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight white background for readability
          borderRadius: '8px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Welcome Message */}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#FF0000',
            marginBottom: '20px',
          }}
        >
          Welcome to Panda Express!
        </h1>

        <h1 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
          Choose Your Meal Type
        </h1>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              style={{
                padding: '10px 15px',
                backgroundColor: selectedCategory === category ? '#FF0000' : '#FFFFFF',
                color: selectedCategory === category ? '#FFFFFF' : '#000000',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {category}
            </Button>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            overflow: 'auto',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
          }}
        >
          {menuItems[selectedCategory]?.map((item) => (
            <Card
              key={item.menu_item_id}
              style={{
                width: '200px',
                padding: '10px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle style={{ fontSize: '16px', fontWeight: 'bold', margin: '10px 0' }}>
                  {item.name}
                </CardTitle>
                <CardDescription style={{ fontSize: '14px', color: '#555' }}>
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardFooter style={{ fontWeight: 'bold', marginTop: '5px' }}>
                ${item.price.toFixed(2)}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menuboard;
