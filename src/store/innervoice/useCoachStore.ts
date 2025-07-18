import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLLMResponse } from '../../services/innervoice/llmService';

interface CoachStore {
  systemPrompt: string;
  isInitialized: boolean;

  initializeCoach: (userProfile: Record<string, string | string[]>) => void;
  getCoachResponse: (
    message: string,
    history: Array<{ role: string; content: string }>
  ) => Promise<string>;
}

const DEFAULT_TEMPERATURE = 0.6;
const DEFAULT_TRAITS = 'Extra zacht, veel ruimte gevend, poëtisch, met aandacht voor stiltes';

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
      systemPrompt: BASE_SYSTEM_PROMPT,
      isInitialized: false,

      initializeCoach: (userProfile) => {
        const personalizedPrompt = `${BASE_SYSTEM_PROMPT}

Context over ${userProfile.userName}:
- Primaire intentie: ${userProfile.primaryIntention}
- Emotionele stijl: ${userProfile.emotionalStyle}
- Voorkeurtaal: ${userProfile.preferredLanguage}
${userProfile.spiritualExperience ? `- Spirituele ervaring: ${userProfile.spiritualExperience}` : ''}
${userProfile.currentFocus ? `- Huidige focus: ${userProfile.currentFocus}` : ''}

Specifieke stijl voor deze sessie: ${DEFAULT_TRAITS}

Pas je begeleiding aan zonder deze informatie expliciet te noemen. Spreek in het ${userProfile.preferredLanguage === 'English' ? 'Engels' : 'Nederlands'}.`;

        set({
          systemPrompt: personalizedPrompt,
          isInitialized: true,
        });
      },

      getCoachResponse: async (message, history) => {
        const { systemPrompt } = get();

        try {
          // Always try to use LLM first - convert history to ChatMessage format
          const formattedHistory = history.map((msg) => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
          }));

          const response = await getLLMResponse(
            message,
            formattedHistory,
            systemPrompt,
            'gentle',
            DEFAULT_TEMPERATURE
          );

          return response;
        } catch (error) {
          console.error('Coach response error:', error);
          return 'Even een moment... Ik ben er voor je. Wat wilde je delen?';
        }
      },
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
