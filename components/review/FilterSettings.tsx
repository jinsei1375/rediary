import React from 'react';
import { H4, ScrollView, Text, YStack, useTheme } from 'tamagui';
import { ExerciseCountDisplay } from './ExerciseCountDisplay';
import { FilterSelect } from './FilterSelect';
import { RandomToggle } from './RandomToggle';
import { StartReviewButton } from './StartReviewButton';

type FilterSettingsProps = {
  isRandom: boolean;
  notRememberedCount: number;
  daysSinceLastAttempt: number;
  exerciseCount: number;
  onIsRandomChange: (value: boolean) => void;
  onNotRememberedCountChange: (value: number) => void;
  onDaysSinceLastAttemptChange: (value: number) => void;
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

export const FilterSettings = React.memo(
  ({
    isRandom,
    notRememberedCount,
    daysSinceLastAttempt,
    exerciseCount,
    onIsRandomChange,
    onNotRememberedCountChange,
    onDaysSinceLastAttemptChange,
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
          <YStack alignItems="center" gap="$2">
            <H4 color="$color">表示設定</H4>
            <Text fontSize="$3" color="$gray11" textAlign="center">
              復習する問題の条件を選択してください
            </Text>
          </YStack>

          <RandomToggle isRandom={isRandom} onToggle={onIsRandomChange} />

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

          <StartReviewButton onPress={onStartReview} disabled={exerciseCount === 0} />
        </YStack>
      </ScrollView>
    );
  },
);

FilterSettings.displayName = 'FilterSettings';
