import React from 'react';
import { Input, Label, Text, TextArea, YStack } from 'tamagui';

type DiaryTextInputProps = {
  label: string;
  subLabel?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
};

export const DiaryTextInput = React.memo(
  ({
    label,
    subLabel,
    value,
    onChangeText,
    placeholder,
    multiline = false,
  }: DiaryTextInputProps) => {
    return (
      <YStack marginBottom="$4">
        <Label fontSize="$5" fontWeight="bold" lineHeight="$5">
          {label}
        </Label>
        {subLabel && (
          <Text fontSize="$2" color="$placeholderColor" marginBottom="$2" lineHeight="$1">
            {subLabel}
          </Text>
        )}
        {multiline ? (
          <TextArea
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            size="$4"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$3"
            padding="$3"
            backgroundColor="$background"
            height={180}
            numberOfLines={6}
            focusStyle={{
              borderColor: '$borderColorFocus',
            }}
          />
        ) : (
          <Input
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            size="$4"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$3"
            padding="$3"
            backgroundColor="$background"
            focusStyle={{
              borderColor: '$borderColorFocus',
            }}
          />
        )}
      </YStack>
    );
  }
);

DiaryTextInput.displayName = 'DiaryTextInput';
