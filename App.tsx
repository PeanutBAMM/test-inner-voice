import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from '@/navigation/RootNavigator';
import useCachedResources from '@/hooks/useCachedResources';
import useAuthStore from '@/store/useAuthStore';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  const isLoadingComplete = useCachedResources();
  const { isAuthenticated, isLoading } = useAuthStore();

  if (!isLoadingComplete || isLoading) {
    return null; // Or a splash screen component
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar style="auto" />
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