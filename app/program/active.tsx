import { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData } from '../../src/context/DataContext';
import { getProgramById } from '../../src/data/programs';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_NAMES_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ActiveProgram() {
  const router = useRouter();
  const { activeProgram, endProgram, completeWorkout, getProgramProgress } = useData();

  const program = useMemo(() => {
    if (!activeProgram) return null;
    return getProgramById(activeProgram.programId);
  }, [activeProgram]);

  if (!activeProgram || !program) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Active Program</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Active Program</Text>
          <Text style={styles.emptySubtitle}>Start a training program to see your schedule here</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/program')}
          >
            <Text style={styles.browseButtonText}>Browse Programs</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentWeekData = program.weeks.find(w => w.weekNumber === activeProgram.currentWeek);
  const progress = getProgramProgress();

  const handleStartWorkout = (dayOfWeek: number, workoutName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const workout = currentWeekData?.workouts.find(w => w.dayOfWeek === dayOfWeek);
    if (!workout || workout.isRestDay) return;

    // Navigate to workout-active with the program workout data
    router.push({
      pathname: '/log/workout-active',
      params: {
        programWorkout: JSON.stringify({
          week: activeProgram.currentWeek,
          day: dayOfWeek,
          name: workoutName,
          exercises: workout.exercises,
        }),
      },
    });
  };

  const handleCompleteWorkout = async (week: number, day: number) => {
    await completeWorkout(week, day);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const isWorkoutCompleted = (week: number, day: number) => {
    return activeProgram.completedWorkouts.includes(`${week}-${day}`);
  };

  const handleEndProgram = () => {
    Alert.alert(
      'End Program',
      'Are you sure you want to end this program? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Program',
          style: 'destructive',
          onPress: async () => {
            await endProgram();
            router.back();
          },
        },
      ]
    );
  };

  const handleChangeWeek = (delta: number) => {
    const newWeek = activeProgram.currentWeek + delta;
    if (newWeek >= 1 && newWeek <= program.durationWeeks) {
      // In a real app, we'd update the current week
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Get today's day of week (0 = Monday in our system)
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1; // Convert Sunday=0 to Monday=0

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{program.name}</Text>
        <TouchableOpacity onPress={handleEndProgram}>
          <Ionicons name="close-circle-outline" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Overview */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressPercent}>{progress.percentComplete}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress.percentComplete}%` }]} />
          </View>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>{progress.completedWorkouts}</Text>
              <Text style={styles.progressStatLabel}>Workouts Done</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>
                {activeProgram.currentWeek}/{program.durationWeeks}
              </Text>
              <Text style={styles.progressStatLabel}>Weeks</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>{program.daysPerWeek}</Text>
              <Text style={styles.progressStatLabel}>Days/Week</Text>
            </View>
          </View>
        </View>

        {/* Week Selector */}
        <View style={styles.weekSelector}>
          <TouchableOpacity
            style={[styles.weekArrow, activeProgram.currentWeek <= 1 && styles.weekArrowDisabled]}
            onPress={() => handleChangeWeek(-1)}
            disabled={activeProgram.currentWeek <= 1}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={activeProgram.currentWeek <= 1 ? colors.text.tertiary : colors.text.primary}
            />
          </TouchableOpacity>
          <View style={styles.weekInfo}>
            <Text style={styles.weekLabel}>WEEK</Text>
            <Text style={styles.weekNumber}>{activeProgram.currentWeek}</Text>
          </View>
          <TouchableOpacity
            style={[styles.weekArrow, activeProgram.currentWeek >= program.durationWeeks && styles.weekArrowDisabled]}
            onPress={() => handleChangeWeek(1)}
            disabled={activeProgram.currentWeek >= program.durationWeeks}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={activeProgram.currentWeek >= program.durationWeeks ? colors.text.tertiary : colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Weekly Schedule */}
        <Text style={styles.scheduleTitle}>This Week's Schedule</Text>
        <View style={styles.schedule}>
          {currentWeekData?.workouts.map((workout, index) => {
            const isCompleted = isWorkoutCompleted(activeProgram.currentWeek, workout.dayOfWeek);
            const isToday = workout.dayOfWeek === todayIndex;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.workoutCard,
                  isToday && styles.workoutCardToday,
                  isCompleted && styles.workoutCardCompleted,
                  workout.isRestDay && styles.workoutCardRest,
                ]}
                onPress={() => {
                  if (!workout.isRestDay && !isCompleted) {
                    handleStartWorkout(workout.dayOfWeek, workout.name);
                  }
                }}
                disabled={workout.isRestDay}
              >
                <View style={styles.workoutDay}>
                  <Text style={[styles.workoutDayText, isToday && styles.workoutDayTextToday]}>
                    {DAY_NAMES[workout.dayOfWeek]}
                  </Text>
                  {isToday && <View style={styles.todayDot} />}
                </View>

                <View style={styles.workoutInfo}>
                  <Text
                    style={[
                      styles.workoutName,
                      workout.isRestDay && styles.workoutNameRest,
                      isCompleted && styles.workoutNameCompleted,
                    ]}
                  >
                    {workout.name}
                  </Text>
                  {!workout.isRestDay && (
                    <Text style={styles.workoutExercises}>
                      {workout.exercises.length} exercises
                    </Text>
                  )}
                </View>

                {isCompleted ? (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.success.primary} />
                  </View>
                ) : !workout.isRestDay ? (
                  <Ionicons name="play-circle" size={28} color={colors.accent.primary} />
                ) : (
                  <Ionicons name="bed-outline" size={24} color={colors.text.tertiary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Today's Workout Details */}
        {currentWeekData?.workouts[todayIndex] && !currentWeekData.workouts[todayIndex].isRestDay && (
          <View style={styles.todaySection}>
            <Text style={styles.todaySectionTitle}>Today's Workout</Text>
            <View style={styles.todayCard}>
              <Text style={styles.todayWorkoutName}>
                {currentWeekData.workouts[todayIndex].name}
              </Text>
              <View style={styles.todayExercises}>
                {currentWeekData.workouts[todayIndex].exercises.slice(0, 5).map((ex, idx) => (
                  <View key={idx} style={styles.exercisePreview}>
                    <Text style={styles.exercisePreviewName}>{ex.name}</Text>
                    <Text style={styles.exercisePreviewSets}>
                      {ex.targetSets}×{ex.targetReps}
                    </Text>
                  </View>
                ))}
                {currentWeekData.workouts[todayIndex].exercises.length > 5 && (
                  <Text style={styles.moreExercises}>
                    +{currentWeekData.workouts[todayIndex].exercises.length - 5} more
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.startWorkoutButton}
                onPress={() =>
                  handleStartWorkout(todayIndex, currentWeekData.workouts[todayIndex].name)
                }
              >
                <Ionicons name="play" size={20} color={colors.text.primary} />
                <Text style={styles.startWorkoutText}>Start Workout</Text>
              </TouchableOpacity>
            </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  browseButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  browseButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  progressCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  progressPercent: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.accent.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: 4,
    marginBottom: spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  progressStatLabel: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.lg,
  },
  weekArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekArrowDisabled: {
    opacity: 0.5,
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    letterSpacing: 1,
  },
  weekNumber: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  scheduleTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  schedule: {
    marginBottom: spacing.xl,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  workoutCardToday: {
    borderWidth: 2,
    borderColor: colors.accent.primary,
  },
  workoutCardCompleted: {
    backgroundColor: colors.success.muted,
  },
  workoutCardRest: {
    backgroundColor: colors.background.tertiary,
    opacity: 0.7,
  },
  workoutDay: {
    width: 44,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  workoutDayText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
  },
  workoutDayTextToday: {
    color: colors.accent.primary,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.primary,
    marginTop: spacing.xs,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  workoutNameRest: {
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  workoutNameCompleted: {
    color: colors.success.primary,
  },
  workoutExercises: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  completedBadge: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todaySection: {
    marginBottom: spacing.xxl,
  },
  todaySectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  todayCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  todayWorkoutName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  todayExercises: {
    marginBottom: spacing.lg,
  },
  exercisePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  exercisePreviewName: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  exercisePreviewSets: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  moreExercises: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingTop: spacing.sm,
    fontStyle: 'italic',
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  startWorkoutText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
});
