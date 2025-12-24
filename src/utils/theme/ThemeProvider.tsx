import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightTheme, DarkTheme, ThemeType } from './theme';

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
} 

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [theme, setTheme] = useState<ThemeType>(
    isDarkMode ? DarkTheme : LightTheme,
  );

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
          const isDark = storedTheme === 'dark';
          setIsDarkMode(isDark);
          setTheme(isDark ? DarkTheme : LightTheme);
        }
      } catch (error) {
        console.error('Error loading theme from storage:', error);
      }
    };
    loadTheme();
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (!colorScheme) return;
      setIsDarkMode(colorScheme === 'dark');
      setTheme(colorScheme === 'dark' ? DarkTheme : LightTheme);
    });

    return () => subscription.remove();
  }, []);

  const toggleTheme = async () => {
    try {
      const newIsDarkMode = !isDarkMode;
      setIsDarkMode(newIsDarkMode);
      setTheme(newIsDarkMode ? DarkTheme : LightTheme);
      await AsyncStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

