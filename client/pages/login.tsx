/**
 * @fileoverview Login page component for Panda Express management system
 * @module LoginPage
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/components/ui/user_context';
import { useTheme } from '@/components/context/theme_context';
import { getUserLocation, getWeatherData } from "@/utils/apiHelpers";
import { Cloud, Sun, CloudRain, CloudSnow, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

/**
 * Weather data interface for component state
 * @interface
 */
export interface WeatherData {
  /** Temperature in Fahrenheit */
  temperature?: number;
  /** Text description of weather conditions */
  description?: string;
}

/**
 * Mapping of weather conditions to their corresponding Lucide icons
 * @const
 */
export const weatherIcons = {
  /** Sun icon for clear weather */
  clear: <Sun className="h-6 w-6" />,
  /** Cloud icon for cloudy weather */
  clouds: <Cloud className="h-6 w-6" />,
  /** Rain cloud icon for rainy weather */
  rain: <CloudRain className="h-6 w-6" />,
  /** Snow cloud icon for snowy weather */
  snow: <CloudSnow className="h-6 w-6" />,
};

/**
 * Props interface for the ErrorPopup component
 * @interface
 */
export interface ErrorPopupProps {
  /** Error message to display */
  message: string;
  /** Callback function to close the popup */
  onClose: () => void;
}

/**
 * A reusable error popup component that displays error messages in a modal overlay
 * 
 * @param props - The component props
 * @returns A modal component with error message and close button
 */
export const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex justify-center mb-4">
          <CloudRain className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-center text-red-500 dark:text-red-400">{message}</p>
      </div>
    </div>
  );
};

/**
 * Main login page component for the Panda Express management system
 * Handles user authentication, weather display, and theme switching
 * 
 * @remarks
 * This component manages both traditional login and Google OAuth authentication.
 * It also fetches and displays local weather information and supports dark/light theme switching.
 * 
 * @returns The login page component with authentication form and weather display
 */
export const LoginPage: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const { theme } = useTheme();
  
  /**
   * State for form inputs and UI control
   */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches weather data based on user's geolocation
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
   * Determines the appropriate weather icon based on weather description
   * @returns The corresponding weather icon component or null
   */
  const getWeatherIcon = () => {
    if (!weather?.description) return null;
    const description = weather.description.toLowerCase();

    if (description.includes('clear')) return weatherIcons.clear;
    if (description.includes('cloud')) return weatherIcons.clouds;
    if (description.includes('rain')) return weatherIcons.rain;
    if (description.includes('snow')) return weatherIcons.snow;

    return <Cloud className="h-6 w-6" />;
  };

  /**
   * Updates document theme based on theme context
   */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "night");
  }, [theme]);

  /**
   * Handles the login form submission
   * @param e - Form submission event
   */
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

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || 'Login failed. Please try again.';
        setError(message);
        return;
      }
      
      setUser({ role: data.role });
      if (data.role) {
        sessionStorage.setItem('staff_id', data.staff_id);

        if (data.role === 'cashier') router.push('/cashier');
        else if (data.role === 'manager') router.push('/manager');
      } else { 
        setError('Unauthorized role');
      }
    } catch (err: any) {
      setError(err.message || 'Network error or server not reachable');
    }
  };

  /**
   * Initiates Google OAuth login flow
   */
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/google`;
  };

  /**
   * Processes URL parameters for OAuth callback
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const staff_id = urlParams.get('staff_id');
    const role = urlParams.get('role');
    const error = urlParams.get('error');
    const accessToken = urlParams.get('accessToken');

    if (staff_id && role) {
      setUser({ role });
      sessionStorage.setItem('staff_id', staff_id);
      if (accessToken) {
        sessionStorage.setItem('accessToken', accessToken);
      }

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
        <img
          src="https://s3.amazonaws.com/PandaExpressWebsite/Responsive/img/home/logo.png"
          alt="Panda Express Logo"
          style={{ width: '80px' }}
        />
        
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

        {weather && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {getWeatherIcon()}
            <span>
              {weather.temperature !== undefined ? `${Math.round(weather.temperature)}°F` : 'N/A'}
            </span>
          </div>
        )}
      </nav>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          marginTop: '60px',
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          borderRadius: '8px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div style={{ textAlign: 'center', padding: '20px', width: '100%' }}>
          <img
            src="https://s3.amazonaws.com/PandaExpressWebsite/www/px-enrollment-2023-hero-logo.svg"
            alt="Panda Rewards Logo"
            style={{ width: '200px', marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          />
          <p style={{fontSize: '18px', marginBottom: '10px'}} className="text-sm text-center font-semibold">
            Log in below to get started.
          </p>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
              type="password"
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
              className="w-full h-15 p-2 bg-red text-white rounded-md font-bold hover:bg-red-500"
            >
              SIGN IN
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '12px',
              backgroundColor: '#FFFFFF',
              color: '#3c4043',
              border: '1px solid #dcdcdc',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            <img 
              src="https://developers.google.com/identity/images/g-logo.png" 
              alt="Google Logo" 
              style={{ width: '18px', height: '18px' }}
            />
            Sign in with Google
          </button>
        </div>
      </div>

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