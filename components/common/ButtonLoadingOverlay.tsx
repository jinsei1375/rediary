import React from 'react';
import { Spinner, YStack } from 'tamagui';

interface ButtonLoadingOverlayProps {
  visible: boolean;
}

export function ButtonLoadingOverlay({ visible }: ButtonLoadingOverlayProps) {
  if (!visible) return null;

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="rgba(0, 0, 0, 0.2)"
      borderRadius={8}
      alignItems="center"
      justifyContent="center"
      pointerEvents="box-only"
    >
      <Spinner color="#FFFFFF" />
    </YStack>
  );
}
