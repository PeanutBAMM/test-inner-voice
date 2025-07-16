import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackScreenProps } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { ChatContainer, GlassOverlay, SpiritualGradientBackground } from '../../components/chat';
import useCoachStore from '../../store/innervoice/useCoachStore';
import useConversationStore from '../../store/innervoice/useConversationStore';
import useSubscriptionStore from '../../store/innervoice/useSubscriptionStore';
import useLibraryStore from '../../store/innervoice/useLibraryStore';
import { useTheme } from '../../contexts/ThemeContext';

export default function ChatScreen() {
  const navigation = useNavigation<RootStackScreenProps<'MainTabs'>['navigation']>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { getCoachResponse } = useCoachStore();
  const { messages, addMessage, isTyping, setTyping } = useConversationStore();
  const { canAskQuestion, recordQuestion } = useSubscriptionStore();
  const { saveTextSelection } = useLibraryStore();
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = async (text: string) => {
    // Check if user can ask question (free tier limit)
    const permission = await canAskQuestion();
    if (!permission.allowed) {
        // Show upgrade prompt
      navigation.navigate('UpgradeModal', { 
        reason: permission.message || '',
        resetTime: permission.resetTime?.toISOString(),
      });
      return;
    }

    // Add user message
    const userMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    recordQuestion();
    
    // Trigger animation
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 100); // Reset after triggering

    // Show typing
    setTyping(true);

    // Get coach response - convert messages to expected format
    const history = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    const response = await getCoachResponse(text, history);
    
    setTyping(false);
    
    // Add coach message
    const coachMessage = {
      id: `${Date.now() + 1}-${Math.random().toString(36).substr(2, 9)}`,
      text: response,
      sender: 'assistant' as const,
      timestamp: new Date(),
    };
    addMessage(coachMessage);
  };

  const handleSaveToLibrary = async (text: string, type: 'sentence' | 'paragraph') => {
    await saveTextSelection(text, type);
    // Optional: Show success feedback
    console.log(`${type === 'sentence' ? 'Zin' : 'Alinea'} opgeslagen in bibliotheek`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Spiritual gradient background */}
      <SpiritualGradientBackground 
        mood="peaceful"
        timeOfDay="afternoon"
        enableOrganicShapes={true}
        enableEnergyCore={false}
        onMessageSent={messageSent}
      >
        {/* Chat UI on top */}
        <GlassOverlay intensity={8}>
          <ChatContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          placeholder='Deel je gedachten...'
          onSaveToLibrary={handleSaveToLibrary}
          useSelectableMessages={true}
        />
        </GlassOverlay>
        
        {/* Glass Morphism Floating Button */}
        <View style={[styles.floatingButton, styles.profileButton, { top: insets.top + 20 }]}>
          {/* Background layers for glass effect */}
          <View style={StyleSheet.absoluteFillObject}>
            {/* Base layer */}
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  backgroundColor: theme.isDark
                    ? 'rgba(26, 35, 50, 0.95)'
                    : 'rgba(255, 245, 248, 0.95)',
                  borderRadius: 16,
                },
              ]}
            />
            
            {/* Gradient overlay 1 */}
            <LinearGradient
              colors={
                theme.isDark
                  ? ['rgba(46, 89, 132, 0.20)', 'rgba(46, 89, 132, 0.08)']
                  : ['rgba(255, 182, 193, 0.20)', 'rgba(255, 218, 185, 0.08)']
              }
              style={[StyleSheet.absoluteFillObject, { borderRadius: 16 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Gradient overlay 2 for depth */}
            <LinearGradient
              colors={
                theme.isDark
                  ? ['transparent', 'rgba(15, 20, 25, 0.4)']
                  : ['transparent', 'rgba(255, 255, 255, 0.4)']
              }
              style={[StyleSheet.absoluteFillObject, { borderRadius: 16 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </View>

          {/* Border for glass edge effect */}
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.isDark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(255, 182, 193, 0.35)',
              },
            ]}
          />

          <TouchableOpacity
            style={styles.buttonContent}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="person-circle-outline" 
              size={28} 
              color={theme.isDark ? '#4A7BA7' : '#FF69B4'} 
            />
          </TouchableOpacity>
        </View>
      </SpiritualGradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  profileButton: {
    right: 20,
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
});