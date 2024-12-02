import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'day' | 'night';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('day'); // Default to 'day'

  const updateBackgroundImage = (currentTheme: Theme) => {
    const backgroundImage =
      currentTheme === 'day'
        ? "url('https://www.pandaexpress.com.ph/sites/ph/files/styles/background_desktop/public/2022-06/img-our-food-desktop.jpg?itok=sa-5OOhz')"
        : "url('/dark-theme-main-background.png')";
    document.documentElement.style.setProperty('--background-image', backgroundImage);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Access localStorage only on the client side
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'night');
        updateBackgroundImage(storedTheme);
      } else {
        // Fallback to default theme
        updateBackgroundImage('day');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'day' ? 'night' : 'day';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    document.documentElement.classList.toggle('dark', newTheme === 'night');
    updateBackgroundImage(newTheme);
  };

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
