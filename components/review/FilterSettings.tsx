import { FreePlanNotice } from '@/components/common/FreePlanNotice';
import React from 'react';
import { H4, ScrollView, YStack, useTheme } from 'tamagui';
import { ExerciseCountDisplay } from './ExerciseCountDisplay';
import { FilterSelect } from './FilterSelect';
import { StartReviewButton } from './StartReviewButton';
import { ToggleSwitch } from './ToggleSwitch';

type FilterSettingsProps = {
  isRandom: boolean;
  notRememberedCount: number;
  daysSinceLastAttempt: number;
  questionCount: number;
  excludeRemembered: boolean;
  exerciseCount: number;
  reviewLimitStatus: {
    isAllowed: boolean;
    isPremium: boolean;
    todayCount: number;
    limit: number;
  } | null;
  onIsRandomChange: (value: boolean) => void;
  onNotRememberedCountChange: (value: number) => void;
  onDaysSinceLastAttemptChange: (value: number) => void;
  onQuestionCountChange: (value: number) => void;
  onExcludeRememberedChange: (value: boolean) => void;
  onStartReview: () => void;
};

const NOT_REMEMBERED_OPTIONS = [
  { label: '全て', value: 0 },
  { label: '1回以上', value: 1 },
  { label: '2回以上', value: 2 },
  { label: '3回以上', value: 3 },
  { label: '5回以上', value: 5 },
];

const DAYS_OPTIONS = [
  { label: '全て', value: 0 },
  { label: '1日以上', value: 1 },
  { label: '3日以上', value: 3 },
  { label: '7日以上', value: 7 },
  { label: '14日以上', value: 14 },
  { label: '30日以上', value: 30 },
];

const QUESTION_COUNT_OPTIONS = [
  { label: '1問', value: 1 },
  { label: '2問', value: 2 },
  { label: '3問', value: 3 },
  { label: '4問', value: 4 },
  { label: '5問', value: 5 },
];

export const FilterSettings = React.memo(
  ({
    isRandom,
    notRememberedCount,
    daysSinceLastAttempt,
    questionCount,
    excludeRemembered,
    exerciseCount,
    reviewLimitStatus,
    onIsRandomChange,
    onNotRememberedCountChange,
    onDaysSinceLastAttemptChange,
    onQuestionCountChange,
    onExcludeRememberedChange,
    onStartReview,
  }: FilterSettingsProps) => {
    const theme = useTheme();

    return (
      <ScrollView
        flex={1}
        backgroundColor="$background"
        contentContainerStyle={{
          padding: 8,
        }}
      >
        <YStack
          backgroundColor="$background"
          padding="$2"
          gap="$4"
          maxWidth={500}
          alignSelf="center"
          width="100%"
        >
          <YStack alignItems="center">
            <H4 color="$color" fontWeight="700">
              表示設定
            </H4>
          </YStack>

          {reviewLimitStatus && !reviewLimitStatus.isPremium && (
            <FreePlanNotice
              title={`本日の復習回数: ${reviewLimitStatus.todayCount}/${reviewLimitStatus.limit}回`}
              message="無料プランでは復習問題は1日1回までです。"
              upgradeText="有料プランで無制限に復習可能に →"
              showWarningIcon={!reviewLimitStatus.isAllowed}
            />
          )}

          <FilterSelect
            label="問題数"
            value={questionCount}
            options={QUESTION_COUNT_OPTIONS}
            onValueChange={onQuestionCountChange}
          />

          <ToggleSwitch checked={isRandom} onToggle={onIsRandomChange} />

          <ToggleSwitch
            checked={excludeRemembered}
            onToggle={onExcludeRememberedChange}
            label="「覚えた」を除外"
            icon="close-circle-outline"
          />

          {!isRandom && (
            <>
              <FilterSelect
                label="「覚えてない」回数"
                value={notRememberedCount}
                options={NOT_REMEMBERED_OPTIONS}
                onValueChange={onNotRememberedCountChange}
              />

              <FilterSelect
                label="最後に解いた日付"
                value={daysSinceLastAttempt}
                options={DAYS_OPTIONS}
                onValueChange={onDaysSinceLastAttemptChange}
              />
            </>
          )}

          <ExerciseCountDisplay count={exerciseCount} />

          <StartReviewButton
            onPress={onStartReview}
            disabled={
              exerciseCount === 0 || (reviewLimitStatus !== null && !reviewLimitStatus.isAllowed)
            }
          />
        </YStack>
      </ScrollView>
    );
  },
);

FilterSettings.displayName = 'FilterSettings';
