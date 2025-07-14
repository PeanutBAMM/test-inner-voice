# InnerVoice Energy Sphere Design

## Overzicht

De Energy Sphere is het spirituele hart van InnerVoice - een levende, ademende energiebol die de connectie tussen gebruiker en innerlijke coach visualiseert. Het ontwerp combineert zachte pastel tinten (#FCD8CD - peachy/roze) met mystieke animaties die vertrouwen, geborgenheid en spirituele energie uitstralen.

## Ontwerpprincipes

### 1. "Thuiskomen in Jezelf"
- **Zachte kleuren**: Peachy/roze tint (#FCD8CD) als basis
- **Natuurlijke bewegingen**: Organische breathing patterns
- **Warme uitstraling**: Subtiele glows en aura's

### 2. Levende Energie
- **Multi-layered design**: 3-4 transparante lagen die onafhankelijk bewegen
- **Breathing animation**: Natuurlijke in- en uitademing met variatie
- **Particle system**: Mystieke lichtdeeltjes die spirituele energie suggereren

### 3. Message Synchronisatie
- **User typing**: Sphere wordt alerter, snellere pulse
- **Message sent**: Energy burst met ripple effect
- **Coach responding**: Expansieve golven met warm glow

## Technische Implementatie

### Component Structuur

```
EnergySphere (Main wrapper)
├── SphereRipple (Message sync effects)
├── MysticParticles (Spirituele particles)
└── MoodSphere (Core sphere)
    ├── Outer glow layer
    ├── Main sphere layer
    ├── Particle overlay
    └── Inner core
```

### Mood States

1. **idle**: Rustige breathing, minimale particles
2. **listening**: Alert, brightness up, actieve particles
3. **thinking**: Spiraal rotatie, energy wisps
4. **responding**: Expansieve golven, maximale glow
5. **welcoming**: Open gesture animatie

### Animatie Details

#### Breathing Pattern
- **Rust**: 4.5 seconden cyclus
- **Luisteren**: 3 seconden cyclus
- **Variatie**: ±400ms random voor natuurlijk effect
- **Easing**: Bezier curves voor organisch gevoel

#### Particle System
- **Stardust particles**: 10-15 zwevende lichtpuntjes
- **Energy wisps**: 4 roterende energie slierten
- **Sacred geometry**: Subtiele geometrische hints bij thinking

#### Color Variations
```javascript
idle:       ['#FCD8CD', '#FFE4DB', '#FFEAE3'] // Peachy rust
listening:  ['#FFD6CC', '#FFE0D6', '#FFEAE3'] // Warmer, alerter
thinking:   ['#F5C9B8', '#FCD8CD', '#FFE4DB'] // Dieper
responding: ['#FFE4DB', '#FFF0E9', '#FFF8F3'] // Lichter, expansief
welcoming:  ['#FCD8CD', '#FFD6CC', '#FFE4DB'] // Open, uitnodigend
```

## Performance Optimalisaties

1. **Native Driver**: Alle animaties gebruiken `useNativeDriver: true`
2. **Limited Particles**: Maximum 15 particles voor smooth 60fps
3. **Memoized Components**: Particle componenten zijn gememoized
4. **Batched Animations**: Parallelle animaties waar mogelijk

## Gebruik in ChatScreen

```javascript
import { EnergySphere } from '../../components/chat';

// In render:
<EnergySphere 
  baseColor={coachPersonality.sphereColor || '#FCD8CD'}
  intensity={0.7}
/>
```

## Toekomstige Verbeteringen

1. **Emotie Detectie**: Kleur/intensiteit aanpassen op basis van sentiment
2. **Touch Interactions**: Reageren op gebruiker touch met ripples
3. **Seasonal Themes**: Seizoensgebonden particle effecten
4. **Sound Integration**: Audio feedback synchroniseren met animaties
5. **Accessibility**: Reduced motion alternatieven

## Design Rationale

De sphere ontwerp keuzes zijn gebaseerd op:

- **Vertrouwen**: Zachte, voorspelbare bewegingen
- **Mystiek**: Subtiele particles en energy wisps
- **Natuurlijkheid**: Organische breathing met variatie
- **Responsiviteit**: Directe visuele feedback op interacties
- **Spiritualiteit**: Sacred geometry hints zonder opdringerig te zijn

Het resultaat is een levende entiteit die de essentie van een innerlijke coach perfect visualiseert - altijd aanwezig, rustgevend, en klaar om te luisteren.