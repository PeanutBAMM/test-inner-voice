import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  ScrollViewProps,
  ViewStyle,
  ImageSourcePropType,
  Text,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ParallaxScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  headerImage?: ImageSourcePropType;
  headerHeight?: number;
  headerTitle?: string;
  headerSubtitle?: string;
  fadeHeader?: boolean;
  style?: ViewStyle;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function ParallaxScrollView({
  children,
  headerImage,
  headerHeight = 300,
  headerTitle,
  headerSubtitle,
  fadeHeader = true,
  style,
  ...props
}: ParallaxScrollViewProps) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-headerHeight, 0, headerHeight],
      [-headerHeight / 2, 0, headerHeight * 0.75],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [-headerHeight, 0, headerHeight],
      [2, 1, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const headerTextStyle = useAnimatedStyle(() => {
    const opacity = fadeHeader
      ? interpolate(
          scrollY.value,
          [0, headerHeight / 2, headerHeight],
          [1, 0.5, 0],
          Extrapolate.CLAMP
        )
      : 1;

    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight],
      [0, -50],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      scrollY.value,
      [0, headerHeight - 50],
      [20, 0],
      Extrapolate.CLAMP
    );

    return {
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }, headerStyle]}>
        {headerImage && (
          <Animated.Image
            source={headerImage}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        )}
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={StyleSheet.absoluteFillObject}
        />
        
        {(headerTitle || headerSubtitle) && (
          <Animated.View style={[styles.headerTextContainer, headerTextStyle]}>
            {headerTitle && (
              <Text style={styles.headerTitle}>{headerTitle}</Text>
            )}
            {headerSubtitle && (
              <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
            )}
          </Animated.View>
        )}
      </Animated.View>

      <AnimatedScrollView
        style={[styles.scrollView, style]}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: headerHeight },
        ]}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        {...props}
      >
        <Animated.View style={[styles.content, contentStyle]}>
          {children}
        </Animated.View>
      </AnimatedScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: theme.colors.primary,
  },
  headerTextContainer: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.white,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    backgroundColor: theme.colors.background,
    marginTop: -20,
    paddingTop: 20,
    minHeight: SCREEN_HEIGHT,
  },
});