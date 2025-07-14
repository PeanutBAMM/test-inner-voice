import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { ChatContainer, GlassOverlay, SpiritualGradientBackground } from '../../components/chat';
import useCoachStore from '../../store/innervoice/useCoachStore';
import useConversationStore from '../../store/innervoice/useConversationStore';
import useSubscriptionStore from '../../store/innervoice/useSubscriptionStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ChatScreen() {
  const navigation = useNavigation<RootStackScreenProps<'ChatScreen'>['navigation']>();
  const { getCoachResponse, coachPersonality } = useCoachStore();
  const { messages, addMessage, isTyping, setTyping } = useConversationStore();
  const { canAskQuestion, recordQuestion } = useSubscriptionStore();
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Spiritual gradient background */}
      <SpiritualGradientBackground 
        mood="peaceful"
        timeOfDay="afternoon"
        enableOrganicShapes={true}
        onMessageSent={messageSent}
      >
        {/* Chat UI on top */}
        <GlassOverlay intensity={8}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('LibraryScreen')}
            style={styles.headerButton}
          >
            <Ionicons name="book-outline" size={24} color="#8B7BA7" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{coachPersonality.name}</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
            style={styles.headerButton}
          >
            <Ionicons name="person-circle-outline" size={28} color="#8B7BA7" />
          </TouchableOpacity>
        </View>

        <ChatContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          placeholder='Deel je gedachten...'
        />
        </GlassOverlay>
      </SpiritualGradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 223, 253, 0.2)',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4458',
  },
});