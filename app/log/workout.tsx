import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData } from '../../src/context/DataContext';

// Default quick-access templates
const QUICK_TEMPLATES = [
  { id: 'default-0', name: 'Push Day', exercises: 5, emoji: '💪' },
  { id: 'default-1', name: 'Pull Day', exercises: 5, emoji: '🏋️' },
  { id: 'default-2', name: 'Leg Day', exercises: 5, emoji: '🦵' },
  { id: 'default-3', name: 'Upper Body', exercises: 6, emoji: '🎯' },
];

const RECENT_EXERCISES = [
  { id: '1', name: 'Bench Press', muscle: 'Chest', lastWeight: '80kg x 8' },
  { id: '2', name: 'Incline Dumbbell Press', muscle: 'Chest', lastWeight: '30kg x 10' },
  { id: '3', name: 'Overhead Press', muscle: 'Shoulders', lastWeight: '50kg x 6' },
  { id: '4', name: 'Tricep Pushdown', muscle: 'Triceps', lastWeight: '25kg x 12' },
];

// Popular exercises based on user activity
const MOST_POPULAR = [
  { id: '1', name: 'Bench Press', muscle: 'Chest', frequency: 24, trend: 'up' },
  { id: '2', name: 'Squat', muscle: 'Legs', frequency: 22, trend: 'up' },
  { id: '3', name: 'Deadlift', muscle: 'Back', frequency: 18, trend: 'same' },
  { id: '4', name: 'Lat Pulldown', muscle: 'Back', frequency: 16, trend: 'down' },
  { id: '5', name: 'Shoulder Press', muscle: 'Shoulders', frequency: 15, trend: 'up' },
];

export default function LogWorkout() {
  const router = useRouter();
  const { workoutTemplates } = useData();

  // Get templates to display (user templates first, then defaults)
  const displayTemplates = workoutTemplates.length > 0
    ? workoutTemplates.slice(0, 4).map(t => ({
        id: t.id,
        name: t.name,
        exercises: t.exercises.length,
        emoji: '📋',
      }))
    : QUICK_TEMPLATES;

  const handleStartEmpty = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/log/workout-active');
  };

  const handleTemplatePress = (templateId: string, templateName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/log/workout-active',
      params: { templateId, templateName },
    });
  };

  const handleSeeAllTemplates = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/log/workout-templates');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Log Workout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Start Empty Workout */}
        <TouchableOpacity style={styles.startEmptyButton} onPress={handleStartEmpty}>
          <View style={styles.startEmptyIcon}>
            <Ionicons name="add" size={32} color={colors.text.primary} />
          </View>
          <View style={styles.startEmptyContent}>
            <Text style={styles.startEmptyTitle}>Start Empty Workout</Text>
            <Text style={styles.startEmptySubtitle}>Build your workout as you go</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.text.tertiary} />
        </TouchableOpacity>

        {/* Quick Start from Program */}
        <View style={styles.programCard}>
          <View style={styles.programBadge}>
            <Text style={styles.programBadgeText}>FROM YOUR PROGRAM</Text>
          </View>
          <Text style={styles.programTitle}>Push Day - Week 3</Text>
          <Text style={styles.programMeta}>8 exercises · Est. 45 min</Text>
          <TouchableOpacity style={styles.programStartButton}>
            <Text style={styles.programStartText}>Start Workout</Text>
            <Ionicons name="play" size={18} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Templates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Workout Templates</Text>
            <TouchableOpacity onPress={handleSeeAllTemplates}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {displayTemplates.map((template) => (
            <Pressable
              key={template.id}
              style={({ pressed }) => [styles.templateCard, pressed && { opacity: 0.7 }]}
              onPress={() => handleTemplatePress(template.id, template.name)}
            >
              <View style={styles.templateIcon}>
                <Text style={styles.templateEmoji}>{template.emoji}</Text>
              </View>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateMeta}>{template.exercises} exercises</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </Pressable>
          ))}
        </View>

        {/* Most Popular - Adapts to User */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Your Most Popular</Text>
              <View style={styles.adaptiveBadge}>
                <Ionicons name="sparkles" size={12} color={colors.warning.primary} />
                <Text style={styles.adaptiveBadgeText}>Adapts to you</Text>
              </View>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.popularRow}>
              {MOST_POPULAR.map((exercise) => (
                <TouchableOpacity key={exercise.id} style={styles.popularCard}>
                  <View style={styles.popularHeader}>
                    <Text style={styles.popularName}>{exercise.name}</Text>
                    {exercise.trend === 'up' && (
                      <Ionicons name="trending-up" size={16} color={colors.success.primary} />
                    )}
                  </View>
                  <Text style={styles.popularMuscle}>{exercise.muscle}</Text>
                  <Text style={styles.popularFreq}>{exercise.frequency} times</Text>
                  <TouchableOpacity style={styles.popularAddBtn}>
                    <Ionicons name="add" size={18} color={colors.accent.primary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Browse Exercises */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Exercises</Text>
            <TouchableOpacity onPress={() => router.push('/log/exercise-library')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Exercises */}
          <Text style={styles.subSectionTitle}>Recent Exercises</Text>
          {RECENT_EXERCISES.map((exercise) => (
            <Pressable
              key={exercise.id}
              style={({ pressed }) => [styles.exerciseCard, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseMeta}>{exercise.muscle} · Last: {exercise.lastWeight}</Text>
              </View>
              <TouchableOpacity style={styles.addExerciseButton}>
                <Ionicons name="add" size={20} color={colors.accent.primary} />
              </TouchableOpacity>
            </Pressable>
          ))}
        </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  startEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderStyle: 'dashed',
  },
  startEmptyIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  startEmptyContent: {
    flex: 1,
  },
  startEmptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  startEmptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  programCard: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  programBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  programBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  programTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  programMeta: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  programStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  programStartText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
  },
  adaptiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warning.muted,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  adaptiveBadgeText: {
    fontSize: fontSize.xs,
    color: colors.warning.primary,
  },
  popularRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  popularCard: {
    width: 140,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  popularName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  popularMuscle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  popularFreq: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  popularAddBtn: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: colors.accent.primary,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  templateEmoji: {
    fontSize: 24,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  templateMeta: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  subSectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  exerciseMeta: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  addExerciseButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
