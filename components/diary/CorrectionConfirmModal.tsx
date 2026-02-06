import { Dialog } from '@/components/common/Dialog';
import { ModalButton } from '@/components/common/PrimaryButton';
import { Language } from '@/types/database';
import { getLanguageName } from '@/utils/languageUtils';
import { Text, XStack, YStack } from 'tamagui';

type CorrectionConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  nativeContent: string;
  userContent: string;
  hasNativeContent: boolean;
  targetLanguage: Language;
  isLanguageMismatch?: boolean;
};

export function CorrectionConfirmModal({
  open,
  onConfirm,
  onCancel,
  hasNativeContent,
  targetLanguage,
  isLanguageMismatch = false,
}: CorrectionConfirmModalProps) {
  return (
    <Dialog visible={open} onClose={onCancel} title="AI添削を実行しますか？" height="auto">
      <YStack gap="$4">
        <Text fontSize="$2" color="$gray10">
          ※ AI添削にはOpenAI APIを使用します
        </Text>

        <Text fontSize="$2" color="$orange10" fontWeight="600">
          ⚠️ AI添削は1つの日記に対して1回のみ実行できます
        </Text>

        {isLanguageMismatch && (
          <Text fontSize="$2" color="$orange10" fontWeight="600">
            ⚠️ ターゲット言語欄に{getLanguageName(targetLanguage)}
            以外の言語が含まれている可能性があります。
            {'\n'}
            正しく添削できない場合があります。
          </Text>
        )}

        {!hasNativeContent && (
          <Text fontSize="$2" color="$red10" fontWeight="600">
            ⚠️ ネイティブ言語が入力されていません。
            {'\n'}
            ターゲット言語の内容のみで自然な表現に添削します。
          </Text>
        )}

        <XStack gap="$3" justifyContent="flex-end" marginTop="$2">
          <ModalButton variant="secondary" onPress={onCancel} borderRadius="$3">
            キャンセル
          </ModalButton>
          <ModalButton variant="primary" onPress={onConfirm} borderRadius="$3">
            実行
          </ModalButton>
        </XStack>
      </YStack>
    </Dialog>
  );
}
