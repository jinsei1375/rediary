import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
};

export const Header = React.memo(({ title, showBackButton = true, onBack }: HeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <YStack
      backgroundColor="$background"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      paddingVertical="$3"
      paddingHorizontal="$4"
    >
      <XStack alignItems="center" justifyContent="center" position="relative">
        {showBackButton && (
          <Button
            unstyled
            position="absolute"
            left={0}
            onPress={handleBack}
            pressStyle={{ opacity: 0.7 }}
          >
            <Text color="$primary" fontSize="$4">
              ← 戻る
            </Text>
          </Button>
        )}
        <Text fontSize="$6" fontWeight="bold" color="$color">
          {title}
        </Text>
      </XStack>
    </YStack>
  );
});

Header.displayName = 'Header';
