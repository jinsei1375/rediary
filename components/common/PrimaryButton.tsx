import type { ButtonProps } from 'tamagui';
import { Button, Text, YStack } from 'tamagui';
import { ButtonLoadingOverlay } from './ButtonLoadingOverlay';

type BaseButtonProps = Omit<ButtonProps, 'children'> & {
  children: React.ReactNode;
};

const BaseButton = ({ children, pressStyle, animation = 'quick', ...props }: BaseButtonProps) => {
  return (
    <Button
      animation={animation}
      fontWeight="bold"
      pressStyle={{
        scale: 0.98,
        ...pressStyle,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

// メインアクションボタン（btnPrimaryBg）
export const PrimaryButton = ({ children, pressStyle, ...props }: BaseButtonProps) => {
  return (
    <BaseButton
      backgroundColor="$btnPrimaryBg"
      color="$btnPrimaryText"
      pressStyle={{
        backgroundColor: '$btnPrimaryBg',
        ...pressStyle,
      }}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

// AI添削ボタン（purple）
export const AiButton = ({ children, pressStyle, ...props }: BaseButtonProps) => {
  return (
    <BaseButton
      backgroundColor="$purple10"
      pressStyle={{
        backgroundColor: '$purple10',
        ...pressStyle,
      }}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

// 復習開始・結果画面ボタン（blue）
export const ActionButton = ({ children, pressStyle, ...props }: BaseButtonProps) => {
  return (
    <BaseButton
      backgroundColor="$blue10"
      pressStyle={{
        backgroundColor: '$blue10',
        ...pressStyle,
      }}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

// モーダル内のボタン
type ModalButtonVariant = 'primary' | 'secondary';
type ModalButtonProps = Omit<BaseButtonProps, 'variant'> & { variant?: ModalButtonVariant };

export const ModalButton = ({
  children,
  variant = 'primary' as ModalButtonVariant,
  pressStyle,
  ...props
}: ModalButtonProps) => {
  const backgroundColor = variant === 'primary' ? '$blue10' : '$btnCancelBg';
  const color = variant === 'primary' ? '$btnPrimaryText' : '$btnCancelText';

  return (
    <BaseButton
      backgroundColor={backgroundColor}
      color={color}
      pressStyle={{
        backgroundColor,
        ...pressStyle,
      }}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

// 保存ボタン（状態によって色が変わる）
type SaveButtonProps = Omit<BaseButtonProps, 'children'> & {
  loading?: boolean;
  onPress: () => void;
};

export const SaveButton = ({
  loading = false,
  disabled = false,
  pressStyle,
  ...props
}: SaveButtonProps) => {
  return (
    <YStack position="relative" height="$5" {...props}>
      <BaseButton
        size="$5"
        borderRadius="$3"
        backgroundColor="$primary"
        disabled={loading || disabled}
        opacity={disabled ? 0.5 : 1}
        pressStyle={{
          backgroundColor: '$primaryPress',
          ...pressStyle,
        }}
        onPress={props.onPress}
      >
        <Text color="$background" fontWeight="bold">
          保存
        </Text>
      </BaseButton>
      <ButtonLoadingOverlay visible={loading} />
    </YStack>
  );
};

// グレーボタン（過去の解答表示など）
export const SecondaryButton = ({ children, pressStyle, ...props }: BaseButtonProps) => {
  return (
    <BaseButton
      backgroundColor="$gray3"
      borderColor="$gray7"
      borderWidth={1}
      pressStyle={{
        backgroundColor: '$gray3',
        ...pressStyle,
      }}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

// 成功ボタン（覚えた）
export const SuccessButton = ({ children, pressStyle, ...props }: BaseButtonProps) => {
  return (
    <BaseButton
      backgroundColor="$green2"
      borderColor="$green7"
      borderWidth={1.5}
      pressStyle={{
        backgroundColor: '$green2',
        ...pressStyle,
      }}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

// エラーボタン（覚えてない）
export const ErrorButton = ({ children, pressStyle, ...props }: BaseButtonProps) => {
  return (
    <BaseButton
      backgroundColor="$red2"
      borderColor="$red7"
      borderWidth={1.5}
      pressStyle={{
        backgroundColor: '$red2',
        ...pressStyle,
      }}
      {...props}
    >
      {children}
    </BaseButton>
  );
};
