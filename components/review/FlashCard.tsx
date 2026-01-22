import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { YStack, useTheme } from 'tamagui';

type FlashCardProps = {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
};

export const FlashCard = React.memo(
  ({ frontContent, backContent, isFlipped, onFlip }: FlashCardProps) => {
    const theme = useTheme();
    const flipAnimation = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.spring(flipAnimation, {
        toValue: isFlipped ? 180 : 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }, [isFlipped, flipAnimation]);

    const frontInterpolate = flipAnimation.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });

    const frontOpacity = flipAnimation.interpolate({
      inputRange: [89, 90],
      outputRange: [1, 0],
    });

    const backOpacity = flipAnimation.interpolate({
      inputRange: [89, 90],
      outputRange: [0, 1],
    });

    return (
      <Pressable onPress={onFlip} style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ rotateY: frontInterpolate }],
              opacity: frontOpacity,
              backgroundColor: theme.background.get(),
              borderColor: theme.borderColor.get(),
            },
          ]}
        >
          <YStack flex={1} padding="$4" justifyContent="center">
            {frontContent}
          </YStack>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              transform: [{ rotateY: backInterpolate }],
              opacity: backOpacity,
              backgroundColor: theme.background.get(),
              borderColor: theme.borderColor.get(),
            },
          ]}
        >
          <YStack flex={1} padding="$4" justifyContent="center">
            {backContent}
          </YStack>
        </Animated.View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 1,
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
  },
});

FlashCard.displayName = 'FlashCard';
