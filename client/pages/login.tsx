import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/components/ui/user_context';
import { useTheme } from '@/components/context/theme_context';
import { getUserLocation, getWeatherData } from "@/utils/apiHelpers";
import { Cloud, Sun, CloudRain, CloudSnow, X } from "lucide-react";

const weatherIcons = {
  clear: <Sun className="h-6 w-6" />,
  clouds: <Cloud className="h-6 w-6" />,
  rain: <CloudRain className="h-6 w-6" />,
  snow: <CloudSnow className="h-6 w-6" />,
};

// Reusable Error Popup Component
const ErrorPopup: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Popup Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 max-w-sm w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CloudRain className="h-8 w-8 text-red-500" />
        </div>
        {/* Message */}
        <p className="text-center text-red-500 dark:text-red-400">{message}</p>
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [weather, setWeather] = useState<{ temperature?: number; description?: string } | null>(null);

  // State for error popup
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch weather data based on the user's location
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

  // Determine the appropriate weather icon based on description
  const getWeatherIcon = () => {
    if (!weather?.description) return null;
    const description = weather.description.toLowerCase();

    if (description.includes('clear')) return weatherIcons.clear;
    if (description.includes('cloud')) return weatherIcons.clouds;
    if (description.includes('rain')) return weatherIcons.rain;
    if (description.includes('snow')) return weatherIcons.snow;

    return <Cloud className="h-6 w-6" />; // Default icon
  };

  // Toggle dark mode based on the theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "night");
  }, [theme]);

  // Handle user login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Parse the response once
      const data = await response.json();

      if (!response.ok) {
        // If response is not ok, set the error message and show popup
        const message = data.message || 'Login failed. Please try again.';
        setErrorMessage(message);
        setShowErrorPopup(true);
        return; // Exit the function early
      }

      console.log('Login response data:', data);
      
      setUser({ role: data.role });
      if (data.role) {
        sessionStorage.setItem('staff_id', data.staff_id);
        console.log(sessionStorage.getItem('staff_id'));

        if (data.role === 'cashier') router.push('/cashier');
        else if (data.role === 'manager') router.push('/manager');
      } else { 
        setErrorMessage('Unauthorized role');
        setShowErrorPopup(true);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Network error or server not reachable');
      setShowErrorPopup(true);
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/google`;
  };

  // Handle URL parameters for staff_id, role, and error
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const staff_id = urlParams.get('staff_id');
    const role = urlParams.get('role');
    const error = urlParams.get('error');

    if (staff_id && role) {
      setUser({ role });
      sessionStorage.setItem('staff_id', staff_id);

      if (role === 'cashier') router.push('/cashier');
      else if (role === 'manager') router.push('/manager');
    }

    if (error) {
      setErrorMessage(error);
      setShowErrorPopup(true);
    }
  }, []);

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

      {/* Full-Width Navbar */}
      <nav
        style={{
          backgroundColor: 'var(--primary)',
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
        <a 
          href="/" 
          style={{ 
            color: '#FFFFFF', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)'
          }}
        >
          <span style={{ fontWeight: 'bold' }}>Home</span>
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
          backgroundColor: 'rgba(255, 255, 255, 0.75)', // Slight white background for readability
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
            style={{ width: '200px', marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          />
          {/* <h2 className="font-bold" style={{ fontSize: '22px', color: 'var(--primary)', margin: 0 }}>GOOD FORTUNE AWAITS</h2> */}
          <p style={{fontSize: '18px', marginBottom: '10px'}} className="text-sm text-center font-semibold">Log in below to get started.</p>

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
                color: '#171717',
                margin: '10px 0',
                border: '1px solid #CCC',
                borderRadius: '10px'
              }}
            />
            <input
              type="password" // Corrected input type from " word" to "password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                color: '#171717',
                margin: '10px 0',
                border: '1px solid #CCC',
                borderRadius: '10px'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--primary)',
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
          <button
            onClick={handleGoogleLogin}
            style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4285F4',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '10px'
            }}
        >
            Sign in with Google
        </button>


          {/* Remove the old error message display */}
          {/* {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>} */}
        </div>
      </div>

      {/* Render Error Popup */}
      {showErrorPopup && (
        <ErrorPopup 
          message={errorMessage} 
          onClose={() => setShowErrorPopup(false)} 
        />
      )}
    </div>
  );
};

export default LoginPage;