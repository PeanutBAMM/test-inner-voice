import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MoodType = 'peaceful' | 'contemplative' | 'joyful' | 'grounded' | 'neutral';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type BackgroundVariant = 'spiritual' | 'gradient' | 'minimal' | 'transparent' | 'modern';

export interface BackgroundConfig {
  mood: MoodType;
  timeOfDay: TimeOfDay;
  variant: BackgroundVariant;
  enableEffects?: boolean;
}

interface BackgroundContextValue {
  currentMood: MoodType;
  timeOfDay: TimeOfDay;
  backgroundVariant: BackgroundVariant;
  setMood: (mood: MoodType) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setBackgroundVariant: (variant: BackgroundVariant) => void;
  setBackground: (config: Partial<BackgroundConfig>) => void;
  getBackgroundConfig: () => BackgroundConfig;
}

const BackgroundContext = createContext<BackgroundContextValue | undefined>(undefined);

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<MoodType>('peaceful');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>('spiritual');

  const setMood = (mood: MoodType) => {
    setCurrentMood(mood);
  };

  const setBackground = (config: Partial<BackgroundConfig>) => {
    if (config.mood) setCurrentMood(config.mood);
    if (config.timeOfDay) setTimeOfDay(config.timeOfDay);
    if (config.variant) setBackgroundVariant(config.variant);
  };

  const getBackgroundConfig = (): BackgroundConfig => ({
    mood: currentMood,
    timeOfDay,
    variant: backgroundVariant,
    enableEffects: true,
  });

  const value: BackgroundContextValue = {
    currentMood,
    timeOfDay,
    backgroundVariant,
    setMood,
    setTimeOfDay,
    setBackgroundVariant,
    setBackground,
    getBackgroundConfig,
  };

  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>;
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};
