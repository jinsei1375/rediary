import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Button, Dialog as TamaguiDialog, XStack, YStack, useTheme } from 'tamagui';

type DialogProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  height?: string | number;
  width?: string;
};

export const Dialog = React.memo(
  ({ visible, onClose, title, children, height = '60%', width = '90%' }: DialogProps) => {
    const theme = useTheme();

    return (
      <TamaguiDialog modal open={visible} onOpenChange={(open) => !open && onClose()}>
        <TamaguiDialog.Portal>
          <TamaguiDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            backgroundColor="$cardBg"
            onPress={onClose}
          />
          <TamaguiDialog.Content
            bordered
            elevate
            key="content"
            animation="quick"
            enterStyle={{ opacity: 0, scale: 0.9 }}
            exitStyle={{ opacity: 0, scale: 0.95 }}
            width={width}
            height={height}
            padding="$4"
            backgroundColor="$bgPrimary"
            borderRadius="$4"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={8}
            elevation={5}
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <TamaguiDialog.Title fontSize="$7" fontWeight="700" color="$textPrimary">
                {title}
              </TamaguiDialog.Title>
              <TamaguiDialog.Close asChild>
                <Button
                  size="$3"
                  circular
                  backgroundColor="$gray3"
                  pressStyle={{
                    backgroundColor: '$gray4',
                  }}
                >
                  <Ionicons name="close" size={20} color={theme.color.get()} />
                </Button>
              </TamaguiDialog.Close>
            </XStack>

            <YStack flex={height === 'auto' ? undefined : 1}>{children}</YStack>
          </TamaguiDialog.Content>
        </TamaguiDialog.Portal>
      </TamaguiDialog>
    );
  },
);

Dialog.displayName = 'Dialog';
