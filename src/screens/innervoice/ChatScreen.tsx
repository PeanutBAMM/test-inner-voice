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
import { ChatContainer } from '../../components/chat';
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
    <UniversalBackground 
      variant="spiritual"
      mood="peaceful"
      timeOfDay="afternoon"
      enableEffects={true}
    >
      <View style={[styles.container, { 
        paddingTop: insets.top,
        paddingBottom: TAB_BAR_HEIGHT + insets.bottom 
      }]}>
        {/* Chat UI on top */}
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
          keyboardVerticalOffset={0}
        />
        
        {/* Floating Profile Button */}
        <TouchableOpacity
          style={[styles.floatingButton, { top: insets.top + 20, right: 20 }]}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={
              theme.isDark
                ? [moodPalette.primary[5] || '#1A2332', moodPalette.primary[4] || '#2A3342']
                : [moodPalette.primary[0] || '#FFF5F8', moodPalette.primary[1] || '#FFE5EA']
            }
            style={styles.gradientBackground}
          >
            <Ionicons 
              name="person-circle-outline" 
              size={22} 
              color={theme.isDark ? moodPalette.accent[0] : moodPalette.sparkle} 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </UniversalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 14,
    zIndex: 10,
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
  gradientBackground: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});