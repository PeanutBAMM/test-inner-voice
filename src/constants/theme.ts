// Import mood palettes for consistent theming
import { MOOD_PALETTES } from '../components/chat/backgrounds/SpiritualGradientBackground';

export const LightColors = {
  // Vrouwelijke energy brand colors
  primary: '#FFB6C1', // Light pink
  primaryDark: '#FF69B4', // Hot pink
  primaryLight: '#FFDAB9', // Peach puff
  
  // Neutral colors met roze tint
  background: '#FFF5F8',
  surface: '#FFF0F5',
  card: '#FFFFFF',
  
  // Text colors
  text: '#4A4458',
  textSecondary: '#8B7BA7',
  textLight: '#B5A7CB',
  textOnPrimary: '#FFFFFF',
  
  // UI colors
  border: '#FFE4E1',
  divider: '#FFDAB9',
  error: '#FF6B6B',
  warning: '#FFB347',
  success: '#98D8C8',
  info: '#87CEEB',
  accent: '#FFDAB9', // Perzik accent
  
  // Additional colors
  white: '#FFFFFF',
  secondary: '#DDA0DD', // Plum
  
  // Glass morphism
  glass: 'rgba(255, 182, 193, 0.25)',
  glassLight: 'rgba(255, 218, 185, 0.25)',
  
  // Shadows
  shadow: '#000000',
  
  // Mood-based colors from SpiritualGradientBackground
  peaceful: {
    primary: MOOD_PALETTES.peaceful.primary,
    accent: MOOD_PALETTES.peaceful.accent,
    glow: MOOD_PALETTES.peaceful.glow,
  },
  contemplative: {
    primary: MOOD_PALETTES.contemplative.primary,
    accent: MOOD_PALETTES.contemplative.accent,
    glow: MOOD_PALETTES.contemplative.glow,
  },
  joyful: {
    primary: MOOD_PALETTES.joyful.primary,
    accent: MOOD_PALETTES.joyful.accent,
    glow: MOOD_PALETTES.joyful.glow,
  },
  grounded: {
    primary: MOOD_PALETTES.grounded.primary,
    accent: MOOD_PALETTES.grounded.accent,
    glow: MOOD_PALETTES.grounded.glow,
  },
  neutral: {
    primary: MOOD_PALETTES.neutral.primary,
    accent: MOOD_PALETTES.neutral.accent,
    glow: MOOD_PALETTES.neutral.glow,
  },
} as const;

export const DarkColors = {
  // Mannelijke energy brand colors - deep ocean blues
  primary: '#2E5984', // Deep ocean blue
  primaryDark: '#1A3A5C', // Dark navy
  primaryLight: '#4A7BA7', // Steel blue
  
  // Deep space foundation colors
  background: '#0F1419', // Deep space navy
  surface: '#1A2332', // Dark slate
  card: '#243447', // Midnight blue
  
  // Electric blue text colors
  text: '#E8F1FF', // Ice blue white
  textSecondary: '#7FB3D3', // Electric blue
  textLight: '#5A9BD4', // Bright blue
  textOnPrimary: '#FFFFFF', // Pure white
  
  // Cosmic UI colors
  border: '#2A3F5F', // Deep blue-gray
  divider: '#3A5A7A', // Darker teal
  error: '#FF6B6B', // Keep error red
  warning: '#FFB347', // Keep warning orange
  success: '#00CED1', // Dark turquoise success
  info: '#00BFFF', // Deep sky blue
  accent: '#00CED1', // Dark turquoise accent
  
  // Additional colors
  white: '#E8F1FF', // Ice blue white
  secondary: '#5F9EA0', // Cadet blue
  
  // Glass morphism - translucent blue
  glass: 'rgba(46, 89, 132, 0.25)', // Translucent ocean blue
  glassLight: 'rgba(74, 123, 167, 0.25)', // Translucent steel blue
  
  // Shadows
  shadow: '#000000',
  
  // Dark masculine mood-based colors
  peaceful: {
    primary: ['#0F1419', '#1A2332', '#2E5984', '#4A7BA7', '#7FB3D3', '#B3D9FF'],
    accent: ['#2E5984', '#4A7BA7', '#7FB3D3'],
    glow: '#00CED1',
  },
  contemplative: {
    primary: ['#1A1625', '#2D2A3D', '#4A3D5C', '#6B5B73', '#8B7BA7', '#B8A9C9'],
    accent: ['#663399', '#8A2BE2', '#9370DB'],
    glow: '#8A2BE2',
  },
  joyful: {
    primary: ['#0F1F1C', '#1A332E', '#2E5984', '#20B2AA', '#40E0D0', '#7FFFD4'],
    accent: ['#00CED1', '#20B2AA', '#40E0D0'],
    glow: '#00FFFF',
  },
  grounded: {
    primary: ['#191F25', '#2A3F5F', '#4682B4', '#5F9EA0', '#708090', '#B0C4DE'],
    accent: ['#4682B4', '#5F9EA0', '#708090'],
    glow: '#4682B4',
  },
  neutral: {
    primary: ['#0F1419', '#2A3F5F', '#5F9EA0', '#778899', '#A9A9A9', '#D3D3D3'],
    accent: ['#708090', '#778899', '#A9A9A9'],
    glow: '#5F9EA0',
  },
} as const;

export const Colors = LightColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
  full: 9999,
} as const;

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
  },
} as const;

// Theme utility function
export const getThemeColors = (isDark: boolean) => {
  return isDark ? DarkColors : LightColors;
};

// Combined theme object for easy imports
export const theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  typography: Typography,
  shadows: Shadows,
} as const;

// Create themed styles helper
export const createThemedStyles = (isDark: boolean) => {
  const colors = getThemeColors(isDark);
  return {
    colors,
    spacing: Spacing,
    borderRadius: BorderRadius,
    typography: Typography,
    shadows: Shadows,
  };
};