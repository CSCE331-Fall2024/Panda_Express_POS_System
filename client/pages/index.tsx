import React from 'react';
import { useState } from 'react';
import { Cloud, Menu, ShoppingBag, Sun, CloudRain, CloudSnow } from 'lucide-react';
import { useRouter } from 'next/router';
import { getWeatherData, getUserLocation } from '../utils/apiHelpers';

const weatherIcons = {
  clear: <Sun className="h-6 w-6" />,
  clouds: <Cloud className="h-6 w-6" />,
  rain: <CloudRain className="h-6 w-6" />,
  snow: <CloudSnow className="h-6 w-6" />,
};

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [weather, setWeather] = React.useState<{ temperature?: number; description?: string } | null>(null);
  const router = useRouter();  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      console.log('Login response data:', data);
      
      // Check the role and navigate accordingly
      if (data.role === 'cashier') {
        window.location.href = '/cashier';
      } else if (data.role === 'manager') {
        window.location.href = '/manager';
      } else {
        setError('Unauthorized role');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error or server not reachable');
    }
  };

  // Get weather data based on the location
  React.useEffect(() => {
    const fetchWeatherForLocation = async () => {
      try {
        const location = await getUserLocation();
        if (location) {
          const weatherData = await getWeatherData(location.latitude, location.longitude);
          setWeather(weatherData);
        } else {
          console.log("Location access denied or unavailable.");
        }
      } catch (error) {
        console.error("Error fetching weather or location:", error);
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

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'url(https://thecounter.org/wp-content/uploads/2022/02/worker-takes-customers-order-at-panda-express-garden-grove-CA-Nov-17-2021-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Dim Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // 50% black overlay to dim background
      }}></div>

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
          zIndex: 1
        }}
      >
        {/* Panda Express Logo aligned to the left */}
        <img
          src="https://s3.amazonaws.com/PandaExpressWebsite/Responsive/img/home/logo.png"
          alt="Panda Express Logo"
          style={{ width: '80px' }}
        />

        {/* Menu Text */}          
        <a href="/menuboard" style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
          <span style={{ fontWeight: 'bold' }}>Menu</span>
        </a>

        {/* Order Now Icon and Weather Data aligned to the right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Weather Data */}
          {weather && (
            <div className="flex items-center gap-2">
              {getWeatherIcon()} {/* Weather icon */}
              <span style={{ marginLeft: '1px' }}>
                {weather.temperature !== undefined ? `${Math.round(weather.temperature)}°F` : 'N/A'}
              </span>
            </div>
          )}

          {/* Order Now Icon */}
          <a href="/customer" style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <ShoppingBag size={20} style={{ marginRight: '5px' }} />
            <span style={{ fontWeight: 'bold' }}>Order Now</span>
          </a>
        </div>
      </nav>

      {/* Login Box - Spans Full Screen Width */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          marginTop: '60px',
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight white background for readability
          borderRadius: '8px',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Content Box */}
        <div style={{ textAlign: 'center', padding: '20px', width: '100%' }}>
          <img
            src="https://s3.amazonaws.com/PandaExpressWebsite/www/px-enrollment-2023-hero-logo.svg"
            alt="Panda Rewards Logo"
            style={{ width: '200px', marginBottom: '40px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          />
          <h2 style={{ fontSize: '22px', color: '#D32F2F', margin: 0 }}>GOOD FORTUNE AWAITS</h2>
          <p style={{ color: '#888', fontSize: '14px' }}>Log in below to get started.</p>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                border: '1px solid #CCC',
                borderRadius: '4px'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                border: '1px solid #CCC',
                borderRadius: '4px'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
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
              SIGN IN
            </button>
          </form>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

          {/* Sign Up Link */}
          <p style={{ fontSize: '14px', color: '#888', marginTop: '15px' }}>
            Don't have an account? <a href="#" style={{ color: '#D32F2F', textDecoration: 'none' }}>Sign up now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
