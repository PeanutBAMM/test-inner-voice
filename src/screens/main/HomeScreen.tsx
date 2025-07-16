import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { ChatContainer, GlassOverlay } from '../../components/chat';
import { UniversalBackground } from '../../components/backgrounds/UniversalBackground';
import useCoachStore from '../../store/innervoice/useCoachStore';
import useConversationStore from '../../store/innervoice/useConversationStore';
import useSubscriptionStore from '../../store/innervoice/useSubscriptionStore';
import { theme } from '../../constants/theme';

export default function ChatScreen() {
  const navigation = useNavigation<RootStackScreenProps<'MainTabs'>['navigation']>();
  const insets = useSafeAreaInsets();
  const { getCoachResponse } = useCoachStore();
  const { messages, addMessage, isTyping, setTyping } = useConversationStore();
  const { canAskQuestion, recordQuestion } = useSubscriptionStore();

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
      id: Date.now().toString(),
      text,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    recordQuestion();

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
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'assistant' as const,
      timestamp: new Date(),
    };
    addMessage(coachMessage);

  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <UniversalBackground
        variant="spiritual"
        mood="peaceful"
        timeOfDay="afternoon"
        enableEffects={true}
      >
        <GlassOverlay intensity={25}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'Library' })}
            style={styles.headerButton}
          >
            <Ionicons name="book-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>InnerVoice</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
            style={styles.headerButton}
          >
            <Ionicons name="person-circle-outline" size={28} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ChatContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          placeholder='Deel je gedachten...'
        />
        </GlassOverlay>
      </UniversalBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
});