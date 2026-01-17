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
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
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
            <AlertDialog.Title>AI添削を実行しますか？</AlertDialog.Title>
            <AlertDialog.Description>以下の内容でAIが添削を行います。</AlertDialog.Description>

            <YStack gap="$2">
              <Text fontWeight="600" fontSize="$3">
                書きたかった内容（日本語）：
              </Text>
              <Text fontSize="$3" color="$gray11" numberOfLines={3}>
                {nativeContent}
              </Text>
            </YStack>

            <YStack gap="$2">
              <Text fontWeight="600" fontSize="$3">
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
                <Button onPress={onCancel}>キャンセル</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button backgroundColor="$blue10" color="$white1" onPress={onConfirm}>
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
