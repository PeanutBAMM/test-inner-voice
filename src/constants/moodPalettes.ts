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

// Mood-based color palettes - Feminine energy voor light mode
export const MOOD_PALETTES: MoodPalettes = {
  peaceful: {
    primary: ['#FFF0F5', '#FFE4E1', '#FFD6E8', '#FFC8DD', '#FFB6C1', '#FFDAB9'], // Lavender blush naar perzik
    accent: ['#FFB6C1', '#FF69B4', '#FF1493'], // Light pink, hot pink (Dot style), deep pink
    glow: '#FFB6C1', // Zachte roze gloed
    sparkle: '#FFD700', // Gouden sparkle ✨
    orb1: '#FF69B4', // Hot pink voor diepte
    orb2: '#FFDAB9', // Perzik voor contrast
  },
  contemplative: {
    primary: ['#F8F0F8', '#F5E6F5', '#F2DCF2', '#EFD2EF', '#ECC8EC', '#E9BEE9'], // Koele roze-lila
    accent: ['#DDA0DD', '#DA70D6', '#D8BFD8'], // Plum naar thistle
    glow: '#DDA0DD', // Plum gloed
    sparkle: '#FFD700', // Gouden sparkle ✨
    orb1: '#DA70D6', // Orchid
    orb2: '#FFE4E1', // Misty rose
  },
  joyful: {
    primary: ['#FFF5EE', '#FFEFD5', '#FFE4B5', '#FFDAB9', '#FFD39B', '#FFCBA4'], // Seashell naar perzik
    accent: ['#FFA07A', '#FF7F50', '#FF6347'], // Zalm naar tomaat
    glow: '#FFA07A', // Zalm gloed
    sparkle: '#FFD700', // Gouden sparkle ✨
    orb1: '#FF7F50', // Koraal
    orb2: '#FFE4B5', // Moccasin
  },
  grounded: {
    primary: ['#FFF9F0', '#FFF5E6', '#FFEDD9', '#FFE5CC', '#FFDDBF', '#FFD5B2'], // Zacht geel-roze spectrum
    accent: ['#FFB888', '#FFA574', '#FF9B6B'], // Zachte sienna naar warme abrikoos
    glow: '#FFCCA5', // Perzik gloed
    sparkle: '#FFD700', // Gouden sparkle ✨
    orb1: '#FFB888', // Zachte sienna
    orb2: '#FFF0E5', // Licht perzik
  },
  neutral: {
    primary: ['#FFF0F5', '#F5E6EA', '#EBDCE0', '#E1D2D6', '#D7C8CC', '#CDBEC2'], // Lavender blush naar grijs-roze
    accent: ['#E6E6FA', '#D8BFD8', '#DDA0DD'], // Lavender naar plum
    glow: '#E6E6FA', // Lavender gloed
    sparkle: '#FFD700', // Gouden sparkle ✨
    orb1: '#D8BFD8', // Thistle
    orb2: '#FFE4E1', // Misty rose
  },
};

// Dark mode variants voor mood palettes - Masculine energy
export const DARK_MOOD_PALETTES: MoodPalettes = {
  peaceful: {
    primary: ['#0F1419', '#1A2332', '#2E5984', '#4A7BA7', '#7FB3D3', '#B3D9FF'], // Deep ocean progression
    accent: ['#2E5984', '#4A7BA7', '#7FB3D3'], // Steel blue spectrum
    glow: '#00CED1', // Dark turquoise glow
    sparkle: '#00BFFF', // Deep sky blue sparkle
    orb1: '#1A3A5C', // Dark navy
    orb2: '#00CED1', // Turquoise accent
  },
  contemplative: {
    primary: ['#1A1625', '#2D2A3D', '#4A3D5C', '#6B5B73', '#8B7BA7', '#B8A9C9'], // Deep purple progression
    accent: ['#663399', '#8A2BE2', '#9370DB'], // Purple spectrum
    glow: '#8A2BE2', // Blue violet glow
    sparkle: '#9370DB', // Medium purple sparkle
    orb1: '#4A3D5C', // Dark purple
    orb2: '#8A2BE2', // Blue violet accent
  },
  joyful: {
    primary: ['#0F1F1C', '#1A332E', '#2E5984', '#20B2AA', '#40E0D0', '#7FFFD4'], // Teal progression
    accent: ['#00CED1', '#20B2AA', '#40E0D0'], // Turquoise spectrum
    glow: '#00FFFF', // Cyan glow
    sparkle: '#7FFFD4', // Aquamarine sparkle
    orb1: '#1A332E', // Dark sea green
    orb2: '#00CED1', // Dark turquoise accent
  },
  grounded: {
    primary: ['#191F25', '#2A3F5F', '#4682B4', '#5F9EA0', '#708090', '#B0C4DE'], // Steel blue progression
    accent: ['#4682B4', '#5F9EA0', '#708090'], // Steel spectrum
    glow: '#4682B4', // Steel blue glow
    sparkle: '#87CEEB', // Sky blue sparkle
    orb1: '#2A3F5F', // Dark steel
    orb2: '#708090', // Slate gray accent
  },
  neutral: {
    primary: ['#191919', '#2E3A4F', '#4A5568', '#718096', '#A0AEC0', '#CBD5E0'], // Gray-blue progression
    accent: ['#4169E1', '#6495ED', '#87CEEB'], // Royal blue spectrum
    glow: '#6495ED', // Cornflower blue glow
    sparkle: '#B0E0E6', // Powder blue sparkle
    orb1: '#2E3A4F', // Dark blue-gray
    orb2: '#778899', // Light slate gray accent
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
