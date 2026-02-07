import { Dialog } from '@/components/common/Dialog';
import type { TranslationExerciseUpdate } from '@/types/database';
import { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button, Input, Text, XStack, YStack } from 'tamagui';

type EditExpressionDialogProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (updates: TranslationExerciseUpdate) => Promise<void>;
  initialNativeText: string;
  initialTargetText: string;
};

export function EditExpressionDialog({
  visible,
  onClose,
  onSave,
  initialNativeText,
  initialTargetText,
}: EditExpressionDialogProps) {
  const [nativeText, setNativeText] = useState(initialNativeText);
  const [targetText, setTargetText] = useState(initialTargetText);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nativeText.trim() || !targetText.trim()) {
      return;
    }

    setSaving(true);
    Keyboard.dismiss();
    await onSave({
      native_text: nativeText.trim(),
      target_text: targetText.trim(),
    });
    setSaving(false);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setNativeText(initialNativeText);
    setTargetText(initialTargetText);
    onClose();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Dialog
      visible={visible}
      onClose={handleClose}
      height={400}
      title="編集"
      position="top"
      marginTop="$8"
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <YStack gap="$4" padding="$4" flex={1}>
          <YStack gap="$2">
            <Text fontSize="$3" fontWeight="600" color="$textPrimary">
              ネイティブ表現
            </Text>
            <Input
              value={targetText}
              onChangeText={setTargetText}
              placeholder="例: I'm on my way"
              fontSize="$4"
              backgroundColor="$bgSecondary"
              borderWidth={1}
              borderColor="$borderColor"
              padding="$3"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$3" fontWeight="600" color="$textPrimary">
              翻訳
            </Text>
            <Input
              value={nativeText}
              onChangeText={setNativeText}
              placeholder="例: 今向かっています"
              fontSize="$4"
              backgroundColor="$bgSecondary"
              borderWidth={1}
              borderColor="$borderColor"
              padding="$3"
              multiline
              numberOfLines={3}
            />
          </YStack>

          <XStack gap="$3" marginTop="$2">
            <Button
              flex={1}
              backgroundColor="$bgSecondary"
              color="$textPrimary"
              onPress={handleClose}
              disabled={saving}
            >
              キャンセル
            </Button>
            <Button
              flex={1}
              backgroundColor="$primary"
              color="white"
              onPress={handleSave}
              disabled={saving || !nativeText.trim() || !targetText.trim()}
              opacity={saving || !nativeText.trim() || !targetText.trim() ? 0.5 : 1}
            >
              保存
            </Button>
          </XStack>
        </YStack>
      </TouchableWithoutFeedback>
    </Dialog>
  );
}
