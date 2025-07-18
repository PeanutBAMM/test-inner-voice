import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Tier {
  type: 'free' | 'premium';
  conversationLimit: number;
  dailyQuestionLimit: number;
  retentionMonths: number;
  features: {
    voiceOutput: boolean;
    cloudBackup: boolean;
    unlimitedQuestions: boolean;
  };
}

interface Usage {
  questionsToday: number;
  conversationCount: number;
  lastResetDate: string;
}

interface SubscriptionStore {
  tier: Tier;
  usage: Usage;
  isPremium: boolean;

  checkDailyLimit: () => void;
  canAskQuestion: () => Promise<{ allowed: boolean; message?: string; resetTime?: Date }>;
  recordQuestion: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  getTimeUntilReset: () => string;
}

const STORE_VERSION = 2; // Increment when schema changes

const TIERS = {
  free: {
    type: 'free' as const,
    conversationLimit: 5,
    dailyQuestionLimit: 1000,
    retentionMonths: 0,
    features: {
      voiceOutput: false,
      cloudBackup: false,
      unlimitedQuestions: false,
    },
  },
  premium: {
    type: 'premium' as const,
    conversationLimit: 100,
    dailyQuestionLimit: -1, // Unlimited
    retentionMonths: 18,
    features: {
      voiceOutput: true,
      cloudBackup: true,
      unlimitedQuestions: true,
    },
  },
};

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      // Start with free tier by default
      tier: TIERS.free,
      usage: {
        questionsToday: 0,
        conversationCount: 0,
        lastResetDate: new Date().toDateString(),
      },
      isPremium: false,

      checkDailyLimit: () => {
        const today = new Date().toDateString();
        const { usage } = get();

        if (usage.lastResetDate !== today) {
          set({
            usage: {
              ...usage,
              questionsToday: 0,
              lastResetDate: today,
            },
          });
        }
      },

      canAskQuestion: async () => {
        const { tier, usage, checkDailyLimit } = get();

        // Reset counter if new day
        checkDailyLimit();

        // Premium users have unlimited questions
        if (tier.type === 'premium') {
          return { allowed: true };
        }

        // Check free tier limit
        if (usage.questionsToday >= tier.dailyQuestionLimit) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);

          return {
            allowed: false,
            message: `Je hebt je dagelijkse limiet van ${tier.dailyQuestionLimit} vragen bereikt. Upgrade naar Premium voor ongelimiteerde toegang!`,
            resetTime: tomorrow,
          };
        }

        return { allowed: true };
      },

      recordQuestion: async () => {
        const { usage } = get();

        set({
          usage: {
            ...usage,
            questionsToday: usage.questionsToday + 1,
          },
        });
      },

      upgradeToPremium: async () => {
        // Here you would integrate with your payment provider
        // For now, just switching to premium tier

        // In real app: process payment
        // const purchase = await processPayment('premium_monthly');

        set({
          tier: TIERS.premium,
          isPremium: true,
        });
      },

      restorePurchases: async () => {
        // Here you would check with your payment provider
        // For now, checking a mock flag

        try {
          // In real app: check purchase history
          // const purchases = await getPurchaseHistory();
          // const hasPremium = purchases.some(p => p.productId === 'premium_monthly');

          const hasPremium = false; // Mock value

          if (hasPremium) {
            set({
              tier: TIERS.premium,
              isPremium: true,
            });
          }
        } catch (error) {
          // Error restoring purchases
        }
      },

      getTimeUntilReset: () => {
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
          return `${hours} uur en ${minutes} minuten`;
        }
        return `${minutes} minuten`;
      },
    }),
    {
      name: 'subscription-store',
      version: STORE_VERSION,
      migrate: (persistedState: any, version: number) => {
        if (version < STORE_VERSION) {
          // Reset to defaults with new limit
          return {
            tier: TIERS.free,
            usage: {
              questionsToday: 0,
              conversationCount: 0,
              lastResetDate: new Date().toDateString(),
            },
            isPremium: false,
          };
        }
        return persistedState;
      },
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
export default useSubscriptionStore;
