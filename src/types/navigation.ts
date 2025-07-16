import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define your param lists
export type RootStackParamList = {
  // Main screens
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  OnboardingChat: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  
  // Modal screens
  UpgradeModal: {
    reason?: string;
    resetTime?: string;
  };
  
  // Detail screens
  ConversationDetailScreen: {
    conversationId: string;
    date?: string;
  };
  LanguageSettingsScreen: undefined;
  PrivacyPolicyScreen: undefined;
  TermsOfServiceScreen: undefined;
};

export type AuthStackParamList = {
  Auth: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  PhoneAuth: undefined;
  OTPVerification: { phoneNumber: string };
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  // InnerVoice tabs
  Chat: undefined;
  Library: undefined;
};

// Screen props types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Declare global navigation types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}