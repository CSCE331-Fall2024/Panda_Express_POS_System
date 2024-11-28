import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserLocation, getWeatherData } from '@/utils/apiHelpers';

type Theme = 'day' | 'night';

interface ThemeContextProps {
  theme: Theme | null;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme | null>(null); // Start with `null` to avoid premature rendering
  
  const updateBackgroundImage = (theme: Theme) => {
    const backgroundImage =
      theme === 'day'
        ? "url('https://www.pandaexpress.com.ph/sites/ph/files/styles/background_desktop/public/2022-06/img-our-food-desktop.jpg?itok=sa-5OOhz')"
        : "url('/dark-theme-main-background.png')";
    document.documentElement.style.setProperty('--background-image', backgroundImage);
  };

  // Fetch and set the theme based on weather data when the app starts
  useEffect(() => {
    const fetchAndSetTheme = async () => {
      try {
        const location = await getUserLocation();
        if (location) {
          const weatherData = await getWeatherData(
            location.latitude,
            location.longitude
          );
          const determinedTheme = weatherData.isDay ? 'day' : 'night';
          setTheme(determinedTheme);
          document.documentElement.classList.remove('loading-theme');
          document.documentElement.classList.toggle('dark', determinedTheme === 'night');
          updateBackgroundImage(determinedTheme);
        } else {
          setTheme('day'); // Fallback to 'day' if location retrieval fails
          document.documentElement.classList.remove('loading-theme');
          updateBackgroundImage('day');
        }
      } catch (error) {
        console.error('Error determining theme based on weather:', error);
        setTheme('day'); // Fallback to 'day' in case of errors
        document.documentElement.classList.remove('loading-theme');
        updateBackgroundImage('day');
      }
    };
    // Placeholder class until the theme is set
    document.documentElement.classList.add('loading-theme');
    fetchAndSetTheme();
  }, []);

  // Toggle theme manually
  const toggleTheme = () => {
    const newTheme = theme === 'day' ? 'night' : 'day';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'night');
    updateBackgroundImage(newTheme);
  };

  if (theme === null) {
    return null; // Returns nothing while determining the theme
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
