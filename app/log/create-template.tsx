import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData, TemplateExercise } from '../../src/context/DataContext';
import { useExerciseSelection } from '../../src/context/ExerciseSelectionContext';
import { MUSCLE_LABELS } from '../../src/data/exercises';

export default function CreateTemplate() {
  const router = useRouter();
  const { saveTemplate } = useData();
  const { pendingExercise, setPendingExercise } = useExerciseSelection();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<TemplateExercise[]>([]);
  const nextExerciseId = useState(1);

  // Handle adding exercise when returning from exercise library
  useFocusEffect(
    useCallback(() => {
      if (pendingExercise) {
        const newExercise: TemplateExercise = {
          id: String(Date.now()),
          name: pendingExercise.name,
          muscle: MUSCLE_LABELS[pendingExercise.muscle] || pendingExercise.muscle,
          targetSets: 3,
          targetReps: 10,
        };
        setExercises(prev => [...prev, newExercise]);
        setPendingExercise(null);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, [pendingExercise, setPendingExercise])
  );

  const updateExercise = (id: string, field: 'targetSets' | 'targetReps', value: number) => {
    setExercises(prev =>
      prev.map(ex => (ex.id === id ? { ...ex, [field]: Math.max(1, value) } : ex))
    );
  };

  const removeExercise = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter a name for your template.');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Exercises Required', 'Please add at least one exercise to your template.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Estimate duration: 5 min per exercise + 1 min per set
    const totalSets = exercises.reduce((sum, ex) => sum + ex.targetSets, 0);
    const estimatedDuration = exercises.length * 5 + totalSets;

    await saveTemplate({
      name: name.trim(),
      description: description.trim() || undefined,
      exercises,
      estimatedDuration,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Template</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Template Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Template Details</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Template Name"
              placeholderTextColor={colors.text.tertiary}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.text.tertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        {/* Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises ({exercises.length})</Text>

          {exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseMuscle}>{exercise.muscle}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeExercise(exercise.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.error.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.exerciseConfig}>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Sets</Text>
                  <View style={styles.configControls}>
                    <TouchableOpacity
                      style={styles.configButton}
                      onPress={() => updateExercise(exercise.id, 'targetSets', exercise.targetSets - 1)}
                    >
                      <Text style={styles.configButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.configValue}>{exercise.targetSets}</Text>
                    <TouchableOpacity
                      style={styles.configButton}
                      onPress={() => updateExercise(exercise.id, 'targetSets', exercise.targetSets + 1)}
                    >
                      <Text style={styles.configButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Target Reps</Text>
                  <View style={styles.configControls}>
                    <TouchableOpacity
                      style={styles.configButton}
                      onPress={() => updateExercise(exercise.id, 'targetReps', exercise.targetReps - 1)}
                    >
                      <Text style={styles.configButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.configValue}>{exercise.targetReps}</Text>
                    <TouchableOpacity
                      style={styles.configButton}
                      onPress={() => updateExercise(exercise.id, 'targetReps', exercise.targetReps + 1)}
                    >
                      <Text style={styles.configButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {/* Add Exercise Button */}
          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={() => router.push('/log/exercise-library?mode=add')}
          >
            <Ionicons name="add-circle" size={24} color={colors.accent.primary} />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        {exercises.length === 0 && (
          <View style={styles.tipsCard}>
            <Ionicons name="bulb-outline" size={20} color={colors.warning.primary} />
            <Text style={styles.tipsText}>
              Add exercises to create your custom workout template. You can adjust sets and reps for each exercise.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  saveButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  exerciseCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  exerciseNumberText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.accent.primary,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  exerciseMuscle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  removeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseConfig: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  configItem: {
    flex: 1,
  },
  configLabel: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  configControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  configButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  configButtonText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.accent.primary,
  },
  configValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderStyle: 'dashed',
  },
  addExerciseText: {
    fontSize: fontSize.md,
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
  },
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.warning.muted,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  tipsText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
