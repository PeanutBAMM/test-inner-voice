import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import Svg, { 
  Circle, 
  Defs, 
  RadialGradient, 
  Stop, 
  G,
  Path,
  LinearGradient,
  Rect,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

// Animated Star component om hooks probleem op te lossen
const AnimatedStar = ({ star, opacityValue }: { star: any; opacityValue: Animated.SharedValue<number> }) => {
  const animatedProps = useAnimatedProps(() => ({
    opacity: star.opacity * opacityValue.value,
  }));
  
  return (
    <AnimatedCircle
      cx={star.x}
      cy={star.y}
      r={star.r}
      fill="#FFFFFF"
      animatedProps={animatedProps}
    />
  );
};

interface EnergyCoreProps {
  intensity?: number;
  mood?: 'peaceful' | 'contemplative' | 'joyful' | 'grounded' | 'neutral';
  onPulse?: boolean;
}

export const EnergyCore: React.FC<EnergyCoreProps> = ({
  intensity = 0.7,
  mood = 'peaceful',
  onPulse = false,
}) => {
  // Animation values
  const breathingAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const glowIntensity = useSharedValue(intensity);
  const energyDischarge = useSharedValue(0);
  

  // Color palettes - Vrouwelijke energie kleuren (goud-roze-paars)
  const moodColors = {
    peaceful: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '10%', color: '#FFF8E7', opacity: 0.95 }, // Warm wit
        { offset: '20%', color: '#FFE4B5', opacity: 0.9 },  // Zacht goud
        { offset: '30%', color: '#FFD700', opacity: 0.85 }, // Goud
        { offset: '40%', color: '#FFDAB9', opacity: 0.8 },  // Perzik
        { offset: '50%', color: '#FFCCCB', opacity: 0.75 }, // Licht coral
        { offset: '60%', color: '#FFB6C1', opacity: 0.7 },  // Licht roze
        { offset: '70%', color: '#FFA07A', opacity: 0.65 }, // Licht zalm
        { offset: '80%', color: '#FF8C69', opacity: 0.7 },  // Warm zalm
        { offset: '90%', color: '#F08080', opacity: 0.75 }, // Licht coral
        { offset: '100%', color: '#E6A8A8', opacity: 0.8 }, // Zacht roze
      ],
      glow: '#FFB6C1',
      ring: '#FFA07A',
      lightning: '#FFE4B5',
    },
    contemplative: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '15%', color: '#FAF0E6', opacity: 0.95 }, // Linnen wit
        { offset: '25%', color: '#F5E6D3', opacity: 0.9 },  // Warm beige
        { offset: '35%', color: '#F0E68C', opacity: 0.85 }, // Khaki
        { offset: '45%', color: '#DDD6B4', opacity: 0.8 },  // Champagne
        { offset: '55%', color: '#E6C2A6', opacity: 0.75 }, // Warm peach
        { offset: '65%', color: '#DDBEA9', opacity: 0.7 },  // Zacht coral
        { offset: '75%', color: '#D2B48C', opacity: 0.75 }, // Tan
        { offset: '85%', color: '#C8A888', opacity: 0.8 },  // Zacht bruin
        { offset: '95%', color: '#E6C2A6', opacity: 0.85 }, // Warm peach
        { offset: '100%', color: '#DDD6B4', opacity: 0.9 }, // Champagne
      ],
      glow: '#E6C2A6',
      ring: '#D2B48C',
      lightning: '#F5E6D3',
    },
    joyful: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '10%', color: '#FFFACD', opacity: 0.95 }, // Citroen chiffon
        { offset: '20%', color: '#FFE4B5', opacity: 0.9 },  // Moccasin
        { offset: '30%', color: '#FFD700', opacity: 0.85 }, // Helder goud
        { offset: '40%', color: '#FFDAB9', opacity: 0.8 },  // Perzik
        { offset: '50%', color: '#FFA07A', opacity: 0.75 }, // Licht zalm
        { offset: '60%', color: '#FF8C69', opacity: 0.7 },  // Zalm
        { offset: '70%', color: '#FF7F50', opacity: 0.75 }, // Coral
        { offset: '80%', color: '#FF6347', opacity: 0.8 },  // Tomato
        { offset: '90%', color: '#FF4500', opacity: 0.85 }, // Orange red
        { offset: '100%', color: '#E6A8A8', opacity: 0.9 }, // Zacht roze
      ],
      glow: '#FFA07A',
      ring: '#FF7F50',
      lightning: '#FFE4B5',
    },
    grounded: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '15%', color: '#FFF5EE', opacity: 0.95 }, // Zeeschelp
        { offset: '25%', color: '#FAEBD7', opacity: 0.9 },  // Antiek wit
        { offset: '35%', color: '#F5DEB3', opacity: 0.85 }, // Tarwe
        { offset: '45%', color: '#DEB887', opacity: 0.8 },  // Burly wood
        { offset: '55%', color: '#D2B48C', opacity: 0.75 }, // Tan
        { offset: '65%', color: '#C8A888', opacity: 0.7 },  // Zacht bruin
        { offset: '75%', color: '#D4A76A', opacity: 0.75 }, // Fawn
        { offset: '85%', color: '#E6C2A6', opacity: 0.8 },  // Warm peach
        { offset: '95%', color: '#DDBEA9', opacity: 0.85 }, // Zacht coral
        { offset: '100%', color: '#E6A8A8', opacity: 0.9 }, // Zacht roze-bruin
      ],
      glow: '#E6C2A6',
      ring: '#D2B48C',
      lightning: '#F5DEB3',
    },
    neutral: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '15%', color: '#FFF8F0', opacity: 0.95 }, // Floral white  
        { offset: '25%', color: '#FAF0E6', opacity: 0.9 },  // Linnen
        { offset: '35%', color: '#F5E6D3', opacity: 0.85 }, // Warm beige
        { offset: '45%', color: '#E6D7C3', opacity: 0.8 },  // Bone
        { offset: '55%', color: '#DDD6B4', opacity: 0.75 }, // Champagne
        { offset: '65%', color: '#E6C2A6', opacity: 0.7 },  // Warm peach
        { offset: '75%', color: '#DDBEA9', opacity: 0.75 }, // Zacht coral
        { offset: '85%', color: '#E6A8A8', opacity: 0.8 },  // Zacht roze
        { offset: '95%', color: '#D4A4A4', opacity: 0.85 }, // Neutraal roze
        { offset: '100%', color: '#C8A888', opacity: 0.9 }, // Zacht taupe-roze
      ],
      glow: '#E6C2A6',
      ring: '#DDBEA9',
      lightning: '#F5E6D3',
    },
  };

  const colors = moodColors[mood];

  // Setup animations
  useEffect(() => {
    // Breathing animation
    breathingAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );


    // Energy discharge effect (Tesla coil style)
    energyDischarge.value = withRepeat(
      withSequence(
        withDelay(4000, withTiming(1, { duration: 100, easing: Easing.out(Easing.ease) })),
        withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );

  }, [breathingAnim, energyDischarge]);

  // Handle pulse animation
  useEffect(() => {
    if (onPulse) {
      pulseAnim.value = withSequence(
        withTiming(1.2, { duration: 300, easing: Easing.out(Easing.ease) }),
        withTiming(0.95, { duration: 200, easing: Easing.in(Easing.ease) }),
        withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
      );
    }
  }, [onPulse, pulseAnim]);

  // Update glow intensity
  useEffect(() => {
    glowIntensity.value = withTiming(intensity, { duration: 1000 });
  }, [intensity, glowIntensity]);

  // Animated style for the whole sphere
  const sphereStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      breathingAnim.value,
      [0, 1],
      [0.95, 1.05]
    );

    return {
      transform: [
        { scale: scale * pulseAnim.value },
      ],
    };
  });



  // Plasma texture pulse animation - global for all circles
  const plasmaTextureOpacity = useSharedValue(0.3);
  
  // Swirl rotation animation
  const swirlRotation = useSharedValue(0);

  // Setup plasma texture animation
  useEffect(() => {
    plasmaTextureOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000 }),
        withTiming(0.2, { duration: 2000 })
      ),
      -1,
      true
    );
    
    // Slow swirl rotation
    swirlRotation.value = withRepeat(
      withTiming(360, { duration: 120000, easing: Easing.linear }),
      -1,
      false
    );
  }, [plasmaTextureOpacity, swirlRotation]);


  // Generate realistic lightning paths from core
  const generateLightningPath = (angle: number, startRadius: number, endRadius: number): string => {
    const centerX = 150; // New center for 300x300 viewBox
    const centerY = 150;
    const startX = centerX + Math.cos(angle) * startRadius;
    const startY = centerY + Math.sin(angle) * startRadius;
    const endX = centerX + Math.cos(angle) * endRadius;
    const endY = centerY + Math.sin(angle) * endRadius;
    
    let path = `M${startX},${startY}`;
    let currentX = startX;
    let currentY = startY;
    const steps = 10 + Math.floor(Math.random() * 10); // 10-20 steps voor natuurlijkere bliksem
    
    for (let i = 0; i < steps; i++) {
      const progress = (i + 1) / steps;
      const targetX = startX + (endX - startX) * progress;
      const targetY = startY + (endY - startY) * progress;
      
      // Add randomness for zigzag effect - meer variatie
      const offset = 25 - (progress * 15); // Groter aan begin, kleiner aan eind
      currentX = targetX + (Math.random() - 0.5) * offset;
      currentY = targetY + (Math.random() - 0.5) * offset;
      
      path += ` L${currentX},${currentY}`;
    }
    
    return path;
  };

  // Generate micro lightning paths (zeer dunne details)
  const microLightningPaths = [];
  const numMicroPaths = 100;
  
  for (let i = 0; i < numMicroPaths; i++) {
    const angle = Math.random() * Math.PI * 2;
    const startR = 10 + Math.random() * 30;
    const endR = startR + 20 + Math.random() * 40;
    microLightningPaths.push({
      path: generateLightningPath(angle, startR, Math.min(endR, 95)),
      opacity: 0.1 + Math.random() * 0.2,
      width: 0.1 + Math.random() * 0.1,
    });
  }

  // Generate plasma web connections - reduced for performance
  const generatePlasmaWeb = () => {
    const web = [];
    const numPoints = 20; // Reduced from 50 for better performance
    const points = [];
    
    // Generate random points within sphere
    for (let i = 0; i < numPoints; i++) {
      const r = Math.random() * 90 + 11;
      const theta = Math.random() * Math.PI * 2;
      points.push({
        x: 150 + r * Math.cos(theta),
        y: 150 + r * Math.sin(theta),
      });
    }
    
    // Connect nearby points - limit connections
    let connectionCount = 0;
    const maxConnections = 15; // Limit total connections
    
    for (let i = 0; i < points.length && connectionCount < maxConnections; i++) {
      for (let j = i + 1; j < points.length && connectionCount < maxConnections; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only connect points that are relatively close
        if (distance < 60 && distance > 10) {
          // Create curved connection path
          const midX = (points[i].x + points[j].x) / 2 + (Math.random() - 0.5) * 10;
          const midY = (points[i].y + points[j].y) / 2 + (Math.random() - 0.5) * 10;
          
          web.push({
            path: `M${points[i].x},${points[i].y} Q${midX},${midY} ${points[j].x},${points[j].y}`,
            opacity: 0.1 + Math.random() * 0.2,
            width: 0.3 + Math.random() * 0.5,
          });
          connectionCount++;
        }
      }
    }
    
    return web;
  };
  
  const plasmaWeb = generatePlasmaWeb();
  
  // Generate swirl/smoke patterns
  const generateSwirlPaths = () => {
    const swirls = [];
    const numSwirls = 3;
    
    for (let i = 0; i < numSwirls; i++) {
      const startAngle = (i / numSwirls) * Math.PI * 2;
      const spiralPath = [];
      
      // Create spiral from center outward
      for (let j = 0; j <= 50; j++) {
        const t = j / 50;
        const angle = startAngle + t * Math.PI * 4; // 2 full rotations
        const radius = 10 + t * 90; // From 10 to 100
        const x = 150 + Math.cos(angle) * radius;
        const y = 150 + Math.sin(angle) * radius;
        
        if (j === 0) {
          spiralPath.push(`M${x},${y}`);
        } else {
          // Add curve for smoother path
          const prevT = (j - 1) / 50;
          const prevAngle = startAngle + prevT * Math.PI * 4;
          const prevRadius = 10 + prevT * 90;
          const prevX = 150 + Math.cos(prevAngle) * prevRadius;
          const prevY = 150 + Math.sin(prevAngle) * prevRadius;
          
          const cpX = (prevX + x) / 2;
          const cpY = (prevY + y) / 2;
          
          spiralPath.push(`Q${cpX},${cpY} ${x},${y}`);
        }
      }
      
      swirls.push({
        path: spiralPath.join(' '),
        opacity: 0.1 + i * 0.05,
        strokeWidth: 2 - i * 0.3,
      });
    }
    
    return swirls;
  };
  
  const swirlPaths = generateSwirlPaths();

  // Generate starfield particles
  const generateStarfield = () => {
    const stars = [];
    const numStars = 150; // Gereduceerd voor betere performance
    
    for (let i = 0; i < numStars; i++) {
      const r = Math.random() * 100 + 5; // Random radius within sphere
      const theta = Math.random() * Math.PI * 2;
      const opacity = 0.1 + Math.random() * 0.5;
      const size = 0.3 + Math.random() * 1.5;
      
      // Twinkle animation parameters
      const twinkleDelay = Math.random() * 3000;
      const twinkleDuration = 1000 + Math.random() * 2000;
      
      stars.push({
        x: 150 + r * Math.cos(theta),
        y: 150 + r * Math.sin(theta),
        r: size,
        opacity: opacity,
        twinkleDelay: twinkleDelay,
        twinkleDuration: twinkleDuration,
      });
    }
    
    return stars;
  };
  
  const starfield = generateStarfield();
  
  // Star twinkle animations - maak 500 shared values
  const starOpacity1 = useSharedValue(1);
  const starOpacity2 = useSharedValue(1);
  const starOpacity3 = useSharedValue(1);
  const starOpacity4 = useSharedValue(1);
  const starOpacity5 = useSharedValue(1);
  
  // Voor simplicity gebruik ik maar 3 animated stars, de rest static
  const animatedStarIndices = [0, 50, 100];
  const starOpacities = [starOpacity1, starOpacity2, starOpacity3];
  
  // Setup twinkle animations voor de 5 animated stars
  useEffect(() => {
    animatedStarIndices.forEach((starIndex, i) => {
      const star = starfield[starIndex];
      if (star) {
        starOpacities[i].value = withDelay(
          star.twinkleDelay,
          withRepeat(
            withSequence(
              withTiming(0.3, { duration: star.twinkleDuration / 2 }),
              withTiming(1, { duration: star.twinkleDuration / 2 })
            ),
            -1,
            false
          )
        );
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Main plasma sphere */}
      <AnimatedSvg
        width={300}
        height={300}
        viewBox="0 0 300 300"
        style={[styles.sphere, sphereStyle]}
        pointerEvents="none"
      >
        <Defs>
          {/* Kern blur gradient - vrouwelijke energie kleuren */}
          <RadialGradient id="kernBlur" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="5%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="10%" stopColor="#FFF8E7" stopOpacity="0.9" />
            <Stop offset="20%" stopColor="#FFE4B5" stopOpacity="0.7" />
            <Stop offset="30%" stopColor="#FFD700" stopOpacity="0.5" />
            <Stop offset="40%" stopColor="#FFDAB9" stopOpacity="0.4" />
            <Stop offset="50%" stopColor="#FFA07A" stopOpacity="0.3" />
            <Stop offset="70%" stopColor="#FF8C69" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#E6A8A8" stopOpacity="0" />
          </RadialGradient>
          
          {/* 3D Inner glow gradient voor diepte */}
          <RadialGradient id="innerGlow3D" cx="40%" cy="40%" r="60%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <Stop offset="30%" stopColor="#FFF8E7" stopOpacity="0.5" />
            <Stop offset="60%" stopColor="#FFD700" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
          
          {/* Corona blur gradient - warme vrouwelijke energie kleuren */}
          <RadialGradient id="coronaBlur" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="70%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="80%" stopColor="#FFA07A" stopOpacity="0.4" />
            <Stop offset="85%" stopColor="#FF8C69" stopOpacity="0.7" />
            <Stop offset="90%" stopColor="#FF7F50" stopOpacity="0.9" />
            <Stop offset="95%" stopColor="#F08080" stopOpacity="1" />
            <Stop offset="100%" stopColor="#E6A8A8" stopOpacity="0.5" />
          </RadialGradient>
          
          {/* Extra glow gradients voor intense outer ring */}
          <RadialGradient id="outerGlow1" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="85%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="92%" stopColor="#FFB6C1" stopOpacity="0.6" />
            <Stop offset="96%" stopColor="#FFA07A" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#FF8C69" stopOpacity="0.4" />
          </RadialGradient>
          
          <RadialGradient id="outerGlow2" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="88%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="94%" stopColor="#FFE4B5" stopOpacity="0.7" />
            <Stop offset="97%" stopColor="#FFDAB9" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#FFCCCB" stopOpacity="0.2" />
          </RadialGradient>
          
          <RadialGradient id="outerGlow3" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="82%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="90%" stopColor="#FFB6C1" stopOpacity="0.5" />
            <Stop offset="95%" stopColor="#FFA07A" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#FF8C69" stopOpacity="0.3" />
          </RadialGradient>
        </Defs>

        {/* Simplified volumetric glow - 1 subtle circle */}
        <Circle cx={150} cy={150} r={145} fill={colors.glow} opacity={0.02} />

        {/* 3D Depth Shells - vrouwelijke energy kleuren */}
        {/* Outer shell - zeer transparant */}
        <Circle
          cx={150}
          cy={150}
          r={108}
          fill="#E6C2A6"
          opacity={0.05}
        />
        
        {/* Second shell */}
        <Circle
          cx={150}
          cy={150}
          r={106}
          fill="#DDBEA9"
          opacity={0.08}
        />
        
        {/* Third shell */}
        <Circle
          cx={150}
          cy={150}
          r={104}
          fill="#D4A76A"
          opacity={0.12}
        />
        
        {/* Fourth shell */}
        <Circle
          cx={150}
          cy={150}
          r={102}
          fill="#C8A888"
          opacity={0.18}
        />
        
        {/* Inner shell - base sphere */}
        <Circle
          cx={150}
          cy={150}
          r={100}
          fill="#E6C2A6"
          opacity={0.3}
        />

        {/* Starfield particles - sterrenstelsel effect */}
        <G opacity={0.8}>
          {starfield.map((star, index) => {
            const animatedIndex = animatedStarIndices.indexOf(index);
            if (animatedIndex !== -1) {
              // Animated star
              return (
                <AnimatedStar
                  key={`star-${index}`}
                  star={star}
                  opacityValue={starOpacities[animatedIndex]}
                />
              );
            } else {
              // Static star
              return (
                <Circle
                  key={`star-${index}`}
                  cx={star.x}
                  cy={star.y}
                  r={star.r}
                  fill="#FFFFFF"
                  opacity={star.opacity}
                />
              );
            }
          })}
        </G>

        {/* Plasma web structure */}
        <G opacity={0.4}>
          {plasmaWeb.map((connection, index) => (
            <Path
              key={`web-${index}`}
              d={connection.path}
              stroke="#FFE4B5"
              strokeWidth={connection.width}
              fill="none"
              opacity={connection.opacity}
            />
          ))}
        </G>
        
        {/* Swirl/smoke patterns - animated rotation */}
        <AnimatedG 
          animatedProps={useAnimatedProps(() => ({
            opacity: 0.3,
            transform: [{ rotate: `${swirlRotation.value}deg` }]
          }))}
          originX={150}
          originY={150}
        >
          {swirlPaths.map((swirl, index) => (
            <Path
              key={`swirl-${index}`}
              d={swirl.path}
              stroke={colors.glow}
              strokeWidth={swirl.strokeWidth}
              fill="none"
              opacity={swirl.opacity}
              strokeLinecap="round"
            />
          ))}
        </AnimatedG>

        {/* Micro lightning layer - zeer fijne details */}
        <G opacity={0.6}>
          {microLightningPaths.map((lightning, index) => (
            <Path
              key={`micro-lightning-${index}`}
              d={lightning.path}
              stroke={colors.lightning}
              strokeWidth={lightning.width}
              fill="none"
              opacity={lightning.opacity}
              strokeLinecap="round"
            />
          ))}
        </G>

        {/* Mistige wolkachtige kern structuur - organisch verspreid */}
        <G opacity={0.6}>
          {/* Organisch verspreide plasma wolken - vrouwelijke energy kleuren */}
          <Circle cx={130} cy={135} r={34} fill="#FFD700" opacity={0.15} />
          <Circle cx={170} cy={140} r={30} fill="#FFDAB9" opacity={0.12} />
          <Circle cx={145} cy={170} r={29} fill="#FFB6C1" opacity={0.18} />
          <Circle cx={160} cy={130} r={32} fill="#FFA07A" opacity={0.1} />
          <Circle cx={140} cy={160} r={26} fill="#FF8C69" opacity={0.2} />
          <Circle cx={165} cy={155} r={24} fill="#FFCCCB" opacity={0.15} />
          <Circle cx={125} cy={150} r={27} fill="#FFE4B5" opacity={0.12} />
          <Circle cx={150} cy={125} r={23} fill="#FFC0CB" opacity={0.18} />
          <Circle cx={145} cy={175} r={26} fill="#FF7F50" opacity={0.13} />
          <Circle cx={155} cy={145} r={21} fill="#FFA07A" opacity={0.2} />
          {/* Extra wolken voor meer body */}
          <Circle cx={120} cy={170} r={30} fill="#FFD700" opacity={0.1} />
          <Circle cx={180} cy={160} r={26} fill="#FFB6C1" opacity={0.12} />
          <Circle cx={135} cy={120} r={29} fill="#FFDAB9" opacity={0.15} />
          {/* Nog meer plasma wolken voor volume */}
          <Circle cx={110} cy={145} r={32} fill="#FFA07A" opacity={0.08} />
          <Circle cx={190} cy={135} r={27} fill="#FFCCCB" opacity={0.11} />
          <Circle cx={150} cy={190} r={25} fill="#FF8C69" opacity={0.14} />
          <Circle cx={175} cy={115} r={29} fill="#FFE4B5" opacity={0.09} />
          <Circle cx={125} cy={185} r={28} fill="#FFA07A" opacity={0.13} />
          <Circle cx={165} cy={175} r={26} fill="#FFB6C1" opacity={0.1} />
        </G>

        {/* Kern met blur effect - 1 circle met gradient */}
        <Circle cx={150} cy={150} r={50} fill="url(#kernBlur)" />
        
        {/* 3D highlight op kern */}
        <Circle cx={140} cy={140} r={35} fill="url(#innerGlow3D)" opacity={0.6} />
        
        {/* Helder centrum punt */}
        <Circle cx={150} cy={150} r={3} fill="#FFFFFF" opacity={1} />

        {/* Energy discharge ring */}
        <AnimatedCircle
          cx={150}
          cy={150}
          r={108}
          stroke={colors.ring}
          fill="none"
          animatedProps={useAnimatedProps(() => ({
            opacity: energyDischarge.value,
            strokeWidth: interpolate(
              energyDischarge.value,
              [0, 1],
              [2, 5]
            ),
          }))}
        />

        {/* Corona met intense glow/blur - meerdere overlappende circles */}
        <G>
          {/* Simplified corona effect - fewer layers for performance */}
          <Circle cx={150} cy={150} r={110} fill="url(#coronaBlur)" opacity={0.4} />
          <Circle cx={150} cy={150} r={108} fill="url(#coronaBlur)" opacity={0.6} />
          
          {/* Single glow layer */}
          <Circle cx={150} cy={150} r={105} fill="url(#outerGlow1)" opacity={0.5} />
          
          {/* Clean edge highlight */}
          <Circle cx={150} cy={150} r={105} stroke={colors.ring} strokeWidth={2} fill="none" opacity={0.7} />
          <Circle cx={150} cy={150} r={103} stroke="#FFFFFF" strokeWidth={0.5} fill="none" opacity={0.3} />
        </G>
      </AnimatedSvg>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 150,
    top: SCREEN_HEIGHT * 0.3, // Gebruik top ipv bottom voor stabiele positie
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'flex-start',
    pointerEvents: 'none', // Laat touch events door naar input fields
  },
  sphere: {
    zIndex: 2,
  },
});