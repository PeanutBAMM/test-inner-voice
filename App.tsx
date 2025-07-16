import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@/navigation/RootNavigator';
import useCachedResources from '@/hooks/useCachedResources';
import useAuthStore from '@/store/useAuthStore';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BackgroundProvider } from '@/contexts/BackgroundContext';

// StatusBar configuration mapping
const STATUS_BAR_CONFIG: Record<string, { style: 'light' | 'dark' | 'auto'; backgroundColor: string }> = {
  'Chat': { style: 'light', backgroundColor: 'transparent' },
  'Library': { style: 'light', backgroundColor: 'transparent' },
  'Profile': { style: 'light', backgroundColor: 'transparent' },
  'Settings': { style: 'light', backgroundColor: 'transparent' },
  'Auth': { style: 'light', backgroundColor: 'transparent' },
  'Onboarding': { style: 'light', backgroundColor: 'transparent' },
  'OnboardingChat': { style: 'light', backgroundColor: 'transparent' },
  'ConversationDetail': { style: 'light', backgroundColor: 'transparent' },
  'LanguageSettings': { style: 'light', backgroundColor: 'transparent' },
  'PrivacyPolicy': { style: 'light', backgroundColor: 'transparent' },
  'TermsOfService': { style: 'light', backgroundColor: 'transparent' },
  'default': { style: 'auto', backgroundColor: 'transparent' }
};

// Helper function to get current route name
const getCurrentRouteName = (navigationState: any): string => {
  if (!navigationState) return '';
  
  const route = navigationState.routes[navigationState.index];
  
  // Handle nested navigation (tabs)
  if (route.state) {
    return getCurrentRouteName(route.state);
  }
  
  return route.name;
};

function App() {
  const isLoadingComplete = useCachedResources();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [currentRoute, setCurrentRoute] = useState('');

  if (!isLoadingComplete || isLoading) {
    return null; // Or a splash screen component
  }

  const onNavigationStateChange = (state: any) => {
    const route = getCurrentRouteName(state);
    setCurrentRoute(route);
  };

  const getStatusBarStyle = () => {
    return STATUS_BAR_CONFIG[currentRoute] || STATUS_BAR_CONFIG.default;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <BackgroundProvider>
            <NavigationContainer onStateChange={onNavigationStateChange}>
              <RootNavigator />
              <StatusBar 
                style={getStatusBarStyle().style}
                backgroundColor={getStatusBarStyle().backgroundColor}
                translucent={true}
              />
            </NavigationContainer>
          </BackgroundProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Wrap the entire app in an error boundary
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}