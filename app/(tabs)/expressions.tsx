import { Header } from '@/components/common/Header';
import { Loading } from '@/components/common/Loading';
import { DeleteExpressionDialog } from '@/components/expressions/DeleteExpressionDialog';
import { EditExpressionDialog } from '@/components/expressions/EditExpressionDialog';
import { ExpressionList } from '@/components/expressions/ExpressionList';
import { useAuth } from '@/contexts/AuthContext';
import { TranslationExerciseService } from '@/services/translationExerciseService';
import type { TranslationExercise, TranslationExerciseUpdate } from '@/types/database';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { YStack } from 'tamagui';

export default function ExpressionsScreen() {
  const { user } = useAuth();
  const [expressions, setExpressions] = useState<TranslationExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedExpression, setSelectedExpression] = useState<TranslationExercise | null>(null);

  const loadExpressions = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    const { data, error } = await TranslationExerciseService.getByUser(user.id);
    if (error) {
      console.error('Error loading expressions:', error);
      showErrorToast('表現の読み込みに失敗しました');
    } else {
      setExpressions(data ?? []);
    }
    setIsLoading(false);
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;
      loadExpressions();

      return () => {
        isCancelled = true;
      };
    }, [loadExpressions]),
  );

  const handleEdit = useCallback((expression: TranslationExercise) => {
    setSelectedExpression(expression);
    setEditDialogVisible(true);
  }, []);

  const handleDelete = useCallback((expression: TranslationExercise) => {
    setSelectedExpression(expression);
    setDeleteDialogVisible(true);
  }, []);

  const handleSaveEdit = useCallback(
    async (updates: TranslationExerciseUpdate) => {
      if (!user?.id || !selectedExpression) return;

      // 楽観的更新：UIを先に更新
      const updatedExpression = { ...selectedExpression, ...updates };
      setExpressions((prev) =>
        prev.map((expr) => (expr.id === selectedExpression.id ? updatedExpression : expr)),
      );

      // ダイアログを即座に閉じる
      setEditDialogVisible(false);

      const { error } = await TranslationExerciseService.update(
        selectedExpression.id,
        updates,
        user.id,
      );

      if (error) {
        console.error('Error updating expression:', error);
        showErrorToast('更新に失敗しました');
        // エラー時は元に戻す
        setExpressions((prev) =>
          prev.map((expr) => (expr.id === selectedExpression.id ? selectedExpression : expr)),
        );
      } else {
        showSuccessToast('表現を更新しました');
      }
    },
    [user?.id, selectedExpression],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!user?.id || !selectedExpression) return;

    // 楽観的更新：UIから先に削除
    setExpressions((prev) => prev.filter((expr) => expr.id !== selectedExpression.id));

    // ダイアログを即座に閉じる
    setDeleteDialogVisible(false);

    const { error } = await TranslationExerciseService.delete(selectedExpression.id, user.id);

    if (error) {
      console.error('Error deleting expression:', error);
      showErrorToast('削除に失敗しました');
      // エラー時は元に戻す
      setExpressions((prev) =>
        [...prev, selectedExpression].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      );
    } else {
      showSuccessToast('表現を削除しました');
    }
  }, [user?.id, selectedExpression]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <YStack flex={1} backgroundColor="$bgPrimary">
      <Header title="ネイティブ表現" showBackButton={false} />
      <ExpressionList expressions={expressions} onEdit={handleEdit} onDelete={handleDelete} />

      {selectedExpression && (
        <>
          <EditExpressionDialog
            visible={editDialogVisible}
            onClose={() => setEditDialogVisible(false)}
            onSave={handleSaveEdit}
            initialNativeText={selectedExpression.native_text}
            initialTargetText={selectedExpression.target_text || ''}
          />

          <DeleteExpressionDialog
            visible={deleteDialogVisible}
            onClose={() => setDeleteDialogVisible(false)}
            onDelete={handleConfirmDelete}
            expressionText={selectedExpression.native_text}
            translationText={selectedExpression.target_text || ''}
          />
        </>
      )}
    </YStack>
  );
}
