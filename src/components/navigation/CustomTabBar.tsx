import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
  Keyboard,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { TAB_BAR_HEIGHT } from '../../constants/navigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  const tabWidth = SCREEN_WIDTH / state.routes.length;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Animation values for active indicator
  const translateX = useRef(new Animated.Value(state.index * tabWidth)).current;
  const scaleValues = useRef(state.routes.map(() => new Animated.Value(1))).current;

  // Keyboard visibility detection
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // Animate indicator position
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      tension: 68,
      friction: 10,
    }).start();

    // Animate icon scales
    scaleValues.forEach((value, index) => {
      Animated.spring(value, {
        toValue: state.index === index ? 1.1 : 1,
        useNativeDriver: true,
        tension: 50,
        friction: 5,
      }).start();
    });
  }, [state.index, tabWidth, translateX, scaleValues]);

  const getIconName = (routeName: string, isFocused: boolean): keyof typeof Ionicons.glyphMap => {
    switch (routeName) {
      case 'Chat':
        return isFocused ? 'chatbubbles' : 'chatbubbles-outline';
      case 'Library':
        return isFocused ? 'book' : 'book-outline';
      case 'Profile':
        return isFocused ? 'person' : 'person-outline';
      case 'Settings':
        return isFocused ? 'settings' : 'settings-outline';
      default:
        return 'help-circle';
    }
  };

  // Hide tab bar when keyboard is visible
  if (isKeyboardVisible) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {/* Background layers for glass effect */}
        <View style={StyleSheet.absoluteFillObject}>
          {/* Base layer */}
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(26, 35, 50, 0.95)'
                  : 'rgba(255, 245, 248, 0.95)',
              },
            ]}
          />

          {/* Gradient overlay 1 */}
          <LinearGradient
            colors={
              theme.isDark
                ? ['rgba(46, 89, 132, 0.15)', 'rgba(46, 89, 132, 0.05)']
                : ['rgba(255, 182, 193, 0.15)', 'rgba(255, 218, 185, 0.05)']
            }
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Gradient overlay 2 for depth */}
          <LinearGradient
            colors={
              theme.isDark
                ? ['transparent', 'rgba(15, 20, 25, 0.3)']
                : ['transparent', 'rgba(255, 255, 255, 0.3)']
            }
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </View>

        {/* Border top for glass edge effect */}
        <View
          style={[
            styles.borderTop,
            {
              backgroundColor: theme.isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 182, 193, 0.3)',
            },
          ]}
        />

        {/* Active indicator */}
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              width: tabWidth * 0.5,
              transform: [{ translateX: Animated.add(translateX, tabWidth * 0.25) }],
            },
          ]}
        >
          <LinearGradient
            colors={theme.isDark ? ['#4A7BA7', '#2E5984'] : ['#FFB6C1', '#FF69B4']}
            style={styles.indicatorGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>

        {/* Tab items */}
        <View style={styles.tabContainer}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel ?? options.title ?? route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tab}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={[
                    styles.iconContainer,
                    {
                      transform: [{ scale: scaleValues[index] }],
                    },
                  ]}
                >
                  <Ionicons
                    name={getIconName(route.name, isFocused)}
                    size={24}
                    color={
                      isFocused
                        ? theme.isDark
                          ? '#4A7BA7'
                          : '#FF69B4'
                        : theme.colors.textSecondary
                    }
                  />
                </Animated.View>
                <Text
                  style={[
                    styles.label,
                    {
                      color: isFocused
                        ? theme.isDark
                          ? '#4A7BA7'
                          : '#FF69B4'
                        : theme.colors.textSecondary,
                      fontWeight: isFocused ? '600' : '500',
                    },
                  ]}
                >
                  {label as string}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  container: {
    height: TAB_BAR_HEIGHT,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 2,
  },
  indicatorGradient: {
    flex: 1,
    borderRadius: 1,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 32,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
  },
});
