import { Portal } from '@tamagui/portal';
import { Spinner, Text, YStack } from 'tamagui';

type LoadingOverlayProps = {
  visible: boolean;
  title: string;
  message?: string;
};

export const LoadingOverlay = ({ visible, title, message }: LoadingOverlayProps) => {
  if (!visible) return null;

  return (
    <Portal>
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor="rgba(0, 0, 0, 0.7)"
        justifyContent="center"
        alignItems="center"
        zIndex={9999}
      >
        <YStack
          backgroundColor="$background"
          padding="$6"
          marginHorizontal="$4"
          borderRadius="$4"
          alignItems="center"
          gap="$3"
        >
          <Spinner size="large" color="$accentBlue" />
          <Text fontSize="$6" fontWeight="bold" color="$textPrimary">
            {title}
          </Text>
          {message && (
            <Text fontSize="$3" color="$gray10">
              {message}
            </Text>
          )}
        </YStack>
      </YStack>
    </Portal>
  );
};
