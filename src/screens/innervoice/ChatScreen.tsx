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
import { ChatContainer, GlassOverlay } from '../../components/chat';
import { UniversalBackground } from '../../components/backgrounds/UniversalBackground';
import useCoachStore from '../../store/innervoice/useCoachStore';
import useConversationStore from '../../store/innervoice/useConversationStore';
import useSubscriptionStore from '../../store/innervoice/useSubscriptionStore';
import useLibraryStore from '../../store/innervoice/useLibraryStore';
import { useTheme } from '../../contexts/ThemeContext';
import { useBackground } from '../../contexts/BackgroundContext';
import { getMoodPalette } from '../../constants/moodPalettes';
import { TAB_BAR_HEIGHT } from '../../constants/navigation';

export default function ChatScreen() {
  const navigation = useNavigation<RootStackScreenProps<'MainTabs'>['navigation']>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { currentMood } = useBackground();
  const moodPalette = getMoodPalette(currentMood, theme.isDark);
  const { getCoachResponse } = useCoachStore();
  const { messages, addMessage, isTyping, setTyping } = useConversationStore();
  const { canAskQuestion, recordQuestion } = useSubscriptionStore();
  const { saveTextSelection } = useLibraryStore();
  const [messageSent, setMessageSent] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

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

  const handleStartVoiceRecording = () => {
    setIsVoiceRecording(true);
    // TODO: Implement actual voice recording with expo-audio
    console.log('Voice recording started');
  };

  const handleStopVoiceRecording = () => {
    setIsVoiceRecording(false);
    // TODO: Implement speech-to-text conversion
    console.log('Voice recording stopped');
    // For now, simulate voice input
    setTimeout(() => {
      handleSendMessage('Dit is een test spraakbericht');
    }, 500);
  };

  return (
    <View style={[styles.container, { 
      paddingTop: insets.top,
      paddingBottom: TAB_BAR_HEIGHT + insets.bottom 
    }]}>
      {/* Spiritual gradient background */}
      <UniversalBackground 
        variant="spiritual"
        mood="peaceful"
        timeOfDay="afternoon"
        enableEffects={true}
      />
      
      {/* Chat UI on top */}
      <GlassOverlay intensity={8}>
        <ChatContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          placeholder='Deel je gedachten...'
          onSaveToLibrary={handleSaveToLibrary}
          useSelectableMessages={true}
          showVoiceButton={true}
          onStartVoiceRecording={handleStartVoiceRecording}
          onStopVoiceRecording={handleStopVoiceRecording}
          isVoiceRecording={isVoiceRecording}
          bottomPadding={0}
          keyboardVerticalOffset={insets.top}
        />
      </GlassOverlay>
      
      {/* Glass Morphism Floating Button */}
      <View style={[styles.floatingButton, styles.profileButton, { top: 20 }]}>
          {/* Background layers for glass effect */}
          <View style={StyleSheet.absoluteFillObject}>
            {/* Base layer */}
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  backgroundColor: theme.isDark
                    ? `rgba(${parseInt(moodPalette.primary[5]?.slice(1, 3) || '1A', 16)}, ${parseInt(moodPalette.primary[5]?.slice(3, 5) || '23', 16)}, ${parseInt(moodPalette.primary[5]?.slice(5, 7) || '32', 16)}, 0.85)`
                    : `rgba(${parseInt(moodPalette.primary[0]?.slice(1, 3) || 'FF', 16)}, ${parseInt(moodPalette.primary[0]?.slice(3, 5) || 'F5', 16)}, ${parseInt(moodPalette.primary[0]?.slice(5, 7) || 'F8', 16)}, 0.85)`,
                  borderRadius: 16,
                },
              ]}
            />
            
            {/* Gradient overlay 1 */}
            <LinearGradient
              colors={
                theme.isDark
                  ? [`rgba(${parseInt(moodPalette.accent[0]?.slice(1, 3) || '2E', 16)}, ${parseInt(moodPalette.accent[0]?.slice(3, 5) || '59', 16)}, ${parseInt(moodPalette.accent[0]?.slice(5, 7) || '84', 16)}, 0.10)`, `rgba(${parseInt(moodPalette.accent[0]?.slice(1, 3) || '2E', 16)}, ${parseInt(moodPalette.accent[0]?.slice(3, 5) || '59', 16)}, ${parseInt(moodPalette.accent[0]?.slice(5, 7) || '84', 16)}, 0.05)`]
                  : [`rgba(${parseInt(moodPalette.accent[0]?.slice(1, 3) || 'FF', 16)}, ${parseInt(moodPalette.accent[0]?.slice(3, 5) || 'B6', 16)}, ${parseInt(moodPalette.accent[0]?.slice(5, 7) || 'C1', 16)}, 0.10)`, `rgba(${parseInt(moodPalette.accent[1]?.slice(1, 3) || 'FF', 16)}, ${parseInt(moodPalette.accent[1]?.slice(3, 5) || 'DA', 16)}, ${parseInt(moodPalette.accent[1]?.slice(5, 7) || 'B9', 16)}, 0.05)`]
              }
              style={[StyleSheet.absoluteFillObject, { borderRadius: 16 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Gradient overlay 2 for depth */}
            <LinearGradient
              colors={
                theme.isDark
                  ? ['transparent', `rgba(${parseInt(moodPalette.primary[5]?.slice(1, 3) || '0F', 16)}, ${parseInt(moodPalette.primary[5]?.slice(3, 5) || '14', 16)}, ${parseInt(moodPalette.primary[5]?.slice(5, 7) || '19', 16)}, 0.2)`]
                  : ['transparent', `rgba(${parseInt(moodPalette.primary[0]?.slice(1, 3) || 'FF', 16)}, ${parseInt(moodPalette.primary[0]?.slice(3, 5) || 'FF', 16)}, ${parseInt(moodPalette.primary[0]?.slice(5, 7) || 'FF', 16)}, 0.2)`]
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
                  ? `rgba(${parseInt(moodPalette.accent[0]?.slice(1, 3) || 'FF', 16)}, ${parseInt(moodPalette.accent[0]?.slice(3, 5) || 'FF', 16)}, ${parseInt(moodPalette.accent[0]?.slice(5, 7) || 'FF', 16)}, 0.08)`
                  : `rgba(${parseInt(moodPalette.accent[0]?.slice(1, 3) || 'FF', 16)}, ${parseInt(moodPalette.accent[0]?.slice(3, 5) || 'B6', 16)}, ${parseInt(moodPalette.accent[0]?.slice(5, 7) || 'C1', 16)}, 0.20)`,
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
              color={theme.isDark ? moodPalette.accent[0] : moodPalette.sparkle} 
            />
          </TouchableOpacity>
      </View>
    </View>
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