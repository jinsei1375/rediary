import React, { useEffect, useRef } from 'react';
import { ScrollView } from 'react-native';
import { Button, Dialog, Text, useTheme, XStack, YStack } from 'tamagui';

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
    <Dialog open={visible} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="rgba(0, 0, 0, 0.5)"
        />
        <Dialog.Content
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
          width={340}
          maxWidth="90%"
        >
          <YStack gap="$3" padding="$4">
            <Dialog.Title fontSize="$6" fontWeight="bold" textAlign="center" color="$color">
              年月選択
            </Dialog.Title>

            <XStack gap="$3" height={200}>
              <YStack flex={1}>
                <Text fontSize="$4" marginBottom="$2" color="$color">
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
                      <Button
                        key={year}
                        unstyled
                        onPress={() => onYearChange(year)}
                        padding="$3"
                        marginVertical={2}
                        borderRadius="$3"
                        backgroundColor={selectedYear === year ? '$primary' : 'transparent'}
                        pressStyle={{
                          backgroundColor:
                            selectedYear === year ? '$primaryPress' : '$backgroundPress',
                        }}
                        hoverStyle={{
                          backgroundColor:
                            selectedYear === year ? '$primaryHover' : '$backgroundHover',
                        }}
                      >
                        <Text
                          fontSize="$5"
                          fontWeight={selectedYear === year ? 'bold' : 'normal'}
                          color={selectedYear === year ? '$background' : '$color'}
                          textAlign="center"
                        >
                          {year}
                        </Text>
                      </Button>
                    )
                  )}
                </ScrollView>
              </YStack>

              <YStack flex={1}>
                <Text fontSize="$4" marginBottom="$2" color="$color">
                  月
                </Text>
                <ScrollView
                  ref={monthScrollRef}
                  style={{ flex: 1 }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <Button
                      key={month}
                      unstyled
                      onPress={() => onMonthChange(month)}
                      padding="$3"
                      marginVertical={2}
                      borderRadius="$3"
                      backgroundColor={selectedMonth === month ? '$primary' : 'transparent'}
                      pressStyle={{
                        backgroundColor:
                          selectedMonth === month ? '$primaryPress' : '$backgroundPress',
                      }}
                      hoverStyle={{
                        backgroundColor:
                          selectedMonth === month ? '$primaryHover' : '$backgroundHover',
                      }}
                    >
                      <Text
                        fontSize="$5"
                        fontWeight={selectedMonth === month ? 'bold' : 'normal'}
                        color={selectedMonth === month ? '$background' : '$color'}
                        textAlign="center"
                      >
                        {month}月
                      </Text>
                    </Button>
                  ))}
                </ScrollView>
              </YStack>
            </XStack>

            <XStack gap="$3" marginTop="$2">
              <Button
                flex={1}
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
              <Button
                flex={1}
                onPress={onConfirm}
                backgroundColor="$primary"
                color="$background"
                borderRadius="$3"
                fontWeight="bold"
                pressStyle={{
                  backgroundColor: '$primaryPress',
                }}
                hoverStyle={{
                  backgroundColor: '$primaryHover',
                }}
              >
                決定
              </Button>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
