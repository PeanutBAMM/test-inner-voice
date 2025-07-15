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
      lightning: '#87CEEB',
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
      lightning: '#B0C4DE',
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
      lightning: '#87CEEB',
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
      lightning: '#B0C4DE',
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
      lightning: '#87CEEB',
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

  // Generate plasma web connections
  const generatePlasmaWeb = () => {
    const web = [];
    const numPoints = 50; // Increased for more connections
    const points = [];
    
    // Generate random points within sphere
    for (let i = 0; i < numPoints; i++) {
      const r = Math.random() * 90 + 11; // Random radius (75% of previous values)
      const theta = Math.random() * Math.PI * 2;
      points.push({
        x: 150 + r * Math.cos(theta),
        y: 150 + r * Math.sin(theta),
      });
    }
    
    // Connect nearby points
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only connect points that are relatively close
        if (distance < 60 && distance > 10) { // Increased range for more connections
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
    const numStars = 500; // Verhoogd naar 500+
    
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
  
  // Voor simplicity gebruik ik maar 5 animated stars, de rest static
  const animatedStarIndices = [0, 100, 200, 300, 400];
  const starOpacities = [starOpacity1, starOpacity2, starOpacity3, starOpacity4, starOpacity5];
  
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
      >
        <Defs>
          {/* Kern blur gradient - simuleert echte blur */}
          <RadialGradient id="kernBlur" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="10%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <Stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <Stop offset="30%" stopColor="#FFE0F5" stopOpacity="0.5" />
            <Stop offset="40%" stopColor="#FFB6E1" stopOpacity="0.4" />
            <Stop offset="50%" stopColor="#FF69B4" stopOpacity="0.3" />
            <Stop offset="70%" stopColor="#FF69B4" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#FF69B4" stopOpacity="0" />
          </RadialGradient>
          
          {/* Corona blur gradient - zachte blauwe rand */}
          <RadialGradient id="coronaBlur" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="70%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="80%" stopColor="#00FFFF" stopOpacity="0.2" />
            <Stop offset="85%" stopColor="#00FFFF" stopOpacity="0.5" />
            <Stop offset="90%" stopColor="#00FFFF" stopOpacity="0.8" />
            <Stop offset="95%" stopColor="#00DDFF" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#0099FF" stopOpacity="0.3" />
          </RadialGradient>
          
          {/* Extra glow gradients voor intense outer ring */}
          <RadialGradient id="outerGlow1" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="85%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="92%" stopColor="#00FFFF" stopOpacity="0.6" />
            <Stop offset="96%" stopColor="#00DDFF" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#0099FF" stopOpacity="0.4" />
          </RadialGradient>
          
          <RadialGradient id="outerGlow2" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="88%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="94%" stopColor="#00CCFF" stopOpacity="0.7" />
            <Stop offset="97%" stopColor="#00AAFF" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#0088FF" stopOpacity="0.2" />
          </RadialGradient>
          
          <RadialGradient id="outerGlow3" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="82%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="90%" stopColor="#00EEFF" stopOpacity="0.5" />
            <Stop offset="95%" stopColor="#00BBFF" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#0077FF" stopOpacity="0.3" />
          </RadialGradient>
        </Defs>

        {/* Dark base sphere with extra depth layers */}
        <Circle
          cx={150}
          cy={150}
          r={105}
          fill="#0A0020"
          opacity={1}
        />
        
        {/* Background glow layers for more body */}
        <Circle
          cx={150}
          cy={150}
          r={101}
          fill="#1A0030"
          opacity={0.5}
        />
        <Circle
          cx={150}
          cy={150}
          r={98}
          fill="#2A0040"
          opacity={0.4}
        />
        <Circle
          cx={150}
          cy={150}
          r={94}
          fill="#3A0050"
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
              stroke="#E0D0FF"
              strokeWidth={connection.width}
              fill="none"
              opacity={connection.opacity}
            />
          ))}
        </G>

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
          <Circle cx={130} cy={135} r={34} fill="#FFB6E1" opacity={0.15} />
          <Circle cx={170} cy={140} r={30} fill="#E088E0" opacity={0.12} />
          <Circle cx={145} cy={170} r={29} fill="#C77DD8" opacity={0.18} />
          <Circle cx={160} cy={130} r={32} fill="#FF69B4" opacity={0.1} />
          <Circle cx={140} cy={160} r={26} fill="#FFB6E1" opacity={0.2} />
          <Circle cx={165} cy={155} r={24} fill="#DDA0DD" opacity={0.15} />
          <Circle cx={125} cy={150} r={27} fill="#FF69B4" opacity={0.12} />
          <Circle cx={150} cy={125} r={23} fill="#FFB6E1" opacity={0.18} />
          <Circle cx={145} cy={175} r={26} fill="#E088E0" opacity={0.13} />
          <Circle cx={155} cy={145} r={21} fill="#C77DD8" opacity={0.2} />
          {/* Extra wolken voor meer body */}
          <Circle cx={120} cy={170} r={30} fill="#DDA0DD" opacity={0.1} />
          <Circle cx={180} cy={160} r={26} fill="#FFB6E1" opacity={0.12} />
          <Circle cx={135} cy={120} r={29} fill="#E088E0" opacity={0.15} />
          {/* Nog meer plasma wolken voor volume */}
          <Circle cx={110} cy={145} r={32} fill="#FF69B4" opacity={0.08} />
          <Circle cx={190} cy={135} r={27} fill="#C77DD8" opacity={0.11} />
          <Circle cx={150} cy={190} r={25} fill="#FFB6E1" opacity={0.14} />
          <Circle cx={175} cy={115} r={29} fill="#DDA0DD" opacity={0.09} />
          <Circle cx={125} cy={185} r={28} fill="#E088E0" opacity={0.13} />
          <Circle cx={165} cy={175} r={26} fill="#FF69B4" opacity={0.1} />
        </G>

        {/* Kern met blur effect - 1 circle met gradient */}
        <Circle cx={150} cy={150} r={50} fill="url(#kernBlur)" />
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
          {/* Basis corona ring */}
          <Circle cx={150} cy={150} r={105} fill="url(#coronaBlur)" opacity={1} />
          
          {/* Extra glow layers - allemaal op r=105 */}
          <Circle cx={150} cy={150} r={105} fill="url(#outerGlow1)" opacity={0.8} />
          <Circle cx={150} cy={150} r={105} fill="url(#outerGlow2)" opacity={0.6} />
          <Circle cx={150} cy={150} r={105} fill="url(#outerGlow3)" opacity={0.7} />
          
          {/* Extra blur circles voor meer intensiteit */}
          <Circle cx={150} cy={150} r={105} fill="#00FFFF" opacity={0.15} />
          <Circle cx={150} cy={150} r={105} fill="#00DDFF" opacity={0.12} />
          <Circle cx={150} cy={150} r={105} fill="#00BBFF" opacity={0.10} />
          <Circle cx={150} cy={150} r={105} fill="#0099FF" opacity={0.08} />
          
          {/* Bright edge highlight - nu met meer glow */}
          <Circle cx={150} cy={150} r={105} stroke="#00FFFF" strokeWidth={3} fill="none" opacity={0.9} />
          <Circle cx={150} cy={150} r={105} stroke="#00EEFF" strokeWidth={2} fill="none" opacity={0.6} />
          <Circle cx={150} cy={150} r={105} stroke="#FFFFFF" strokeWidth={1} fill="none" opacity={0.4} />
        </G>
      </AnimatedSvg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 150,
    bottom: SCREEN_HEIGHT * 0.4 - 150,
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sphere: {
    zIndex: 2,
  },
});