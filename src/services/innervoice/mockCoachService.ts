// Mock coach responses voor POC
export const MOCK_COACH_RESPONSES = {
  gentle: [
    'Wat een mooie vraag om mee te beginnen... Wat roept deze gedachte bij je op?',
    'Ik hoor wat je zegt. Waar voel je dit het sterkst in je lichaam?',
    'Die gevoelens mogen er zijn. Wat zou je tegen een goede vriend zeggen die dit voelde?',
    'Interessant dat je dit deelt... Wanneer ben je dit gevoel voor het eerst tegengekomen?',
    'Er zit wijsheid in wat je zegt. Wat vertelt deze ervaring je over jezelf?',
  ],
  wise: [
    'Deze vraag raakt aan iets diepers, voel ik. Waar in je lichaam ervaar je deze onzekerheid?',
    'Wat je beschrijft ken ik uit oude wijsheidstradities. Wat betekent dit voor jouw pad?',
    'Er schuilt een les in deze ervaring. Welke groei zie je hierin voor jezelf?',
    'De antwoorden die je zoekt liggen vaak al in je. Wat fluistert je intuïtie je toe?',
    'Dit moment van twijfel kan een poort zijn. Waartoe nodigt het je uit?',
  ],
  earthly: [
    'Laten we dit concreet maken. Wanneer voelde je dit voor het laatst heel sterk?',
    'Praktisch gezien, wat zou een eerste kleine stap kunnen zijn?',
    'Wat heb je nodig om je meer geaard te voelen in deze situatie?',
    'Als je lichaam kon praten, wat zou het je nu vertellen?',
    'Welke concrete actie zou je vandaag nog kunnen nemen?',
  ],
};

// Mock mood detection
export const detectMood = (message: string): 'positive' | 'negative' | 'neutral' | 'question' => {
  const lowerMessage = message.toLowerCase();

  // Positive indicators
  if (
    lowerMessage.includes('blij') ||
    lowerMessage.includes('fijn') ||
    lowerMessage.includes('dankbaar') ||
    lowerMessage.includes('😊')
  ) {
    return 'positive';
  }

  // Negative indicators
  if (
    lowerMessage.includes('verdrietig') ||
    lowerMessage.includes('boos') ||
    lowerMessage.includes('moeilijk') ||
    lowerMessage.includes('😢')
  ) {
    return 'negative';
  }

  // Question indicators
  if (
    lowerMessage.includes('?') ||
    lowerMessage.includes('hoe') ||
    lowerMessage.includes('wat') ||
    lowerMessage.includes('waarom')
  ) {
    return 'question';
  }

  return 'neutral';
};

// Get appropriate response based on context
export const getMockCoachResponse = (
  message: string,
  coachType: 'gentle' | 'wise' | 'earthly' = 'gentle'
): string => {
  const mood = detectMood(message);
  const responses = MOCK_COACH_RESPONSES[coachType];

  // Voor demo: selecteer response based on mood en een beetje randomness
  let index = 0;
  switch (mood) {
    case 'positive':
      index = 2; // Bevestigende response
      break;
    case 'negative':
      index = 0; // Zachte, uitnodigende response
      break;
    case 'question':
      index = 3; // Reflectieve response
      break;
    default:
      index = Math.floor(Math.random() * responses.length);
  }

  return responses[index] || responses[0];
};

// Mock conversation starters
export const CONVERSATION_STARTERS = [
  'Hoe voel je je vandaag?',
  'Ik voel me een beetje onrustig...',
  'Waarom blijf ik dezelfde patronen herhalen?',
  'Ik ben dankbaar voor deze dag',
  'Kan je me helpen met zelfreflectie?',
];
