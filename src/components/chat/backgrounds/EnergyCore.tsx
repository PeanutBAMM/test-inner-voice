import React, { useEffect, useMemo } from 'react';
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
  
  
  // Lightning animation
  const mainRotation = useSharedValue(0);
  const secondaryRotation = useSharedValue(0);

  // Color palettes - Vrouwelijke energy kleuren (warm goud-perzik-koraal)
  const moodColors = {
    peaceful: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '15%', color: '#FFF8DC', opacity: 0.95 },
        { offset: '25%', color: '#FFE4B5', opacity: 0.9 },
        { offset: '35%', color: '#FFDAB9', opacity: 0.85 },
        { offset: '45%', color: '#FFD700', opacity: 0.8 },
        { offset: '55%', color: '#FFA07A', opacity: 0.75 },
        { offset: '65%', color: '#FFB6C1', opacity: 0.7 },
        { offset: '75%', color: '#FF7F50', opacity: 0.75 },
        { offset: '85%', color: '#FF6347', opacity: 0.8 },
        { offset: '95%', color: '#FA8072', opacity: 0.85 },
        { offset: '100%', color: '#E9967A', opacity: 0.9 },
      ],
      glow: '#FFB6C1',
      ring: '#FFDAB9',
      lightning: '#FFE4B5',
    },
    contemplative: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '15%', color: '#FFFAF0', opacity: 0.95 },
        { offset: '30%', color: '#FAF0E6', opacity: 0.9 },
        { offset: '45%', color: '#FFDAB9', opacity: 0.85 },
        { offset: '60%', color: '#FFB6C1', opacity: 0.8 },
        { offset: '75%', color: '#FFA07A', opacity: 0.75 },
        { offset: '90%', color: '#FF7F50', opacity: 0.85 },
        { offset: '100%', color: '#FF6347', opacity: 1 },
      ],
      glow: '#FFB6C1',
      ring: '#FFA07A',
      lightning: '#FFDAB9',
    },
    joyful: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '15%', color: '#FFF8DC', opacity: 0.95 },
        { offset: '30%', color: '#FFD700', opacity: 0.9 },
        { offset: '45%', color: '#FFB6C1', opacity: 0.85 },
        { offset: '60%', color: '#FFA07A', opacity: 0.8 },
        { offset: '75%', color: '#FF7F50', opacity: 0.8 },
        { offset: '90%', color: '#FF6347', opacity: 0.85 },
        { offset: '100%', color: '#FA8072', opacity: 1 },
      ],
      glow: '#FFB6C1',
      ring: '#FF7F50',
      lightning: '#FFD700',
    },
    grounded: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '20%', color: '#FAF0E6', opacity: 0.95 },
        { offset: '40%', color: '#F0E68C', opacity: 0.9 },
        { offset: '60%', color: '#DEB887', opacity: 0.85 },
        { offset: '80%', color: '#D2B48C', opacity: 0.8 },
        { offset: '100%', color: '#BC8F8F', opacity: 1 },
      ],
      glow: '#DEB887',
      ring: '#D2B48C',
      lightning: '#F0E68C',
    },
    neutral: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '25%', color: '#FFF5EE', opacity: 0.95 },
        { offset: '50%', color: '#FFE4E1', opacity: 0.9 },
        { offset: '75%', color: '#FFDAB9', opacity: 0.85 },
        { offset: '100%', color: '#FFB6C1', opacity: 1 },
      ],
      glow: '#FFDAB9',
      ring: '#FFB6C1',
      lightning: '#FFE4E1',
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

    // Main lightning rotation - slow
    mainRotation.value = withRepeat(
      withTiming(360, { duration: 75000, easing: Easing.linear }),
      -1,
      false
    );

    // Secondary lightning rotation - faster, opposite direction
    secondaryRotation.value = withRepeat(
      withTiming(-360, { duration: 50000, easing: Easing.linear }),
      -1,
      false
    );
  }, [breathingAnim, energyDischarge, mainRotation, secondaryRotation]);

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

  // Animated style for outer glow
  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      glowIntensity.value,
      [0, 1],
      [0.3, 0.8]
    );

    const dischargeOpacity = interpolate(
      energyDischarge.value,
      [0, 1],
      [opacity, 1]
    );

    return {
      shadowOpacity: dischargeOpacity,
      shadowRadius: interpolate(energyDischarge.value, [0, 1], [80, 120]),
    };
  });


  // Plasma texture pulse animation - global for all circles
  const plasmaTextureOpacity = useSharedValue(0.3);

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
  }, [plasmaTextureOpacity]);


  // Generate realistic lightning paths from core
  const generateLightningPath = (angle: number, startRadius: number, endRadius: number): string => {
    const centerX = 93.75; // New center for 187.5x187.5 viewBox
    const centerY = 93.75;
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

  // Main and secondary lightning paths removed for performance
  
  // Generate micro lightning paths (zeer dunne details)
  const microLightningPaths = [];
  const numMicroPaths = 100;
  
  for (let i = 0; i < numMicroPaths; i++) {
    const angle = Math.random() * Math.PI * 2;
    const startR = 6.25 + Math.random() * 18.75;
    const endR = startR + 12.5 + Math.random() * 25;
    microLightningPaths.push({
      path: generateLightningPath(angle, startR, Math.min(endR, 59.375)),
      opacity: 0.1 + Math.random() * 0.2,
      width: 0.1 + Math.random() * 0.1,
    });
  }

  // Generate plasma web connections
  const generatePlasmaWeb = () => {
    const web = [];
    const numPoints = 50; // Increased for more connections
    const points = [];
    
    // Generate random points within sphere
    for (let i = 0; i < numPoints; i++) {
      const r = Math.random() * 56.25 + 6.875; // Random radius (25% larger)
      const theta = Math.random() * Math.PI * 2;
      points.push({
        x: 93.75 + r * Math.cos(theta),
        y: 93.75 + r * Math.sin(theta),
      });
    }
    
    // Connect nearby points
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only connect points that are relatively close
        if (distance < 37.5 && distance > 6.25) { // Adjusted for 25% larger sphere
          // Create curved connection path
          const midX = (points[i].x + points[j].x) / 2 + (Math.random() - 0.5) * 10;
          const midY = (points[i].y + points[j].y) / 2 + (Math.random() - 0.5) * 10;
          
          web.push({
            path: `M${points[i].x},${points[i].y} Q${midX},${midY} ${points[j].x},${points[j].y}`,
            opacity: 0.1 + Math.random() * 0.2,
            width: 0.3 + Math.random() * 0.5,
          });
        }
      }
    }
    
    return web;
  };
  
  const plasmaWeb = generatePlasmaWeb();

  // Generate starfield particles
  const generateStarfield = () => {
    const stars = [];
    const numStars = 150; // Gereduceerd voor performance
    
    for (let i = 0; i < numStars; i++) {
      const r = Math.random() * 62.5 + 3.125; // Random radius within sphere (25% larger)
      const theta = Math.random() * Math.PI * 2;
      const opacity = 0.1 + Math.random() * 0.5;
      const size = 0.1875 + Math.random() * 0.9375;
      
      // Twinkle animation parameters
      const twinkleDelay = Math.random() * 3000;
      const twinkleDuration = 1000 + Math.random() * 2000;
      
      stars.push({
        x: 93.75 + r * Math.cos(theta),
        y: 93.75 + r * Math.sin(theta),
        r: size,
        opacity: opacity,
        twinkleDelay: twinkleDelay,
        twinkleDuration: twinkleDuration,
      });
    }
    
    return stars;
  };
  
  const starfield = generateStarfield();
  
  // Star twinkle animations - 25 animated stars
  // Create shared values outside of array mapping to follow React Hooks rules
  const starOpacity0 = useSharedValue(1);
  const starOpacity1 = useSharedValue(1);
  const starOpacity2 = useSharedValue(1);
  const starOpacity3 = useSharedValue(1);
  const starOpacity4 = useSharedValue(1);
  const starOpacity5 = useSharedValue(1);
  const starOpacity6 = useSharedValue(1);
  const starOpacity7 = useSharedValue(1);
  const starOpacity8 = useSharedValue(1);
  const starOpacity9 = useSharedValue(1);
  const starOpacity10 = useSharedValue(1);
  const starOpacity11 = useSharedValue(1);
  const starOpacity12 = useSharedValue(1);
  const starOpacity13 = useSharedValue(1);
  const starOpacity14 = useSharedValue(1);
  const starOpacity15 = useSharedValue(1);
  const starOpacity16 = useSharedValue(1);
  const starOpacity17 = useSharedValue(1);
  const starOpacity18 = useSharedValue(1);
  const starOpacity19 = useSharedValue(1);
  const starOpacity20 = useSharedValue(1);
  const starOpacity21 = useSharedValue(1);
  const starOpacity22 = useSharedValue(1);
  const starOpacity23 = useSharedValue(1);
  const starOpacity24 = useSharedValue(1);
  
  const starOpacities = [
    starOpacity0, starOpacity1, starOpacity2, starOpacity3, starOpacity4,
    starOpacity5, starOpacity6, starOpacity7, starOpacity8, starOpacity9,
    starOpacity10, starOpacity11, starOpacity12, starOpacity13, starOpacity14,
    starOpacity15, starOpacity16, starOpacity17, starOpacity18, starOpacity19,
    starOpacity20, starOpacity21, starOpacity22, starOpacity23, starOpacity24
  ];
  
  // Select 25 random star indices to animate
  const animatedStarIndices = Array.from({ length: 25 }, (_, i) => Math.floor(i * 150 / 25));
  
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
    <View style={styles.container} pointerEvents="none">
      {/* Outer vibration field */}
      <Animated.View style={[styles.vibrationField, glowStyle]} />
      
      {/* Additional glow layers for depth */}
      <Animated.View 
        style={[
          styles.glowLayer2,
          {
            shadowColor: colors.glow,
            shadowOpacity: 0.4,
          }
        ]} 
      />
      
      {/* Echte blur/glow effects met React Native shadow */}
      <View 
        style={{
          position: 'absolute',
          width: 125,
          height: 125,
          borderRadius: 62.5,
          backgroundColor: 'transparent',
          shadowColor: colors.glow,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 31.25,
          shadowOpacity: 0.6,
          elevation: 30,
        }}
      />
      <View 
        style={{
          position: 'absolute',
          width: 93.75,
          height: 93.75,
          borderRadius: 46.875,
          left: 15.625,
          top: 15.625,
          backgroundColor: 'transparent',
          shadowColor: '#FFFFFF',
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 25,
          shadowOpacity: 0.4,
          elevation: 25,
        }}
      />
      <View 
        style={{
          position: 'absolute',
          width: 62.5,
          height: 62.5,
          borderRadius: 31.25,
          left: 31.25,
          top: 31.25,
          backgroundColor: 'transparent',
          shadowColor: colors.ring,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 18.75,
          shadowOpacity: 0.8,
          elevation: 20,
        }}
      />
      
      {/* Main plasma sphere */}
      <AnimatedSvg
        width={187.5}
        height={187.5}
        viewBox="0 0 187.5 187.5"
        style={[styles.sphere, sphereStyle]}
        pointerEvents="none"
      >
        <Defs>
          {/* Complex gradient for plasma effect with animated stops */}

          {/* Inner glow gradient */}
          <RadialGradient id="innerGlow" cx="50%" cy="50%" r="30%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="50%" stopColor={colors.glow} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
          </RadialGradient>
          
          {/* Corona glow gradient */}
          <RadialGradient id="coronaGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="70%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="90%" stopColor={colors.ring} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.ring} stopOpacity="0.4" />
          </RadialGradient>
        </Defs>

        {/* Removed dark base sphere - sphere is now transparent */}

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
              stroke={colors.lightning}
              strokeWidth={connection.width}
              fill="none"
              opacity={connection.opacity}
            />
          ))}
        </G>

        {/* Main and secondary lightning paths removed */}
        
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
          {/* Organisch verspreide plasma wolken */}
          <Circle cx={81.25} cy={84.375} r={21.25} fill="#FFB6C1" opacity={0.15} />
          <Circle cx={106.25} cy={87.5} r={18.75} fill="#FFDAB9" opacity={0.12} />
          <Circle cx={90.625} cy={106.25} r={18.125} fill="#FFA07A" opacity={0.18} />
          <Circle cx={100} cy={81.25} r={20} fill="#FFD700" opacity={0.1} />
          <Circle cx={87.5} cy={100} r={16.25} fill="#FFB6C1" opacity={0.2} />
          <Circle cx={103.125} cy={96.875} r={15} fill="#FFDAB9" opacity={0.15} />
          <Circle cx={78.125} cy={93.75} r={16.875} fill="#FF7F50" opacity={0.12} />
          <Circle cx={93.75} cy={78.125} r={14.375} fill="#FFB6C1" opacity={0.18} />
          <Circle cx={90.625} cy={109.375} r={16.25} fill="#FFA07A" opacity={0.13} />
          <Circle cx={96.875} cy={90.625} r={13.125} fill="#FFD700" opacity={0.2} />
          {/* Extra wolken voor meer body */}
          <Circle cx={75} cy={106.25} r={18.75} fill="#FFDAB9" opacity={0.1} />
          <Circle cx={112.5} cy={100} r={16.25} fill="#FFB6C1" opacity={0.12} />
          <Circle cx={84.375} cy={75} r={18.125} fill="#FFA07A" opacity={0.15} />
          {/* Nog meer plasma wolken voor volume */}
          <Circle cx={68.75} cy={90.625} r={20} fill="#FF7F50" opacity={0.08} />
          <Circle cx={118.75} cy={84.375} r={16.875} fill="#FFD700" opacity={0.11} />
          <Circle cx={93.75} cy={118.75} r={15.625} fill="#FFB6C1" opacity={0.14} />
          <Circle cx={109.375} cy={71.875} r={18.125} fill="#FFDAB9" opacity={0.09} />
          <Circle cx={78.125} cy={115.625} r={17.5} fill="#FFA07A" opacity={0.13} />
          <Circle cx={103.125} cy={109.375} r={16.25} fill="#FF7F50" opacity={0.1} />
        </G>

        {/* Kern glow effect - meerdere layers voor intense glow */}
        <Circle cx={93.75} cy={93.75} r={23.75} fill="#FFFFFF" opacity={0.1} />
        <Circle cx={93.75} cy={93.75} r={18.75} fill="#FFFFFF" opacity={0.15} />
        <Circle cx={93.75} cy={93.75} r={16.25} fill="#FFFFFF" opacity={0.2} />
        <Circle cx={93.75} cy={93.75} r={14.375} fill="#FFF8DC" opacity={0.3} />
        <Circle cx={93.75} cy={93.75} r={11.875} fill="#FFB6C1" opacity={0.4} />
        <Circle cx={93.75} cy={93.75} r={9.375} fill="#FFDAB9" opacity={0.5} />
        <Circle cx={93.75} cy={93.75} r={6.875} fill="#FFFFFF" opacity={0.5} />
        <Circle cx={93.75} cy={93.75} r={5} fill="#FFFFFF" opacity={0.7} />
        <Circle cx={93.75} cy={93.75} r={2.5} fill="#FFFFFF" opacity={0.9} />
        <Circle cx={93.75} cy={93.75} r={1.25} fill="#FFFFFF" opacity={1} />

        {/* Energy discharge ring */}
        <AnimatedCircle
          cx={93.75}
          cy={93.75}
          r={67.5}
          stroke={colors.ring}
          fill="none"
          animatedProps={useAnimatedProps(() => ({
            opacity: energyDischarge.value,
            strokeWidth: interpolate(
              energyDischarge.value,
              [0, 1],
              [1.25, 3.125]
            ),
          }))}
        />

        {/* Zachte outer ring - 1 layer met vrouwelijke kleuren */}
        <Circle
          cx={93.75}
          cy={93.75}
          r={65.625}
          stroke={colors.ring}
          strokeWidth={3.75}
          fill="none"
          opacity={0.35}
        />
      </AnimatedSvg>

      {/* Additional glow layer */}
      <Animated.View 
        style={[
          styles.glowLayer,
          {
            shadowColor: colors.glow,
          },
          glowStyle
        ]} 
      />
      
      {/* Extra glow for intense white core */}
      <View 
        style={{
          position: 'absolute',
          width: 31.25,
          height: 31.25,
          borderRadius: 15.625,
          backgroundColor: 'transparent',
          shadowColor: '#FFFFFF',
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 18.75,
          shadowOpacity: 0.9,
          elevation: 25,
          left: 78.125,
          top: 78.125,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 93.75,
    top: SCREEN_HEIGHT * 0.6 - 93.75,
    width: 187.5,
    height: 187.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  sphere: {
    zIndex: 2,
  },
  vibrationField: {
    position: 'absolute',
    width: 218.75,
    height: 218.75,
    borderRadius: 109.375,
    backgroundColor: 'transparent',
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 50,
    shadowOpacity: 0.8,
    elevation: 10,
    left: -15.625,
    top: -15.625,
  },
  glowLayer: {
    position: 'absolute',
    width: 187.5,
    height: 187.5,
    borderRadius: 93.75,
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 62.5,
    elevation: 20,
  },
  glowLayer2: {
    position: 'absolute',
    width: 206.25,
    height: 206.25,
    borderRadius: 103.125,
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 43.75,
    elevation: 15,
    left: -9.375,
    top: -9.375,
  },
});