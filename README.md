# TestInnerVoiceTemplateFixed - InnerVoice Spiritual Diary

Built with InnerVoice App Generator 🧘

## 🌟 InnerVoice Features

**Mood Sphere**: Adaptive color sphere that breathes with your emotions  
**Voice Conversations**: Talk to your spiritual coach using natural speech  
**Privacy First**: All conversations stored locally with biometric protection  
**Coach Personalities**: Choose from Gentle Guide, Wise Mentor, or Grounded Helper  
**Conversation Library**: Save and revisit meaningful insights

## Quick Start

```bash
# Start on Android emulator
./scripts/start-android.sh

# Start with phone support (tunnel mode)
./scripts/start-android.sh -t

# Clean start (clear cache)
./scripts/clean-start.sh

# Start on iOS (macOS only)
./scripts/start-ios.sh
```

## InnerVoice Architecture

```
src/
├── screens/innervoice/    # InnerVoice specific screens
│   ├── OnboardingChatScreen.tsx
│   ├── ChatScreen.tsx     # Main chat interface
│   ├── LibraryScreen.tsx  # Conversation library
│   └── ProfileScreen.tsx
├── components/
│   ├── chat/              # Chat UI components
│   ├── sphere/            # MoodSphere components
│   └── backgrounds/       # Glass overlay effects
├── store/innervoice/      # InnerVoice state management
└── services/innervoice/   # AI coach services
```

## Voice Features

- **Voice Input**: Record your thoughts naturally
- **AI Responses**: GPT-powered spiritual coaching
- **Voice Output**: Coach speaks back to you (Premium)
- **Mood Detection**: Sphere adapts to emotional tone

## Privacy & Security

- **Biometric Lock**: Face ID/Touch ID protection
- **Local Storage**: Conversations never leave your device
- **Optional Backup**: Encrypted cloud backup (user choice)
- **No Tracking**: Zero analytics or data collection

## Customization

1. **Coach Personality**: Choose in onboarding or settings
2. **Sphere Colors**: Adaptive or custom mood colors
3. **Voice Settings**: Adjust speech speed and voice
4. **Theme**: Light, dark, or system theme

## Development

```bash
# Run type checking
npm run type-check

# Lint code
npm run lint

# Generate new component
./scripts/generate-component.sh MySphereComponent
```

---

**"Thuiskomen in jezelf"** - Coming home to yourself ❤️
