import { AiButton } from '@/components/common/PrimaryButton';
import { Spinner } from 'tamagui';

type AiCorrectionButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function AiCorrectionButton({ onPress, disabled, loading }: AiCorrectionButtonProps) {
  return (
    <AiButton
      onPress={onPress}
      disabled={disabled || loading}
      icon={loading ? <Spinner color="$background" /> : undefined}
      color="$background"
      size="$4"
      opacity={disabled ? 0.5 : 1}
    >
      {loading ? 'AI添削中...' : 'AI添削'}
    </AiButton>
  );
}
