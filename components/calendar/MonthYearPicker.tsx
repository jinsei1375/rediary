import React, { useEffect, useRef } from 'react';
import { Modal, Pressable, ScrollView } from 'react-native';
import { Text, useTheme, XStack, YStack } from 'tamagui';

type MonthYearPickerProps = {
  visible: boolean;
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export const MonthYearPicker = ({
  visible,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  onConfirm,
  onCancel,
}: MonthYearPickerProps) => {
  const theme = useTheme();
  const yearScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      const ITEM_HEIGHT = 48;
      const currentYear = new Date().getFullYear();
      const yearIndex = selectedYear - (currentYear - 5);
      const monthIndex = selectedMonth - 1;

      setTimeout(() => {
        yearScrollRef.current?.scrollTo({
          y: yearIndex * ITEM_HEIGHT - 76,
          animated: false,
        });
        monthScrollRef.current?.scrollTo({
          y: monthIndex * ITEM_HEIGHT - 76,
          animated: false,
        });
      }, 10);
    }
  }, [visible, selectedYear, selectedMonth]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        onPress={onCancel}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <YStack
            backgroundColor="$background"
            borderRadius="$4"
            padding="$4"
            width={340}
            maxWidth="90%"
            gap="$3"
          >
            <Text fontSize="$6" fontWeight="bold" textAlign="center">
              年月選択
            </Text>

            <XStack gap="$3" height={200}>
              <YStack flex={1}>
                <Text fontSize="$4" marginBottom="$2">
                  年
                </Text>
                <ScrollView
                  ref={yearScrollRef}
                  style={{ flex: 1 }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                >
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 5 + i).map(
                    (year) => (
                      <Pressable key={year} onPress={() => onYearChange(year)}>
                        <YStack
                          padding="$3"
                          marginVertical={2}
                          borderRadius="$3"
                          backgroundColor={
                            selectedYear === year ? theme.primary.get() : 'transparent'
                          }
                          alignItems="center"
                        >
                          <Text
                            fontSize="$5"
                            fontWeight={selectedYear === year ? 'bold' : 'normal'}
                            color={selectedYear === year ? '$background' : theme.color.get()}
                          >
                            {year}
                          </Text>
                        </YStack>
                      </Pressable>
                    )
                  )}
                </ScrollView>
              </YStack>

              <YStack flex={1}>
                <Text fontSize="$4" marginBottom="$2">
                  月
                </Text>
                <ScrollView
                  ref={monthScrollRef}
                  style={{ flex: 1 }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <Pressable key={month} onPress={() => onMonthChange(month)}>
                      <YStack
                        padding="$3"
                        marginVertical={2}
                        borderRadius="$3"
                        backgroundColor={
                          selectedMonth === month ? theme.primary.get() : 'transparent'
                        }
                        alignItems="center"
                      >
                        <Text
                          fontSize="$5"
                          fontWeight={selectedMonth === month ? 'bold' : 'normal'}
                          color={selectedMonth === month ? '$background' : theme.color.get()}
                        >
                          {month}月
                        </Text>
                      </YStack>
                    </Pressable>
                  ))}
                </ScrollView>
              </YStack>
            </XStack>

            <XStack gap="$3" marginTop="$2">
              <Pressable onPress={onCancel} style={{ flex: 1 }}>
                <YStack
                  backgroundColor="$backgroundHover"
                  padding="$3"
                  borderRadius="$3"
                  alignItems="center"
                >
                  <Text fontSize="$4">キャンセル</Text>
                </YStack>
              </Pressable>
              <Pressable onPress={onConfirm} style={{ flex: 1 }}>
                <YStack
                  backgroundColor={theme.primary.get()}
                  padding="$3"
                  borderRadius="$3"
                  alignItems="center"
                >
                  <Text fontSize="$4" color="$background" fontWeight="bold">
                    決定
                  </Text>
                </YStack>
              </Pressable>
            </XStack>
          </YStack>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
