// Mock library data voor POC
export const MOCK_LIBRARY_ITEMS = [
  {
    id: '1',
    text: 'Die twijfel... hoe lang wandelt die al met je mee?',
    conversationId: 'conv1',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dagen geleden
    category: 'Zelfreflectie',
    note: 'Een belangrijke vraag die me deed nadenken over mijn patronen',
  },
  {
    id: '2',
    text: 'Wat vertelt deze ervaring je over jezelf?',
    conversationId: 'conv2',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dagen geleden
    category: 'Inzichten',
    note: 'Ik realiseerde me dat ik vaak te hard voor mezelf ben',
  },
  {
    id: '3',
    text: 'Er schuilt een les in deze ervaring. Welke groei zie je hierin voor jezelf?',
    conversationId: 'conv3',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Gisteren
    category: 'Groei',
    note: 'Over het accepteren van imperfectie',
  },
  {
    id: '4',
    text: 'Als je lichaam kon praten, wat zou het je nu vertellen?',
    conversationId: 'conv4',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dagen geleden
    category: 'Lichaam & Geest',
    note: 'Meer rust nemen, minder haast',
  },
  {
    id: '5',
    text: 'Die gevoelens mogen er zijn. Wat zou je tegen een goede vriend zeggen die dit voelde?',
    conversationId: 'conv5',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dagen geleden
    category: 'Zelfcompassie',
    note: 'Een reminder om vriendelijker voor mezelf te zijn',
  },
];

// Mock conversation history
export const MOCK_CONVERSATIONS = [
  {
    id: 'conv1',
    messages: [
      {
        id: 'm1',
        text: 'Ik twijfel constant aan mezelf',
        sender: 'user' as const,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'm2',
        text: 'Die twijfel... hoe lang wandelt die al met je mee?',
        sender: 'assistant' as const,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'm3',
        text: 'Al jaren eigenlijk, sinds mijn studie',
        sender: 'user' as const,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'm4',
        text: 'Wat gebeurde er in die tijd dat de twijfel een plek kreeg?',
        sender: 'assistant' as const,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastMessageAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

// Mock user stats
export const MOCK_USER_STATS = {
  totalConversations: 23,
  totalQuestions: 89,
  daysActive: 14,
  currentStreak: 7,
  favoriteTime: 'Avond',
  mostDiscussedTopics: ['Zelfvertrouwen', 'Relaties', 'Werk-privé balans'],
};
