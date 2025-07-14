import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';

          if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B7BA7',
        tabBarInactiveTintColor: '#C3B5E3',
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopColor: 'rgba(232, 223, 253, 0.3)',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
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
  const { initializeCoach } = useCoachStore();
  const { loadUserProfile } = useUserStore();

  useEffect(() => {
    checkOnboardingStatus();
    
    // Listen for onboarding completion trigger
    const checkReload = setInterval(async () => {
      const trigger = await AsyncStorage.getItem('triggerReload');
      if (trigger) {
        await AsyncStorage.removeItem('triggerReload');
        checkOnboardingStatus();
      }
    }, 1000);
    
    return () => clearInterval(checkReload);
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      const userProfile = await AsyncStorage.getItem('userProfile');
      
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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {!hasCompletedOnboarding ? (
          <Stack.Screen 
            name="OnboardingChat" 
            component={OnboardingChatScreen} 
          />
        ) : (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs} 
            />
            <Stack.Screen 
              name="ConversationDetailScreen" 
              component={ConversationDetailScreen} 
            />
            <Stack.Screen 
              name="LanguageSettingsScreen" 
              component={LanguageSettingsScreen} 
            />
            <Stack.Screen 
              name="PrivacyPolicyScreen" 
              component={PrivacyPolicyScreen} 
            />
            <Stack.Screen 
              name="TermsOfServiceScreen" 
              component={TermsOfServiceScreen} 
            />
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
    </NavigationContainer>
  );
}