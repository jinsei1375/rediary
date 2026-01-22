import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Adapt, Select, Sheet, Text, YStack, useTheme } from 'tamagui';

type FilterSelectProps = {
  label: string;
  value: number;
  options: Array<{ label: string; value: number }>;
  onValueChange: (value: number) => void;
};

export const FilterSelect = React.memo(
  ({ label, value, options, onValueChange }: FilterSelectProps) => {
    const theme = useTheme();

    return (
      <YStack gap="$3">
        <Text fontSize="$4" fontWeight="600" color="$color">
          {label}
        </Text>
        <Select value={value.toString()} onValueChange={(val) => onValueChange(parseInt(val, 10))}>
          <Select.Trigger
            borderColor="$borderColor"
            backgroundColor="$background"
            height="$5"
            iconAfter={<Ionicons name="chevron-down" size={20} color={theme.color.get()} />}
          >
            <Select.Value placeholder="選択してください" />
          </Select.Trigger>

          <Adapt when="sm" platform="touch">
            <Sheet modal dismissOnSnapToBottom>
              <Sheet.Frame
                backgroundColor="$gray2"
                borderTopLeftRadius="$6"
                borderTopRightRadius="$6"
                paddingTop="$4"
                paddingBottom="$8"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <Sheet.ScrollView>
                  <Adapt.Contents />
                </Sheet.ScrollView>
              </Sheet.Frame>
              <Sheet.Overlay backgroundColor="rgba(0, 0, 0, 0.5)" />
            </Sheet>
          </Adapt>

          <Select.Content zIndex={200000}>
            <Select.Viewport>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value.toString()}
                  index={option.value}
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select>
      </YStack>
    );
  },
);

FilterSelect.displayName = 'FilterSelect';
