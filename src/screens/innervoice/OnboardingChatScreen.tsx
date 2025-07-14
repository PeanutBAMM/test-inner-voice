import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatContainer, GlassOverlay, SpiritualGradientBackground } from '../../components/chat';
import useCoachStore, { type CoachPersonality } from '../../store/innervoice/useCoachStore';
import useUserStore from '../../store/innervoice/useUserStore';
import useConversationStore from '../../store/innervoice/useConversationStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingQuestion {
  id: string;
  coach: string;
  inputType: 'text' | 'choice' | 'multiChoice';
  choices?: string[];
  storeAs: string;
  optional?: boolean;
}

const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: '1',
    coach: 'Welkom... Ik ben hier om met je mee te wandelen. Hoe mag ik je noemen?',
    inputType: 'text',
    storeAs: 'userName',
  },
  {
    id: '2',
    coach: 'Mooi om je te ontmoeten, {userName}. Wat brengt je naar deze rustige plek?',
    inputType: 'choice',
    choices: [
      'Ik zoek meer innerlijke rust',
      'Ik wil mezelf beter leren kennen',
      'Ik heb behoefte aan een luisterend oor',
      'Ik ben nieuwsgierig naar spirituele groei',
    ],
    storeAs: 'primaryIntention',
  },
  {
    id: '3',
    coach: 'In welke taal voel je je het meest thuis als we samen praten?',
    inputType: 'choice',
    choices: ['Nederlands', 'English', 'Beide is prima'],
    storeAs: 'preferredLanguage',
  },
  {
    id: '4',
    coach: 'Er zijn verschillende manieren waarop ik naast je kan staan. Welke spreekt je aan?',
    inputType: 'choice',
    choices: [
      'Zachte Begeleider - Extra zacht en ruimte gevend',
      'Wijze Mentor - Diepgaande vragen en filosofisch',
      'Aardse Helper - Praktisch en in het hier-en-nu',
    ],
    storeAs: 'coachPersonality',
  },
  {
    id: '5',
    coach: 'Hoe ervaar je meestal je emoties?',
    inputType: 'choice',
    choices: [
      'Intens en overweldigend',
      'Subtiel en soms moeilijk te plaatsen',
      'Helder maar soms lastig te uiten',
      'Wisselend, afhankelijk van de dag',
    ],
    storeAs: 'emotionalStyle',
  },
  {
    id: '6',
    coach: 'Wanneer voel je je het meest jezelf?',
    inputType: 'multiChoice',
    choices: [
      'In de natuur',
      'In stilte en alleen',
      'Met dierbaren om me heen',
      'Tijdens creatieve bezigheden',
      'In beweging of sport',
      'In spirituele praktijk',
    ],
    storeAs: 'selfConnectionMoments',
  },
  {
    id: '7',
    coach: 'Heb je ervaring met meditatieve of spirituele praktijken?',
    inputType: 'choice',
    choices: [
      'Ja, regelmatig',
      'Af en toe',
      'Weinig, maar sta er voor open',
      'Nee, en dat hoeft ook niet',
    ],
    storeAs: 'spiritualExperience',
  },
  {
    id: '8',
    coach: 'Op welk moment van de dag zou je graag even met me praten?',
    inputType: 'choice',
    choices: [
      'Ochtend - om de dag te beginnen',
      'Middag - als reflectie pauze',
      'Avond - om de dag af te sluiten',
      'Wisselend wanneer ik behoefte voel',
    ],
    storeAs: 'preferredTimeOfDay',
  },
  {
    id: '9',
    coach: 'Wil je dat ik je soms herinner aan ons moment samen?',
    inputType: 'choice',
    choices: [
      'Ja, dagelijks een zachte herinnering',
      'Af en toe, niet te vaak',
      'Nee, ik kom wel als ik er behoefte aan heb',
    ],
    storeAs: 'notificationPreference',
  },
  {
    id: '10',
    coach: 'Is er iets specifieks waar je de komende tijd aandacht aan wilt geven?',
    inputType: 'text',
    storeAs: 'currentFocus',
    optional: true,
  },
];

export default function OnboardingChatScreen() {
  const _navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>({});
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const { setCoachPersonality } = useCoachStore();
  const { loadUserProfile: saveUserProfile } = useUserStore();
  const { addMessage: _addToConversationStore, setTyping: _setTyping } = useConversationStore();

  // Helper to add messages to both local state and conversation store
  const addMessage = (message: any) => {
    setMessages(prev => [...prev, message]);
    // Also add to conversation store
    _addToConversationStore({
      id: message.id,
      text: message.text,
      sender: message.sender as 'user' | 'assistant',
      timestamp: message.timestamp,
    });
  };

  useEffect(() => {
    // Add first question
    const firstQ = ONBOARDING_QUESTIONS[0];
    const firstMessage = {
      id: '1',
      text: firstQ.coach,
      sender: 'assistant',
      timestamp: new Date(),
    };
    setMessages([firstMessage]);
    _addToConversationStore({
      id: firstMessage.id,
      text: firstMessage.text,
      sender: firstMessage.sender as 'assistant',
      timestamp: firstMessage.timestamp,
    });
  }, [_addToConversationStore]);

  const interpolateUserData = (text: string, data: Record<string, string>) => {
    return text.replace(/{(\w+)}/g, (match, key) => data[key] || match);
  };

  const handleTextSubmit = (text: string) => {
    if (!text.trim() && !ONBOARDING_QUESTIONS[currentQuestion].optional) {
      return;
    }

    processAnswer(text);
  };

  const handleChoiceSelect = (choice: string) => {
    processAnswer(choice);
  };

  const handleMultiChoiceSubmit = () => {
    processAnswer(selectedChoices);
    setSelectedChoices([]);
  };

  const processAnswer = async (answer: string | string[]) => {
    const question = ONBOARDING_QUESTIONS[currentQuestion];
    
    // Add user message
    setMessages(prev => [...prev, {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: Array.isArray(answer) ? answer.join(', ') : answer,
      sender: 'user',
      timestamp: new Date(),
    }]);

    // Store answer
    const newProfile = { ...userProfile, [question.storeAs]: answer };
    setUserProfile(newProfile);

    // Special handling for coach personality selection
    if (question.storeAs === 'coachPersonality') {
      const personalityMap: Record<string, Partial<CoachPersonality>> = {
        "Zachte Begeleider - Extra zacht en ruimte gevend": {
          type: 'gentle' as const,
          name: 'Zachte Begeleider',
          temperature: 0.6,
          traits: 'Extra zacht, veel ruimte gevend',
        },
        "Wijze Mentor - Diepgaande vragen en filosofisch": {
          type: 'wise' as const,
          name: 'Wijze Mentor',
          temperature: 0.7,
          traits: 'Diepgaand, filosofisch',
        },
        "Aardse Helper - Praktisch en in het hier-en-nu": {
          type: 'earthly' as const,
          name: 'Aardse Helper',
          temperature: 0.8,
          traits: 'Praktisch, hier-en-nu',
        },
      };
      const selectedPersonality = typeof answer === 'string' ? personalityMap[answer] : undefined;
      if (selectedPersonality) {
        setCoachPersonality(selectedPersonality);
      }
    }

    // Move to next question or complete
    if (currentQuestion < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      
      // Add next question with delay
      setTimeout(() => {
        const nextQ = ONBOARDING_QUESTIONS[currentQuestion + 1];
        setMessages(prev => [...prev, {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: interpolateUserData(nextQ.coach, newProfile),
          sender: 'assistant',
          timestamp: new Date(),
        }]);
      }, 800);
    } else {
      // Complete onboarding
      await completeOnboarding(newProfile);
    }
  };

  const completeOnboarding = async (profile: Record<string, string | string[]>) => {
    // Convert profile to UserProfile type
    const userProfile = {
      userName: profile.userName as string || '',
      preferredLanguage: (profile.preferredLanguage === 'English' ? 'English' : 'Nederlands') as 'Nederlands' | 'English',
      primaryIntention: profile.primaryIntention as string || '',
      emotionalStyle: profile.emotionalStyle as string || '',
      spiritualExperience: profile.spiritualExperience as string,
      currentFocus: profile.currentFocus as string,
      coachPersonality: (profile.coachPersonality as 'gentle' | 'wise' | 'earthly') || 'gentle',
      allowNotifications: profile.notificationPreference !== 'Nee, ik kom wel als ik er behoefte aan heb',
      biometricEnabled: false,
      notificationPreference: profile.notificationPreference as string || 'Af en toe, niet te vaak',
    };
    
    // Save profile
    saveUserProfile(userProfile);
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));

    // Final message
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: `Dank je voor het delen, ${profile.userName}. Ik ben hier wanneer je me nodig hebt. Dit is jouw veilige ruimte om thuis te komen in jezelf.`,
        sender: 'assistant',
        timestamp: new Date(),
      }]);
    }, 800);

    // Trigger app reload to show MainTabs after delay
    setTimeout(() => {
      // Instead of navigation.reset, we'll trigger the parent navigator to re-evaluate
      // by updating AsyncStorage which triggers RootNavigator's useEffect
      AsyncStorage.setItem('triggerReload', Date.now().toString());
    }, 3000);
  };

  const skipOnboarding = async () => {
    // Set default values for skipped onboarding
    const defaultProfile = {
      userName: 'Gebruiker',
      preferences: {
        language: 'nl',
        notifications: true,
        voiceEnabled: false,
      },
    };
    
    // Save profile and mark onboarding as completed
    await AsyncStorage.setItem('userProfile', JSON.stringify(defaultProfile));
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    await AsyncStorage.setItem('triggerReload', Date.now().toString());
  };

  const currentQ = ONBOARDING_QUESTIONS[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      {/* Spiritual gradient background */}
      <SpiritualGradientBackground 
        mood="peaceful"
        timeOfDay="morning" // Onboarding is like a new dawn
        enableOrganicShapes={true}
      >
        <GlassOverlay intensity={8}>
        
        {/* Skip button */}
        <TouchableOpacity 
          onPress={skipOnboarding} 
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Overslaan</Text>
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestion + 1) / ONBOARDING_QUESTIONS.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <ChatContainer
          messages={messages}
          onSendMessage={handleTextSubmit}
          inputComponent={
            currentQ.inputType === 'choice' ? 
              () => <ChoiceInput choices={currentQ.choices!} onSelect={handleChoiceSelect} /> :
            currentQ.inputType === 'multiChoice' ?
              () => <MultiChoiceInput 
                choices={currentQ.choices!} 
                selected={selectedChoices}
                onToggle={(choice) => {
                  setSelectedChoices(prev =>
                    prev.includes(choice) 
                      ? prev.filter(c => c !== choice)
                      : [...prev, choice]
                  );
                }}
                onSubmit={handleMultiChoiceSubmit}
              /> :
              undefined
          }
          placeholder={currentQ.optional ? 'Dit mag je overslaan...' : 'Type je antwoord...'}
        />
      </GlassOverlay>
      </SpiritualGradientBackground>
    </SafeAreaView>
  );
}

// Choice Input Component
const ChoiceInput: React.FC<{ choices: string[], onSelect: (choice: string) => void }> = ({ choices, onSelect }) => (
  <ScrollView style={styles.choiceContainer} showsVerticalScrollIndicator={false}>
    {choices.map((choice, index) => (
      <TouchableOpacity
        key={index}
        style={styles.choiceButton}
        onPress={() => onSelect(choice)}
      >
        <Text style={styles.choiceText}>{choice}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

// Multi Choice Input Component
const MultiChoiceInput: React.FC<{
  choices: string[],
  selected: string[],
  onToggle: (choice: string) => void,
  onSubmit: () => void
}> = ({ choices, selected, onToggle, onSubmit }) => (
  <View style={styles.multiChoiceContainer}>
    <ScrollView showsVerticalScrollIndicator={false}>
      {choices.map((choice, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.multiChoiceButton,
            selected.includes(choice) && styles.multiChoiceButtonSelected
          ]}
          onPress={() => onToggle(choice)}
        >
          <Text style={[
            styles.choiceText,
            selected.includes(choice) && styles.choiceTextSelected
          ]}>{choice}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    <TouchableOpacity
      style={[styles.submitButton, selected.length === 0 && styles.submitButtonDisabled]}
      onPress={onSubmit}
      disabled={selected.length === 0}
    >
      <Text style={styles.submitButtonText}>Verder</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(232, 223, 253, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C3B5E3',
    borderRadius: 2,
  },
  choiceContainer: {
    maxHeight: 250,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  choiceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 253, 0.3)',
  },
  choiceText: {
    fontSize: 16,
    color: '#4A4458',
    textAlign: 'center',
  },
  multiChoiceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 300,
  },
  multiChoiceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 253, 0.3)',
  },
  multiChoiceButtonSelected: {
    backgroundColor: '#E8DFFD',
    borderColor: '#C3B5E3',
  },
  choiceTextSelected: {
    color: '#8B7BA7',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#C3B5E3',
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#8B7BA7',
    fontSize: 16,
    fontWeight: '500',
  },
});