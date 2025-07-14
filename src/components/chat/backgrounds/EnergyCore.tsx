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
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

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

  // Color palettes - Tesla-style met vrouwelijke touch (lichter)
  const moodColors = {
    peaceful: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '15%', color: '#FFE0F5', opacity: 0.95 },
        { offset: '25%', color: '#FFB6E1', opacity: 0.9 },
        { offset: '35%', color: '#FF69B4', opacity: 0.85 },
        { offset: '45%', color: '#E088E0', opacity: 0.8 },
        { offset: '55%', color: '#C77DD8', opacity: 0.75 },
        { offset: '65%', color: '#9F7FDB', opacity: 0.7 },
        { offset: '75%', color: '#7B68EE', opacity: 0.75 },
        { offset: '85%', color: '#6495ED', opacity: 0.8 },
        { offset: '95%', color: '#4169E1', opacity: 0.85 },
        { offset: '100%', color: '#1E90FF', opacity: 0.9 },
      ],
      glow: '#FF69B4',
      ring: '#00FFFF',
      lightning: '#FFFFFF',
    },
    contemplative: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '15%', color: '#F8F8FF', opacity: 0.95 },
        { offset: '30%', color: '#E6E6FA', opacity: 0.9 },
        { offset: '45%', color: '#DDA0DD', opacity: 0.85 },
        { offset: '60%', color: '#9370DB', opacity: 0.8 },
        { offset: '75%', color: '#8A2BE2', opacity: 0.75 },
        { offset: '90%', color: '#DDA0DD', opacity: 0.85 },
        { offset: '100%', color: '#9400D3', opacity: 1 },
      ],
      glow: '#DDA0DD',
      ring: '#9400D3',
      lightning: '#E6E6FA',
    },
    joyful: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '15%', color: '#FFF8DC', opacity: 0.95 },
        { offset: '30%', color: '#FFDAB9', opacity: 0.9 },
        { offset: '45%', color: '#FFB6C1', opacity: 0.85 },
        { offset: '60%', color: '#FFA07A', opacity: 0.8 },
        { offset: '75%', color: '#FF69B4', opacity: 0.8 },
        { offset: '90%', color: '#FFD700', opacity: 0.85 },
        { offset: '100%', color: '#FF6347', opacity: 1 },
      ],
      glow: '#FFB6C1',
      ring: '#FF6347',
      lightning: '#FFD700',
    },
    grounded: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '20%', color: '#FAF0E6', opacity: 0.95 },
        { offset: '40%', color: '#BC8F8F', opacity: 0.9 },
        { offset: '60%', color: '#D2B48C', opacity: 0.85 },
        { offset: '80%', color: '#DEB887', opacity: 0.8 },
        { offset: '100%', color: '#8B7355', opacity: 1 },
      ],
      glow: '#BC8F8F',
      ring: '#8B7355',
      lightning: '#DEB887',
    },
    neutral: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '25%', color: '#F5F5F5', opacity: 0.95 },
        { offset: '50%', color: '#D3D3D3', opacity: 0.9 },
        { offset: '75%', color: '#C0C0C0', opacity: 0.85 },
        { offset: '100%', color: '#A9A9A9', opacity: 1 },
      ],
      glow: '#C0C0C0',
      ring: '#A9A9A9',
      lightning: '#F5F5F5',
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
    const startX = 112.5 + Math.cos(angle) * startRadius;
    const startY = 112.5 + Math.sin(angle) * startRadius;
    const endX = 112.5 + Math.cos(angle) * endRadius;
    const endY = 112.5 + Math.sin(angle) * endRadius;
    
    let path = `M${startX},${startY}`;
    let currentX = startX;
    let currentY = startY;
    const steps = 5 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < steps; i++) {
      const progress = (i + 1) / steps;
      const targetX = startX + (endX - startX) * progress;
      const targetY = startY + (endY - startY) * progress;
      
      // Add randomness for zigzag effect
      currentX = targetX + (Math.random() - 0.5) * 15;
      currentY = targetY + (Math.random() - 0.5) * 15;
      
      path += ` L${currentX},${currentY}`;
    }
    
    return path;
  };

  // Generate main lightning paths (slower rotation)
  const mainLightningPaths = [];
  const numMainPaths = 8;
  
  for (let i = 0; i < numMainPaths; i++) {
    const angle = (i / numMainPaths) * Math.PI * 2;
    mainLightningPaths.push({
      path: generateLightningPath(angle, 15, 105), // From core to edge
      opacity: 0.8 + Math.random() * 0.2,
      width: 2 + Math.random() * 1,
    });
  }

  // Generate secondary lightning paths (faster rotation)
  const secondaryLightningPaths = [];
  const numSecondaryPaths = 15;
  
  for (let i = 0; i < numSecondaryPaths; i++) {
    const angle = (i / numSecondaryPaths) * Math.PI * 2;
    secondaryLightningPaths.push({
      path: generateLightningPath(angle, 20, 100), // Slightly different range
      opacity: 0.3 + Math.random() * 0.3,
      width: 0.5 + Math.random() * 1,
    });
  }

  return (
    <View style={styles.container}>
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
      
      {/* Main plasma sphere */}
      <AnimatedSvg
        width={225}
        height={225}
        style={[styles.sphere, sphereStyle]}
      >
        <Defs>
          {/* Complex gradient for plasma effect with animated stops */}
          <RadialGradient id="plasmaGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.stops[0].color} stopOpacity={colors.stops[0].opacity} />
            <Stop offset="10%" stopColor={colors.stops[1].color} stopOpacity={colors.stops[1].opacity} />
            <Stop offset="20%" stopColor={colors.stops[2].color} stopOpacity={colors.stops[2].opacity} />
            <Stop offset="35%" stopColor={colors.stops[3].color} stopOpacity={colors.stops[3].opacity} />
            <Stop offset="50%" stopColor={colors.stops[4].color} stopOpacity={colors.stops[4].opacity} />
            <Stop offset="65%" stopColor={colors.stops[5].color} stopOpacity={colors.stops[5].opacity} />
            <Stop offset="80%" stopColor={colors.stops[6].color} stopOpacity={colors.stops[6].opacity} />
            <Stop offset="95%" stopColor={colors.stops[7].color} stopOpacity={colors.stops[7].opacity} />
            <Stop offset="100%" stopColor={colors.stops[8].color} stopOpacity={colors.stops[8].opacity} />
          </RadialGradient>

          {/* Inner glow gradient */}
          <RadialGradient id="innerGlow" cx="50%" cy="50%" r="30%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="50%" stopColor={colors.glow} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
          </RadialGradient>
          
          {/* Corona glow gradient */}
          <RadialGradient id="coronaGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="70%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="90%" stopColor="#00DDFF" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#00FFFF" stopOpacity="1" />
          </RadialGradient>
        </Defs>

        {/* Main sphere with gradient */}
        <Circle
          cx={112.5}
          cy={112.5}
          r={105}
          fill="url(#plasmaGradient)"
        />

        {/* Main lightning energy paths - slow rotation */}
        <AnimatedG 
          animatedProps={useAnimatedProps(() => ({
            opacity: 1,
            transform: [{
              rotate: `${mainRotation.value}deg`
            }]
          }))}
          originX={112.5}
          originY={112.5}
        >
          {mainLightningPaths.map((lightning, index) => (
            <Path
              key={`main-lightning-${index}`}
              d={lightning.path}
              stroke={colors.lightning}
              strokeWidth={lightning.width}
              fill="none"
              opacity={lightning.opacity}
              strokeLinecap="round"
            />
          ))}
        </AnimatedG>

        {/* Secondary lightning energy paths - faster counter-rotation */}
        <AnimatedG 
          animatedProps={useAnimatedProps(() => ({
            opacity: 1,
            transform: [{
              rotate: `${secondaryRotation.value}deg`
            }]
          }))}
          originX={112.5}
          originY={112.5}
        >
          {secondaryLightningPaths.map((lightning, index) => (
            <Path
              key={`secondary-lightning-${index}`}
              d={lightning.path}
              stroke={colors.lightning}
              strokeWidth={lightning.width}
              fill="none"
              opacity={lightning.opacity}
              strokeLinecap="round"
            />
          ))}
        </AnimatedG>

        {/* Wolkachtige plasma kern structuur */}
        <G opacity={0.4}>
          {/* Organische plasma wolken */}
          <Circle cx={100} cy={100} r={35} fill="#FFB6E1" opacity={0.5} />
          <Circle cx={125} cy={105} r={30} fill="#E088E0" opacity={0.4} />
          <Circle cx={110} cy={125} r={28} fill="#C77DD8" opacity={0.5} />
          <Circle cx={115} cy={95} r={32} fill="#FF69B4" opacity={0.3} />
          <Circle cx={105} cy={115} r={25} fill="#FFB6E1" opacity={0.6} />
        </G>

        {/* Inner bright core with multiple layers for blur effect */}
        <Circle
          cx={112.5}
          cy={112.5}
          r={35}
          fill="url(#innerGlow)"
          opacity={0.4}
        />
        <Circle
          cx={112.5}
          cy={112.5}
          r={25}
          fill="url(#innerGlow)"
          opacity={0.6}
        />
        <Circle
          cx={112.5}
          cy={112.5}
          r={15}
          fill="#FFFFFF"
          opacity={0.8}
        />
        
        {/* Intense bright center with glow */}
        <Circle
          cx={112.5}
          cy={112.5}
          r={10}
          fill="#FFFFFF"
          opacity={1}
        />
        <Circle
          cx={112.5}
          cy={112.5}
          r={8}
          fill="#FFFFFF"
          opacity={1}
        />

        {/* Energy discharge ring */}
        <AnimatedCircle
          cx={112.5}
          cy={112.5}
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

        {/* Corona glow effect - intense blue ring */}
        <Circle
          cx={112.5}
          cy={112.5}
          r={105}
          fill="url(#coronaGlow)"
          opacity={0.8}
        />
        
        {/* Sharp ring glow at edge */}
        <Circle
          cx={112.5}
          cy={112.5}
          r={105}
          stroke={colors.ring}
          strokeWidth={3}
          fill="none"
          opacity={1}
        />

        {/* Secondary glow ring */}
        <Circle
          cx={112.5}
          cy={112.5}
          r={110}
          stroke="#00FFFF"
          strokeWidth={2}
          fill="none"
          opacity={0.6}
        />
        
        {/* Extra glow layers for blur effect */}
        <Circle
          cx={112.5}
          cy={112.5}
          r={107}
          stroke={colors.ring}
          strokeWidth={1}
          fill="none"
          opacity={0.3}
        />
        <Circle
          cx={112.5}
          cy={112.5}
          r={109}
          stroke={colors.ring}
          strokeWidth={1}
          fill="none"
          opacity={0.2}
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
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'transparent',
          shadowColor: '#FFFFFF',
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 30,
          shadowOpacity: 0.9,
          elevation: 25,
          left: 87.5,
          top: 87.5,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 112.5,
    bottom: SCREEN_HEIGHT * 0.4 - 112.5,
    width: 225,
    height: 225,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sphere: {
    zIndex: 2,
  },
  vibrationField: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'transparent',
    shadowColor: '#00DDFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 60,
    shadowOpacity: 0.8,
    elevation: 10,
    left: -12.5,
    top: -12.5,
  },
  glowLayer: {
    position: 'absolute',
    width: 225,
    height: 225,
    borderRadius: 112.5,
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 80,
    elevation: 20,
  },
  glowLayer2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 60,
    elevation: 15,
    left: -12.5,
    top: -12.5,
  },
});