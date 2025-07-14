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
  Mask,
  Rect,
  Path,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

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
  const lightningOpacity = useSharedValue(0);
  const lightningRotation = useSharedValue(0);

  // Color palettes - Vrouwelijke pastel plasma kleuren
  const moodColors = {
    peaceful: {
      stops: [
        { offset: '0%', color: '#FFFFFF', opacity: 1 },
        { offset: '10%', color: '#FFF0F5', opacity: 0.95 },
        { offset: '20%', color: '#FFE4E1', opacity: 0.9 },
        { offset: '35%', color: '#FF69B4', opacity: 0.85 },
        { offset: '50%', color: '#DDA0DD', opacity: 0.8 },
        { offset: '65%', color: '#E6E6FA', opacity: 0.75 },
        { offset: '80%', color: '#FFB6C1', opacity: 0.8 },
        { offset: '95%', color: '#FF69B4', opacity: 0.9 },
        { offset: '100%', color: '#FF1493', opacity: 1 },
      ],
      glow: '#FF69B4',
      ring: '#FF1493',
      lightning: '#FFB6C1',
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

    // Lightning rotation
    lightningRotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );

    // Lightning flash
    lightningOpacity.value = withRepeat(
      withSequence(
        withDelay(3000, withTiming(1, { duration: 50 })),
        withTiming(0, { duration: 150 }),
        withDelay(2000, withTiming(0.8, { duration: 50 })),
        withTiming(0, { duration: 100 })
      ),
      -1,
      false
    );
  }, [breathingAnim, energyDischarge, lightningRotation, lightningOpacity]);

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

  // Generate plasma texture circles
  const plasmaTexturePositions = [
    { cx: 25, cy: 25, r: 12 },
    { cx: 55, cy: 30, r: 15 },
    { cx: 90, cy: 45, r: 18 },
    { cx: 40, cy: 70, r: 14 },
    { cx: 75, cy: 75, r: 22 },
    { cx: 105, cy: 90, r: 16 },
    { cx: 60, cy: 105, r: 20 },
    { cx: 30, cy: 95, r: 13 },
    { cx: 85, cy: 55, r: 17 },
    { cx: 100, cy: 30, r: 14 },
    { cx: 70, cy: 85, r: 19 },
    { cx: 45, cy: 45, r: 16 },
    { cx: 115, cy: 60, r: 13 },
    { cx: 15, cy: 75, r: 17 },
    { cx: 75, cy: 105, r: 15 },
  ];

  // Lightning paths
  const lightningPaths = [
    "M112.5,112.5 L105,85 L120,70 L108,50 L115,30 L105,15",
    "M112.5,112.5 L120,85 L105,70 L117,50 L110,30 L120,15",
    "M112.5,112.5 L100,90 L115,75 L102,55 L118,40 L100,20",
    "M112.5,112.5 L125,90 L110,75 L123,55 L107,40 L125,20",
  ];

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

          {/* Mask for plasma texture */}
          <Mask id="plasmaMask">
            <Rect x="0" y="0" width="225" height="225" fill="white" />
            <G opacity={0.8}>
              {plasmaTexturePositions.map((pos, index) => (
                <Circle
                  key={`plasma-${index}`}
                  cx={pos.cx}
                  cy={pos.cy}
                  r={pos.r}
                  fill="white"
                  opacity={0.3}
                />
              ))}
            </G>
          </Mask>

          {/* Inner glow gradient */}
          <RadialGradient id="innerGlow" cx="50%" cy="50%" r="30%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="50%" stopColor={colors.glow} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Main sphere with gradient */}
        <Circle
          cx={112.5}
          cy={112.5}
          r={105}
          fill="url(#plasmaGradient)"
          mask="url(#plasmaMask)"
        />

        {/* Lightning energy paths */}
        <G opacity={lightningOpacity.value} transform={`rotate(${lightningRotation.value} 112.5 112.5)`}>
          {lightningPaths.map((path, index) => (
            <AnimatedPath
              key={`lightning-${index}`}
              d={path}
              stroke={colors.lightning}
              strokeWidth={2}
              fill="none"
              opacity={0.8}
              strokeLinecap="round"
              strokeDasharray="5,10"
            />
          ))}
        </G>

        {/* Inner bright core */}
        <Circle
          cx={112.5}
          cy={112.5}
          r={30}
          fill="url(#innerGlow)"
          opacity={0.9}
        />

        {/* Energy discharge ring */}
        <AnimatedCircle
          cx={112.5}
          cy={112.5}
          r={108}
          stroke={colors.ring}
          strokeWidth={3}
          fill="none"
          opacity={energyDischarge.value}
        />

        {/* Sharp ring glow at edge */}
        <Circle
          cx={112.5}
          cy={112.5}
          r={105}
          stroke={colors.ring}
          strokeWidth={2}
          fill="none"
          opacity={0.8}
        />

        {/* Secondary glow ring */}
        <Circle
          cx={112.5}
          cy={112.5}
          r={110}
          stroke={colors.glow}
          strokeWidth={1}
          fill="none"
          opacity={0.4}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 112.5,
    top: SCREEN_HEIGHT * 0.4 - 112.5,
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
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'transparent',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 100,
    shadowOpacity: 0.3,
    elevation: 10,
    left: -37.5,
    top: -37.5,
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