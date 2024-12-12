/**
 * Represents a theme context component.
 * 
 * @remarks
 * This component provides a theme context with day and night themes.
 * 
 * @returns {JSX.Element} The rendered theme context component.
 */
import { FC, createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Theme = 'day' | 'night';

/**
 * Represents the theme context properties.
 * 
 * @interface
 * @property {Theme} theme - The current theme.
 * @property {() => void} toggleTheme - The function to toggle the theme.
 */
export interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

/**
 * Represents the theme provider component.
 * 
 * @remarks
 * This component provides a theme context with day and night themes.
 * 
 * @returns {JSX.Element} The rendered theme provider component.
 */
export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
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

/**
 * Represents a hook to use the theme context.
 * 
 * @remarks
 * This hook provides access to the theme context.
 * 
 * @returns {ThemeContextProps} The theme context properties.
 */
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
