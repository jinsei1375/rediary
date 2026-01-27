import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

type StatCardProps = {
  label: string;
  value: number;
  unit: string;
  color: string;
  animationReady?: boolean;
};

export const StatCard = React.memo(
  ({ label, value, unit, color, animationReady = true }: StatCardProps) => {
    const [displayValue, setDisplayValue] = useState(value);
    const animatedValue = useRef(new Animated.Value(value)).current;
    const scaleValue = useRef(new Animated.Value(1)).current;
    const prevValueRef = useRef(value);

    useEffect(() => {
      if (!animationReady) return;

      // 値が変わった時だけアニメーション実行
      if (prevValueRef.current === value) {
        setDisplayValue(value);
        return;
      }

      const startValue = prevValueRef.current;
      prevValueRef.current = value;

      animatedValue.setValue(startValue);

      const countAnimation = Animated.timing(animatedValue, {
        toValue: value,
        duration: 1800,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      });

      const scaleAnimation = Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.15,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]);

      const listener = animatedValue.addListener(({ value: animValue }) => {
        // 最終値に近づいたら（98%以上）、直接最終値を表示してスムーズに
        if (animValue >= value * 0.98) {
          setDisplayValue(value);
        } else {
          setDisplayValue(Math.floor(animValue));
        }
      });

      Animated.parallel([countAnimation, scaleAnimation]).start(() => {
        // アニメーション完了時に確実に最終値を設定
        setDisplayValue(value);
      });

      return () => {
        animatedValue.removeListener(listener);
      };
    }, [value, animatedValue, scaleValue, animationReady]);

    return (
      <YStack backgroundColor="$cardBg" padding="$3" borderRadius="$6" alignItems="center" gap="$1">
        <Text fontSize="$3" color="$textSecondary">
          {label}
        </Text>
        <XStack alignItems="baseline" gap="$1">
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <Text fontSize="$9" fontWeight="bold" color={color}>
              {displayValue}
            </Text>
          </Animated.View>
          <Text fontSize="$4" color="$textSecondary">
            {unit}
          </Text>
        </XStack>
      </YStack>
    );
  },
);

StatCard.displayName = 'StatCard';
