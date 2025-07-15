import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { ChatContainer, GlassOverlay, SpiritualGradientBackground } from '../../components/chat';
import useCoachStore from '../../store/innervoice/useCoachStore';
import useConversationStore from '../../store/innervoice/useConversationStore';
import useSubscriptionStore from '../../store/innervoice/useSubscriptionStore';
import useLibraryStore from '../../store/innervoice/useLibraryStore';
import { useTheme } from '../../contexts/ThemeContext';

export default function ChatScreen() {
  const navigation = useNavigation<RootStackScreenProps<'ChatScreen'>['navigation']>();
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
          style={{ paddingTop: insets.top + 80 }}
        />
        </GlassOverlay>
        
        {/* Glass Morphism Floating Buttons */}
        <TouchableOpacity
          style={[
            styles.floatingButton, 
            styles.libraryButton, 
            { 
              top: insets.top + 20,
              backgroundColor: theme.isDark ? 'rgba(46, 89, 132, 0.25)' : 'rgba(255, 218, 185, 0.15)',
              shadowColor: theme.isDark ? '#2E5984' : '#FFB6C1',
              borderColor: theme.isDark ? 'rgba(74, 123, 167, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            }
          ]}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Library' })}
          activeOpacity={0.8}
        >
          <Ionicons name="book-outline" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.floatingButton, 
            styles.profileButton, 
            { 
              top: insets.top + 20,
              backgroundColor: theme.isDark ? 'rgba(46, 89, 132, 0.25)' : 'rgba(255, 182, 193, 0.15)',
              shadowColor: theme.isDark ? '#2E5984' : '#FFB6C1',
              borderColor: theme.isDark ? 'rgba(74, 123, 167, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            }
          ]}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
          activeOpacity={0.8}
        >
          <Ionicons name="person-circle-outline" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
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
    borderRadius: 8, // Vierkante frames
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Glass morphism effect
    borderWidth: 1,
  },
  libraryButton: {
    left: 20,
  },
  profileButton: {
    right: 20,
  },
});