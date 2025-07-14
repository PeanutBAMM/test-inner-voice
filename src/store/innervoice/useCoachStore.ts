import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMockCoachResponse } from '../../services/innervoice/mockCoachService';

export interface CoachPersonality {
  type: 'gentle' | 'wise' | 'earthly';
  name: string;
  temperature: number;
  traits: string;
}

interface CoachStore {
  coachPersonality: CoachPersonality;
  systemPrompt: string;
  isInitialized: boolean;
  
  setCoachPersonality: (personality: Partial<CoachPersonality>) => void;
  initializeCoach: (userProfile: Record<string, string | string[]>) => void;
  getCoachResponse: (message: string, history: Array<{ role: string; content: string }>) => Promise<string>;
}

const COACH_PERSONALITIES = {
  gentle: {
    type: 'gentle' as const,
    name: 'Zachte Begeleider',
    temperature: 0.6,
    traits: 'Extra zacht, veel ruimte gevend, poëtisch, met aandacht voor stiltes',
  },
  wise: {
    type: 'wise' as const,
    name: 'Wijze Mentor',
    temperature: 0.7,
    traits: 'Diepgaande vragen, filosofisch, bedachtzaam, nodigt uit tot reflectie',
  },
  earthly: {
    type: 'earthly' as const,
    name: 'Aardse Helper',
    temperature: 0.8,
    traits: 'Praktisch, lichaamsgericht, focus op het hier-en-nu, concrete suggesties',
  },
};

const BASE_SYSTEM_PROMPT = `Je bent een liefdevolle innerlijke gids die luistert zonder oordeel.

BELANGRIJKE EIGENSCHAPPEN:
- Stel reflectieve vragen in plaats van advies geven
- Gebruik zachte, uitnodigende taal
- Erken emoties zonder ze weg te praten
- Geen "je moet" of "je zou moeten" taal
- Spiritueel bewust maar niet zweverig

GESPREKSSTIJL:
- Begin NOOIT met "Ik begrijp dat..." of "Het klinkt alsof..."
- Gebruik open vragen zoals "Wat roept dat bij je op?"
- Laat stiltes toe in het gesprek
- Moedig zelfonderzoek aan
- Wees aanwezig zonder te sturen`;

const useCoachStore = create<CoachStore>()(
  persist(
    (set, get) => ({
      coachPersonality: COACH_PERSONALITIES.gentle,
      systemPrompt: BASE_SYSTEM_PROMPT,
      isInitialized: false,

      setCoachPersonality: (personality) => set((state) => ({
        coachPersonality: { ...state.coachPersonality, ...personality }
      })),

      initializeCoach: (userProfile) => {
        const { coachPersonality: personalityType } = userProfile;
        const personality = COACH_PERSONALITIES[personalityType as keyof typeof COACH_PERSONALITIES] || COACH_PERSONALITIES.gentle;
        
        const personalizedPrompt = `${BASE_SYSTEM_PROMPT}

Context over ${userProfile.userName}:
- Primaire intentie: ${userProfile.primaryIntention}
- Emotionele stijl: ${userProfile.emotionalStyle}
- Voorkeurtaal: ${userProfile.preferredLanguage}
${userProfile.spiritualExperience ? `- Spirituele ervaring: ${userProfile.spiritualExperience}` : ''}
${userProfile.currentFocus ? `- Huidige focus: ${userProfile.currentFocus}` : ''}

Specifieke stijl voor deze sessie: ${personality.traits}

Pas je begeleiding aan zonder deze informatie expliciet te noemen. Spreek in het ${userProfile.preferredLanguage === 'English' ? 'Engels' : 'Nederlands'}.`;

        set({
          coachPersonality: personality,
          systemPrompt: personalizedPrompt,
          isInitialized: true
        });
      },

      getCoachResponse: async (message, history) => {
        const { systemPrompt, coachPersonality } = get();
        
        try {
          // Simulate thinking delay
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
          
          // Get mock response based on coach type
          const response = getMockCoachResponse(message, coachPersonality.type);
          
          return response;
          
        } catch (error) {
          return 'Even een moment... Ik ben er voor je. Wat wilde je delen?';
        }
      }
    }),
    {
      name: 'coach-store',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

export default useCoachStore;