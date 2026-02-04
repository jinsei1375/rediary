import { FreePlanNotice } from '@/components/common/FreePlanNotice';
import { SaveButton } from '@/components/common/PrimaryButton';
import { useSettings } from '@/contexts/SettingsContext';
import type { DiaryFormData } from '@/types/ui';
import { getLanguageName } from '@/utils/languageUtils';
import React, { useCallback } from 'react';
import { YStack } from 'tamagui';
import { DiaryTextInput } from './DiaryTextInput';

type DiaryFormProps = {
  formData: DiaryFormData;
  onFormChange: (field: keyof DiaryFormData, value: string) => void;
  onSave: () => void;
  saving: boolean;
  showFreePlanNotice?: boolean;
  returnToPath?: string;
};

const MAX_LENGTH_ENGLISH = 1500;
const MAX_LENGTH_JAPANESE = 1000;

export const DiaryForm = React.memo(
  ({
    formData,
    onFormChange,
    onSave,
    saving,
    showFreePlanNotice,
    returnToPath,
  }: DiaryFormProps) => {
    const { targetLanguage, nativeLanguage } = useSettings();
    const isContentOverLimit = formData.content.length > MAX_LENGTH_ENGLISH;
    const isContentNativeOverLimit = formData.content_native.length > MAX_LENGTH_JAPANESE;
    const isSaveDisabled =
      saving || isContentOverLimit || isContentNativeOverLimit || showFreePlanNotice;

    const handleTitleChange = useCallback(
      (text: string) => onFormChange('title', text),
      [onFormChange],
    );

    const handleContentChange = useCallback(
      (text: string) => onFormChange('content', text),
      [onFormChange],
    );

    const handleContentNativeChange = useCallback(
      (text: string) => onFormChange('content_native', text),
      [onFormChange],
    );

    return (
      <YStack padding="$4" gap="$3">
        {showFreePlanNotice && (
          <FreePlanNotice
            title="無料プランの制限"
            message="無料プランでは当日分の日記しか保存できません。"
            upgradeText="有料プランで過去の日記も編集可能に →"
            returnTo={returnToPath}
          />
        )}

        <DiaryTextInput
          label="タイトル"
          value={formData.title}
          onChangeText={handleTitleChange}
          placeholder="YYYY/MM/DD"
        />

        <DiaryTextInput
          label={`内容（${getLanguageName(targetLanguage)}）`}
          subLabel={`実際に書く${getLanguageName(targetLanguage)}の日記`}
          value={formData.content}
          onChangeText={handleContentChange}
          placeholder="Today..."
          multiline
          maxLength={MAX_LENGTH_ENGLISH}
        />

        <DiaryTextInput
          label={`内容（${getLanguageName(nativeLanguage)}）※任意`}
          subLabel={`本来${getLanguageName(targetLanguage)}として書きたかった内容`}
          value={formData.content_native}
          onChangeText={handleContentNativeChange}
          placeholder="今日は..."
          multiline
          maxLength={MAX_LENGTH_JAPANESE}
        />

        <SaveButton loading={saving} onPress={onSave} marginTop="$4" disabled={isSaveDisabled} />
      </YStack>
    );
  },
);

DiaryForm.displayName = 'DiaryForm';
