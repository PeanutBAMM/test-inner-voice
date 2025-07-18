import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ChatContainer } from '../../components/chat';
import { UniversalBackground } from '../../components/backgrounds/UniversalBackground';
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
    id: '5',
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
    id: '6',
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
    id: '7',
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
    id: '8',
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
    id: '9',
    coach: 'Is er iets specifieks waar je de komende tijd aandacht aan wilt geven?',
    inputType: 'text',
    storeAs: 'currentFocus',
    optional: true,
  },
];

export default function OnboardingChatScreen() {
  const _navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>({});
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { loadUserProfile: saveUserProfile } = useUserStore();
  const { addMessage: _addToConversationStore, setTyping: _setTyping } = useConversationStore();

  // Optimized: only store locally during onboarding
  const addMessage = (message: any) => {
    setMessages((prev) => [...prev, message]);
    // Skip conversation store during onboarding for performance
  };

  useEffect(() => {
    // Add first question - optimized
    const firstQ = ONBOARDING_QUESTIONS[0];
    const firstMessage = {
      id: '1',
      text: firstQ.coach,
      sender: 'assistant',
      timestamp: new Date(),
    };
    setMessages([firstMessage]);
    // Skip conversation store for performance during onboarding
  }, []);

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
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: Array.isArray(answer) ? answer.join(', ') : answer,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);

    // Store answer
    const newProfile = { ...userProfile, [question.storeAs]: answer };
    setUserProfile(newProfile);

    // Move to next question or complete
    if (currentQuestion < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);

      // Add next question with optimized delay
      setIsTransitioning(true);
      setTimeout(() => {
        const nextQ = ONBOARDING_QUESTIONS[currentQuestion + 1];
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: interpolateUserData(nextQ.coach, newProfile),
            sender: 'assistant',
            timestamp: new Date(),
          },
        ]);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Complete onboarding
      await completeOnboarding(newProfile);
    }
  };

  const completeOnboarding = async (profile: Record<string, string | string[]>) => {
    // Convert profile to UserProfile type
    const userProfile = {
      userName: (profile.userName as string) || '',
      preferredLanguage: (profile.preferredLanguage === 'English' ? 'English' : 'Nederlands') as
        | 'Nederlands'
        | 'English',
      primaryIntention: (profile.primaryIntention as string) || '',
      emotionalStyle: (profile.emotionalStyle as string) || '',
      spiritualExperience: profile.spiritualExperience as string,
      currentFocus: profile.currentFocus as string,
      allowNotifications:
        profile.notificationPreference !== 'Nee, ik kom wel als ik er behoefte aan heb',
      biometricEnabled: false,
      notificationPreference:
        (profile.notificationPreference as string) || 'Af en toe, niet te vaak',
    };

    // Save profile
    saveUserProfile(userProfile);
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));

    // Final message
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: `Dank je voor het delen, ${profile.userName}. Ik ben hier wanneer je me nodig hebt. Dit is jouw veilige ruimte om thuis te komen in jezelf.`,
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }, 300);

    // Trigger app reload to show MainTabs after delay
    setTimeout(() => {
      // Instead of navigation.reset, we'll trigger the parent navigator to re-evaluate
      // by updating AsyncStorage which triggers RootNavigator's useEffect
      AsyncStorage.setItem('triggerReload', Date.now().toString());
    }, 3000);
  };

  const skipOnboarding = async () => {
    console.log('Skip button pressed');
    try {
      // Default profile voor skip
      const defaultProfile = {
        userName: 'Gebruiker',
        preferredLanguage: 'Nederlands' as 'Nederlands' | 'English',
        primaryIntention: 'Ik zoek meer innerlijke rust',
        emotionalStyle: 'Wisselend, afhankelijk van de dag',
        spiritualExperience: 'Weinig, maar sta er voor open',
        currentFocus: '',
        allowNotifications: true,
        biometricEnabled: false,
        notificationPreference: 'Af en toe, niet te vaak',
      };

      // Save met useUserStore
      saveUserProfile(defaultProfile);
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      await AsyncStorage.setItem('userProfile', JSON.stringify(defaultProfile));

      // Trigger reload voor navigatie
      await AsyncStorage.setItem('triggerReload', Date.now().toString());
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      const nextQ = ONBOARDING_QUESTIONS[currentQuestion + 1];
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: interpolateUserData(nextQ.coach, userProfile),
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Remove last two messages (user answer + assistant question)
      setMessages((prev) => prev.slice(0, -2));
    }
  };

  const skipCurrentQuestion = () => {
    if (ONBOARDING_QUESTIONS[currentQuestion].optional) {
      processAnswer('');
    } else {
      goToNextQuestion();
    }
  };

  const currentQ = ONBOARDING_QUESTIONS[currentQuestion];

  // Components verwijderd - nu direct in render

  return (
    <UniversalBackground
      variant="transparent"
      mood="peaceful"
      timeOfDay="afternoon"
      enableEffects={false} // Disabled for better performance
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ChatContainer
          messages={messages}
          onSendMessage={handleTextSubmit}
          inputComponent={
            isTransitioning
              ? () => (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>...</Text>
                  </View>
                )
              : currentQ.inputType === 'choice'
                ? () => (
                    <ChoiceInput
                      choices={currentQ.choices!}
                      onSelect={handleChoiceSelect}
                      onPrevious={goToPreviousQuestion}
                      onSkip={skipCurrentQuestion}
                      canGoPrevious={currentQuestion > 0}
                      currentQuestion={currentQuestion}
                      totalQuestions={ONBOARDING_QUESTIONS.length}
                    />
                  )
                : currentQ.inputType === 'multiChoice'
                  ? () => (
                      <MultiChoiceInput
                        choices={currentQ.choices!}
                        selected={selectedChoices}
                        onToggle={(choice) => {
                          setSelectedChoices((prev) =>
                            prev.includes(choice)
                              ? prev.filter((c) => c !== choice)
                              : [...prev, choice]
                          );
                        }}
                        onSubmit={handleMultiChoiceSubmit}
                        onPrevious={goToPreviousQuestion}
                        onSkip={skipCurrentQuestion}
                        canGoPrevious={currentQuestion > 0}
                        currentQuestion={currentQuestion}
                        totalQuestions={ONBOARDING_QUESTIONS.length}
                      />
                    )
                  : undefined
          }
          placeholder={currentQ.optional ? 'Dit mag je overslaan...' : 'Type je antwoord...'}
          bottomPadding={0}
          keyboardVerticalOffset={60}
        />

        {/* Progress Bar */}
        <View style={[styles.progressContainer, { top: insets.top + 16 }]}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentQuestion + 1) / ONBOARDING_QUESTIONS.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Skip Button */}
        <TouchableOpacity
          onPress={skipOnboarding}
          style={[styles.skipButton, { top: insets.top + 16 }]}
        >
          <Text style={styles.skipText}>Overslaan</Text>
        </TouchableOpacity>
      </View>
    </UniversalBackground>
  );
}

// Choice Input Component
const ChoiceInput: React.FC<{
  choices: string[];
  onSelect: (choice: string) => void;
  onPrevious: () => void;
  onSkip: () => void;
  canGoPrevious: boolean;
  currentQuestion: number;
  totalQuestions: number;
}> = ({
  choices,
  onSelect,
  onPrevious,
  onSkip,
  canGoPrevious,
  currentQuestion,
  totalQuestions,
}) => {
  const showScrollIndicator = choices.length > 4;

  return (
    <View style={styles.choiceWrapper}>
      <ScrollView
        style={styles.choiceContainer}
        showsVerticalScrollIndicator={showScrollIndicator}
        contentContainerStyle={styles.choiceContentContainer}
      >
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
      {showScrollIndicator && (
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.9)']}
          style={styles.fadeBottom}
          pointerEvents="none"
        />
      )}

      {/* Navigation buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navIconButton, !canGoPrevious && styles.navIconButtonDisabled]}
          onPress={onPrevious}
          disabled={!canGoPrevious}
        >
          <Ionicons name="arrow-back" size={24} color={canGoPrevious ? '#8B7BA7' : '#C5B8E3'} />
        </TouchableOpacity>

        <Text style={styles.questionCounter}>
          {currentQuestion + 1} / {totalQuestions}
        </Text>

        <TouchableOpacity style={styles.navIconButton} onPress={onSkip}>
          <Ionicons name="arrow-forward" size={24} color="#8B7BA7" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Multi Choice Input Component
const MultiChoiceInput: React.FC<{
  choices: string[];
  selected: string[];
  onToggle: (choice: string) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  canGoPrevious: boolean;
  currentQuestion: number;
  totalQuestions: number;
}> = ({
  choices,
  selected,
  onToggle,
  onSubmit,
  onPrevious,
  onSkip,
  canGoPrevious,
  currentQuestion,
  totalQuestions,
}) => {
  const showScrollIndicator = choices.length > 5;

  return (
    <View style={styles.multiChoiceWrapper}>
      <View style={styles.multiChoiceContainer}>
        <ScrollView
          showsVerticalScrollIndicator={showScrollIndicator}
          contentContainerStyle={styles.multiChoiceContentContainer}
        >
          {choices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.multiChoiceButton,
                selected.includes(choice) && styles.multiChoiceButtonSelected,
              ]}
              onPress={() => onToggle(choice)}
            >
              <Text
                style={[styles.choiceText, selected.includes(choice) && styles.choiceTextSelected]}
              >
                {choice}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {showScrollIndicator && (
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.9)']}
            style={styles.fadeBottom}
            pointerEvents="none"
          />
        )}
      </View>

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.submitButton, selected.length === 0 && styles.submitButtonDisabled]}
        onPress={onSubmit}
        disabled={selected.length === 0}
      >
        <Text style={styles.submitButtonText}>Verder</Text>
      </TouchableOpacity>

      {/* Navigation buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navIconButton, !canGoPrevious && styles.navIconButtonDisabled]}
          onPress={onPrevious}
          disabled={!canGoPrevious}
        >
          <Ionicons name="arrow-back" size={24} color={canGoPrevious ? '#8B7BA7' : '#C5B8E3'} />
        </TouchableOpacity>

        <Text style={styles.questionCounter}>
          {currentQuestion + 1} / {totalQuestions}
        </Text>

        <TouchableOpacity style={styles.navIconButton} onPress={onSkip}>
          <Ionicons name="arrow-forward" size={24} color="#8B7BA7" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
  progressContainer: {
    position: 'absolute',
    left: 24,
    right: 80,
    paddingVertical: 8,
  },
  progressBar: {
    height: 3,
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
    maxHeight: 350,
    minHeight: 200,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  choiceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 253, 0.3)',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  choiceText: {
    fontSize: 15,
    color: '#4A4458',
    textAlign: 'center',
    lineHeight: 20,
  },
  multiChoiceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 400,
    minHeight: 250,
  },
  multiChoiceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 253, 0.3)',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButton: {
    position: 'absolute',
    right: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    zIndex: 10,
  },
  skipText: {
    color: '#8B7BA7',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#8B7BA7',
    fontWeight: '500',
  },
  choiceWrapper: {
    position: 'relative',
  },
  choiceContentContainer: {
    paddingBottom: 8,
  },
  multiChoiceWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  multiChoiceContentContainer: {
    paddingBottom: 8,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  navIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 167, 0.3)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navIconButtonDisabled: {
    opacity: 0.5,
    elevation: 0,
  },
  questionCounter: {
    fontSize: 14,
    color: '#8B7BA7',
    fontWeight: '500',
  },
});
