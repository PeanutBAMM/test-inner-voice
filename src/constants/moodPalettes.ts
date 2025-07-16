export interface MoodPalette {
  primary: string[];
  accent: string[];
  glow: string;
  sparkle: string;
  orb1: string;
  orb2: string;
}

export interface MoodPalettes {
  peaceful: MoodPalette;
  contemplative: MoodPalette;
  joyful: MoodPalette;
  grounded: MoodPalette;
  neutral: MoodPalette;
}

// Mood-based color palettes - Dynamische paletten voor light/dark mode
export const MOOD_PALETTES: MoodPalettes = {
  peaceful: {
    primary: ['#FFF0F5', '#FFE4E1', '#FFD6E8', '#FFC8DD', '#FFB6C1', '#FFDAB9'], // Lavender blush naar perzik
    accent: ['#FFB6C1', '#FFA07A', '#FF7F50'], // Roze naar koraal accenten
    glow: '#FFB6C1', // Zachte roze gloed
    sparkle: '#FFD700', // Gouden sparkle
    orb1: '#FF69B4', // Hot pink voor diepte
    orb2: '#FFDAB9', // Perzik voor contrast
  },
  contemplative: {
    primary: ['#F8F0F8', '#F5E6F5', '#F2DCF2', '#EFD2EF', '#ECC8EC', '#E9BEE9'], // Koele roze-lila
    accent: ['#DDA0DD', '#DA70D6', '#D8BFD8'], // Plum naar thistle
    glow: '#DDA0DD', // Plum gloed
    sparkle: '#E6E6FA', // Lavender sparkle
    orb1: '#DA70D6', // Orchid
    orb2: '#FFE4E1', // Misty rose
  },
  joyful: {
    primary: ['#FFF5EE', '#FFEFD5', '#FFE4B5', '#FFDAB9', '#FFD39B', '#FFCBA4'], // Seashell naar perzik
    accent: ['#FFA07A', '#FF7F50', '#FF6347'], // Zalm naar tomaat
    glow: '#FFA07A', // Zalm gloed
    sparkle: '#FFD700', // Gouden sparkle
    orb1: '#FF7F50', // Koraal
    orb2: '#FFE4B5', // Moccasin
  },
  grounded: {
    primary: ['#F8F8F6', '#F5F3F0', '#F0F0E8', '#EAE8E0', '#E5E3DB', '#E0DDD6'], // Subtiele creme naar warm beige
    accent: ['#D4C4A0', '#C8B99C', '#B8A082'], // Zachte taupe accenten
    glow: '#D4C4A0', // Warme taupe gloed
    sparkle: '#F0D700', // Gedempte gouden sparkle
    orb1: '#C8B99C', // Zachte taupe
    orb2: '#F5F3F0', // Warm wit
  },
  neutral: {
    primary: ['#F8F8FF', '#F5F5F5', '#E6E6FA', '#D3D3D3', '#C0C0C0', '#B0B0B0'], // Ghost white naar zilver
    accent: ['#9370DB', '#8A2BE2', '#7B68EE'], // Medium purple naar medium slate blue
    glow: '#9370DB', // Medium purple gloed
    sparkle: '#E6E6FA', // Lavender sparkle
    orb1: '#8A2BE2', // Blue violet
    orb2: '#F8F8FF', // Ghost white
  },
};

// Dark mode variants voor mood palettes
export const DARK_MOOD_PALETTES: MoodPalettes = {
  peaceful: {
    primary: ['#2E1A2E', '#3A2A3A', '#4A3A4A', '#5A4A5A', '#6A5A6A', '#7A6A7A'], // Donkere tinten
    accent: ['#8B7BA7', '#9A8AB7', '#A999C7'], // Zachte paarse accenten
    glow: '#8B7BA7',
    sparkle: '#B8B8B8',
    orb1: '#9A8AB7',
    orb2: '#7A6A7A',
  },
  contemplative: {
    primary: ['#1A1A2E', '#2A2A3E', '#3A3A4E', '#4A4A5E', '#5A5A6E', '#6A6A7E'], // Diepe navy tinten
    accent: ['#6B6B9E', '#7B7BAE', '#8B8BBE'], // Zachte blauw-paarse accenten
    glow: '#6B6B9E',
    sparkle: '#A8A8A8',
    orb1: '#7B7BAE',
    orb2: '#6A6A7E',
  },
  joyful: {
    primary: ['#2E2E1A', '#3E3E2A', '#4E4E3A', '#5E5E4A', '#6E6E5A', '#7E7E6A'], // Warme donkere tinten
    accent: ['#A7A77B', '#B7B78B', '#C7C79B'], // Zachte gouden accenten
    glow: '#A7A77B',
    sparkle: '#C8C8C8',
    orb1: '#B7B78B',
    orb2: '#7E7E6A',
  },
  grounded: {
    primary: ['#1A1A1A', '#2A2A2A', '#3A3A3A', '#4A4A4A', '#5A5A5A', '#6A6A6A'], // Neutrale donkere tinten
    accent: ['#8A8A8A', '#9A9A9A', '#AAAAAA'], // Grijze accenten
    glow: '#8A8A8A',
    sparkle: '#B8B8B8',
    orb1: '#9A9A9A',
    orb2: '#6A6A6A',
  },
  neutral: {
    primary: ['#0F1419', '#1A2332', '#243447', '#2E455C', '#385671', '#426786'], // Deep space tinten
    accent: ['#4A7BA7', '#5A8BB7', '#6A9BC7'], // Steel blue accenten
    glow: '#4A7BA7',
    sparkle: '#8AB8D8',
    orb1: '#5A8BB7',
    orb2: '#426786',
  },
};

// Time of day tints
export const TIME_TINTS = {
  morning: {
    tint: 'rgba(255, 248, 220, 0.3)', // Cornsilk morning light
    brightness: 1.05,
    description: 'Zachte ochtend gloed',
  },
  afternoon: {
    tint: 'rgba(255, 235, 205, 0.2)', // Blanched almond afternoon warmth
    brightness: 1.0,
    description: 'Warme middag sfeer',
  },
  evening: {
    tint: 'rgba(255, 192, 203, 0.25)', // Pink evening glow
    brightness: 0.95,
    description: 'Romantische avond tint',
  },
  night: {
    tint: 'rgba(25, 25, 112, 0.3)', // Midnight blue mystery
    brightness: 0.9,
    description: 'Mystieke nacht sfeer',
  },
};

// Helper functions
export const getMoodPalette = (mood: keyof MoodPalettes, isDark: boolean): MoodPalette => {
  return isDark ? DARK_MOOD_PALETTES[mood] : MOOD_PALETTES[mood];
};

export const getTimeTint = (timeOfDay: keyof typeof TIME_TINTS) => {
  return TIME_TINTS[timeOfDay];
};