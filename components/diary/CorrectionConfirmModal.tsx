import { AlertDialog, Button, Text, XStack, YStack } from 'tamagui';

type CorrectionConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  nativeContent: string;
  userContent: string;
};

export function CorrectionConfirmModal({
  open,
  onConfirm,
  onCancel,
  nativeContent,
  userContent,
}: CorrectionConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="rgba(0, 0, 0, 0.5)"
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          backgroundColor="$background"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          maxWidth={500}
        >
          <YStack gap="$4">
            <AlertDialog.Title color="$color">AI添削を実行しますか？</AlertDialog.Title>
            <AlertDialog.Description color="$gray11">
              以下の内容でAIが添削を行います。
            </AlertDialog.Description>

            <YStack gap="$2">
              <Text fontWeight="600" fontSize="$3" color="$color">
                書きたかった内容（日本語）：
              </Text>
              <Text fontSize="$3" color="$gray11" numberOfLines={3}>
                {nativeContent}
              </Text>
            </YStack>

            <YStack gap="$2">
              <Text fontWeight="600" fontSize="$3" color="$color">
                実際に書いた内容（英語）：
              </Text>
              <Text fontSize="$3" color="$gray11" numberOfLines={3}>
                {userContent}
              </Text>
            </YStack>

            <Text fontSize="$2" color="$gray10">
              ※ AI添削にはOpenAI APIを使用します
            </Text>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button
                  onPress={onCancel}
                  backgroundColor="$backgroundHover"
                  color="$color"
                  borderRadius="$3"
                  pressStyle={{
                    backgroundColor: '$backgroundPress',
                  }}
                  hoverStyle={{
                    backgroundColor: '$backgroundPress',
                  }}
                >
                  キャンセル
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  backgroundColor="$primary"
                  color="$background"
                  onPress={onConfirm}
                  borderRadius="$3"
                  pressStyle={{
                    backgroundColor: '$primaryPress',
                  }}
                  hoverStyle={{
                    backgroundColor: '$primaryHover',
                  }}
                >
                  実行
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
