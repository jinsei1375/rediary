import { Button, Spinner } from 'tamagui';

type AiCorrectionButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function AiCorrectionButton({ onPress, disabled, loading }: AiCorrectionButtonProps) {
  return (
    <Button
      onPress={onPress}
      disabled={disabled || loading}
      icon={loading ? <Spinner color="$background" /> : undefined}
      backgroundColor="$primary"
      color="$background"
      size="$4"
      opacity={disabled ? 0.5 : 1}
      pressStyle={{
        backgroundColor: '$primaryPress',
      }}
      hoverStyle={{
        backgroundColor: '$primaryHover',
      }}
    >
      {loading ? 'AI添削中...' : 'AI添削'}
    </Button>
  );
}
