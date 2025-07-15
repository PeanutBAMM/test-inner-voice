import React, { createContext, useContext, ReactNode } from 'react';
import useAppStore from '../store/useAppStore';
import { getThemeColors, LightColors, DarkColors } from '../constants/theme';

interface ThemeContextValue {
  isDark: boolean;
  colors: typeof LightColors | typeof DarkColors;
  toggleTheme: () => void;
  theme: {
    isDark: boolean;
    colors: typeof LightColors | typeof DarkColors;
  };
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme: currentTheme, toggleTheme } = useAppStore();
  
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const value: ThemeContextValue = {
    isDark,
    colors,
    toggleTheme,
    theme: {
      isDark,
      colors,
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};