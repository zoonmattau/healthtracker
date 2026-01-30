import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData, WorkoutTemplate } from '../../src/context/DataContext';

// Default templates for new users
const DEFAULT_TEMPLATES: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'timesUsed'>[] = [
  {
    name: 'Push Day',
    description: 'Chest, shoulders, and triceps',
    estimatedDuration: 60,
    exercises: [
      { id: '1', name: 'Bench Press', muscle: 'Chest', targetSets: 4, targetReps: 8 },
      { id: '2', name: 'Incline Dumbbell Press', muscle: 'Chest', targetSets: 3, targetReps: 10 },
      { id: '3', name: 'Overhead Press', muscle: 'Shoulders', targetSets: 3, targetReps: 8 },
      { id: '4', name: 'Lateral Raise', muscle: 'Shoulders', targetSets: 3, targetReps: 12 },
      { id: '5', name: 'Tricep Pushdown', muscle: 'Triceps', targetSets: 3, targetReps: 12 },
    ],
  },
  {
    name: 'Pull Day',
    description: 'Back and biceps',
    estimatedDuration: 55,
    exercises: [
      { id: '1', name: 'Deadlift', muscle: 'Back', targetSets: 4, targetReps: 5 },
      { id: '2', name: 'Barbell Row', muscle: 'Back', targetSets: 4, targetReps: 8 },
      { id: '3', name: 'Lat Pulldown', muscle: 'Back', targetSets: 3, targetReps: 10 },
      { id: '4', name: 'Face Pull', muscle: 'Back', targetSets: 3, targetReps: 15 },
      { id: '5', name: 'Barbell Curl', muscle: 'Biceps', targetSets: 3, targetReps: 10 },
    ],
  },
  {
    name: 'Leg Day',
    description: 'Quadriceps, hamstrings, and glutes',
    estimatedDuration: 65,
    exercises: [
      { id: '1', name: 'Squat', muscle: 'Quadriceps', targetSets: 4, targetReps: 6 },
      { id: '2', name: 'Romanian Deadlift', muscle: 'Hamstrings', targetSets: 4, targetReps: 8 },
      { id: '3', name: 'Leg Press', muscle: 'Quadriceps', targetSets: 3, targetReps: 10 },
      { id: '4', name: 'Leg Curl', muscle: 'Hamstrings', targetSets: 3, targetReps: 12 },
      { id: '5', name: 'Standing Calf Raise', muscle: 'Calves', targetSets: 4, targetReps: 15 },
    ],
  },
  {
    name: 'Upper Body',
    description: 'Full upper body workout',
    estimatedDuration: 70,
    exercises: [
      { id: '1', name: 'Bench Press', muscle: 'Chest', targetSets: 4, targetReps: 8 },
      { id: '2', name: 'Barbell Row', muscle: 'Back', targetSets: 4, targetReps: 8 },
      { id: '3', name: 'Overhead Press', muscle: 'Shoulders', targetSets: 3, targetReps: 10 },
      { id: '4', name: 'Pull-Up', muscle: 'Back', targetSets: 3, targetReps: 8 },
      { id: '5', name: 'Dumbbell Curl', muscle: 'Biceps', targetSets: 2, targetReps: 12 },
      { id: '6', name: 'Tricep Pushdown', muscle: 'Triceps', targetSets: 2, targetReps: 12 },
    ],
  },
  {
    name: 'Full Body',
    description: 'Complete full body workout',
    estimatedDuration: 75,
    exercises: [
      { id: '1', name: 'Squat', muscle: 'Quadriceps', targetSets: 3, targetReps: 8 },
      { id: '2', name: 'Bench Press', muscle: 'Chest', targetSets: 3, targetReps: 8 },
      { id: '3', name: 'Barbell Row', muscle: 'Back', targetSets: 3, targetReps: 8 },
      { id: '4', name: 'Overhead Press', muscle: 'Shoulders', targetSets: 3, targetReps: 10 },
      { id: '5', name: 'Romanian Deadlift', muscle: 'Hamstrings', targetSets: 3, targetReps: 10 },
      { id: '6', name: 'Plank', muscle: 'Core', targetSets: 3, targetReps: 60 },
    ],
  },
];

export default function WorkoutTemplates() {
  const router = useRouter();
  const { workoutTemplates, saveTemplate, deleteTemplate } = useData();
  const [showDefaults, setShowDefaults] = useState(true);

  // Combine user templates with default templates
  const allTemplates = showDefaults
    ? [...workoutTemplates, ...DEFAULT_TEMPLATES.map((t, i) => ({
        ...t,
        id: `default-${i}`,
        createdAt: '',
        timesUsed: 0,
        isDefault: true,
      }))]
    : workoutTemplates;

  const handleSelectTemplate = (template: WorkoutTemplate & { isDefault?: boolean }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/log/workout-active',
      params: { templateId: template.id, templateName: template.name },
    });
  };

  const handleDeleteTemplate = (template: WorkoutTemplate & { isDefault?: boolean }) => {
    if (template.isDefault) {
      Alert.alert('Cannot Delete', 'Default templates cannot be deleted.');
      return;
    }

    Alert.alert(
      'Delete Template?',
      `Are you sure you want to delete "${template.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTemplate(template.id),
        },
      ]
    );
  };

  const handleSaveDefaultAsCustom = async (template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'timesUsed'>) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveTemplate(template);
    Alert.alert('Saved', `"${template.name}" has been saved to your templates.`);
  };

  const renderTemplate = ({ item }: { item: WorkoutTemplate & { isDefault?: boolean } }) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => handleSelectTemplate(item)}
      onLongPress={() => handleDeleteTemplate(item)}
    >
      <View style={styles.templateHeader}>
        <View style={styles.templateTitleRow}>
          <Text style={styles.templateName}>{item.name}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        {!item.isDefault && item.timesUsed > 0 && (
          <Text style={styles.usageText}>Used {item.timesUsed}x</Text>
        )}
      </View>

      {item.description && (
        <Text style={styles.templateDescription}>{item.description}</Text>
      )}

      <View style={styles.templateMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="barbell-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.metaText}>{item.exercises.length} exercises</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.metaText}>~{item.estimatedDuration} min</Text>
        </View>
      </View>

      <View style={styles.exercisePreview}>
        {item.exercises.slice(0, 3).map((exercise, idx) => (
          <Text key={idx} style={styles.exercisePreviewText}>
            • {exercise.name} ({exercise.targetSets}×{exercise.targetReps})
          </Text>
        ))}
        {item.exercises.length > 3 && (
          <Text style={styles.moreText}>+{item.exercises.length - 3} more</Text>
        )}
      </View>

      <View style={styles.templateActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleSelectTemplate(item)}
        >
          <Ionicons name="play" size={18} color={colors.accent.primary} />
          <Text style={styles.actionButtonText}>Start Workout</Text>
        </TouchableOpacity>
        {item.isDefault && (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => handleSaveDefaultAsCustom(item)}
          >
            <Ionicons name="bookmark-outline" size={18} color={colors.text.secondary} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Save</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Workout Templates</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/log/create-template')}
        >
          <Ionicons name="add" size={24} color={colors.accent.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Toggle */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, !showDefaults && styles.filterChipInactive]}
          onPress={() => setShowDefaults(true)}
        >
          <Text style={[styles.filterChipText, !showDefaults && styles.filterChipTextInactive]}>
            All Templates
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, showDefaults && styles.filterChipInactive]}
          onPress={() => setShowDefaults(false)}
        >
          <Text style={[styles.filterChipText, showDefaults && styles.filterChipTextInactive]}>
            My Templates ({workoutTemplates.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Template List */}
      <FlatList
        data={allTemplates}
        keyExtractor={(item) => item.id}
        renderItem={renderTemplate}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>No custom templates yet</Text>
            <Text style={styles.emptySubtext}>
              Create your own template or save a default one
            </Text>
          </View>
        }
      />

      {/* Quick Start Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.quickStartButton}
          onPress={() => router.push('/log/workout-active')}
        >
          <Ionicons name="flash" size={20} color={colors.text.primary} />
          <Text style={styles.quickStartText}>Quick Start (Empty Workout)</Text>
        </TouchableOpacity>
      </View>
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  createButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  filterChipInactive: {
    backgroundColor: colors.background.secondary,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  filterChipTextInactive: {
    color: colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  templateCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  templateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  templateName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  defaultBadge: {
    backgroundColor: colors.accent.muted,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  defaultBadgeText: {
    fontSize: fontSize.xs,
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
  },
  usageText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  templateDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  templateMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  exercisePreview: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  exercisePreviewText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  moreText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  templateActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent.muted,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  actionButtonSecondary: {
    backgroundColor: colors.background.tertiary,
    flex: 0,
    paddingHorizontal: spacing.md,
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.accent.primary,
  },
  actionButtonTextSecondary: {
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  quickStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  quickStartText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
});
