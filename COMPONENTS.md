# InnerVoice Component Library

## 🧘 Spiritual Interface Components

### MoodSphere

- **MoodSphere.tsx**: Main breathing sphere with adaptive colors
- **SphereBackground.tsx**: Gradient background that responds to mood
- **RippleEffect.tsx**: Touch ripples on sphere interaction

### Chat Components

- **MessageBubble.tsx**: Glass morphism chat bubbles
- **ChatInput.tsx**: Voice-enabled text input
- **VoiceInput.tsx**: Record voice messages
- **GlassOverlay.tsx**: Semi-transparent overlay effect

### Onboarding

- **OnboardingInput.tsx**: Gentle question prompts
- **ChoiceButtons.tsx**: Coach personality selection
- **ProgressIndicator.tsx**: Onboarding progress

### Library

- **InsightCard.tsx**: Saved conversation highlights
- **LibrarySearch.tsx**: Search through conversations
- **CategoryFilter.tsx**: Filter by mood or topic

## 🎨 Design System

### Colors

- **Gentle Guide**: Lavender mist (#E8DFFD)
- **Wise Mentor**: Deep indigo (#D7E6FF)
- **Grounded Helper**: Warm terracotta (#FFE6D7)

### Animations

- **Breathing**: Gentle scale and opacity changes
- **Ripples**: Touch feedback on sphere
- **Glass Effects**: Blur and transparency

### Voice Integration

- **expo-speech**: Text-to-speech for coach responses
- **expo-av**: Audio recording for voice input
- **Voice Waveform**: Visual feedback during recording

## Usage Examples

```tsx
import { MoodSphere, MessageBubble, VoiceInput } from '@/components';

<MoodSphere
  mood="peaceful"
  isBreathing={true}
  onTouch={() => console.log('Sphere touched')}
/>

<MessageBubble
  message="How are you feeling today?"
  isCoach={true}
  coachType="gentle"
/>

<VoiceInput
  onRecordingComplete={(audio) => processVoice(audio)}
  onTranscript={(text) => handleText(text)}
/>
```
