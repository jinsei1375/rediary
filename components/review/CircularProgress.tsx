import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text, XStack, YStack, useTheme } from 'tamagui';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type CircularProgressProps = {
  percentage: number;
  rememberedCount: number;
  totalQuestions: number;
};

export const CircularProgress = ({
  percentage,
  rememberedCount,
  totalQuestions,
}: CircularProgressProps) => {
  const theme = useTheme();
  const animatedProgress = useRef(new Animated.Value(0)).current;

  const size = Math.min(Dimensions.get('window').width * 0.5, 200);
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: percentage,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [percentage]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const getResultColor = () => {
    if (percentage >= 80) return theme.green10.get();
    if (percentage >= 60) return theme.blue10.get();
    if (percentage >= 40) return theme.orange10?.get() || '#f97316';
    return theme.red10.get();
  };

  return (
    <YStack alignItems="center" gap="$3" marginVertical="$4">
      <YStack
        position="relative"
        width={size}
        height={size}
        alignItems="center"
        justifyContent="center"
      >
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.gray5?.get() || '#e5e5e5'}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getResultColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <YStack position="absolute" alignItems="center">
          <XStack gap="$1" alignItems="baseline">
            <Text fontSize="$10" fontWeight="bold" color={getResultColor()}>
              {rememberedCount}
            </Text>
            <Text fontSize="$6" color="$gray11">
              / {totalQuestions}
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
};
