import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomTabBar } from '../components/navigation/CustomTabBar';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import OnboardingChatScreen from '../screens/innervoice/OnboardingChatScreen';
import ChatScreen from '../screens/innervoice/ChatScreen';
import LibraryScreen from '../screens/innervoice/LibraryScreen';
import ProfileScreen from '../screens/innervoice/ProfileScreen';
import SettingsScreen from '../screens/innervoice/SettingsScreen';
import ConversationDetailScreen from '../screens/innervoice/ConversationDetailScreen';
import LanguageSettingsScreen from '../screens/innervoice/LanguageSettingsScreen';
import PrivacyPolicyScreen from '../screens/innervoice/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/innervoice/TermsOfServiceScreen';
import UpgradeModal from '../screens/innervoice/UpgradeModal';

// Stores
import useCoachStore from '../store/innervoice/useCoachStore';
import useUserStore from '../store/innervoice/useUserStore';
import useAppStore from '../store/useAppStore';

// Services
import mockAuthService from '../services/auth/mockAuthService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'Gesprek' }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ title: 'Bibliotheek' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profiel' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Instellingen' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { initializeCoach } = useCoachStore();
  const { loadUserProfile } = useUserStore();
  const { isAppOnboarded, initializeFromStorage } = useAppStore();

  useEffect(() => {
    checkOnboardingStatus();

    // Poll for auth status changes and reload triggers
    const statusCheckInterval = setInterval(async () => {
      const authStatus = await mockAuthService.isAuthenticated();
      const triggerReload = await AsyncStorage.getItem('triggerReload');

      if (authStatus !== isAuthenticated || triggerReload) {
        if (triggerReload) {
          await AsyncStorage.removeItem('triggerReload');
        }
        checkOnboardingStatus();
      }
    }, 1000);

    return () => clearInterval(statusCheckInterval);
  }, [isAuthenticated]);

  const checkOnboardingStatus = async () => {
    try {
      // Initialize app store from AsyncStorage
      await initializeFromStorage();

      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      const userProfile = await AsyncStorage.getItem('userProfile');

      // Check authentication status
      const authStatus = await mockAuthService.isAuthenticated();
      setIsAuthenticated(authStatus);

      if (onboardingCompleted === 'true' && userProfile) {
        setHasCompletedOnboarding(true);
        const profile = JSON.parse(userProfile);
        loadUserProfile(profile);
        initializeCoach(profile);
      }
    } catch (error) {
      // Error checking onboarding status
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // You could add a loading screen here
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {!isAppOnboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : !hasCompletedOnboarding ? (
        <Stack.Screen name="OnboardingChat" component={OnboardingChatScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="ConversationDetailScreen" component={ConversationDetailScreen} />
          <Stack.Screen name="LanguageSettingsScreen" component={LanguageSettingsScreen} />
          <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
          <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} />
          <Stack.Screen
            name="UpgradeModal"
            component={UpgradeModal}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
