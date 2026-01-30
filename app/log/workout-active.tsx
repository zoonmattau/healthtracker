import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData, WorkoutExercise, ExerciseSet } from '../../src/context/DataContext';
import { useRestTimer } from '../../src/context/RestTimerContext';
import { useExerciseSelection } from '../../src/context/ExerciseSelectionContext';
import { MUSCLE_LABELS } from '../../src/data/exercises';
import RestTimerOverlay from '../../src/components/RestTimerOverlay';

interface LocalWorkoutSet extends ExerciseSet {
  previous?: { weight: number; reps: number };
}

interface LocalExercise {
  id: string;
  name: string;
  muscle: string;
  sets: LocalWorkoutSet[];
  previousBest?: { weight: number; reps: number };
}

// Simulated previous workout data - in real app this would come from workoutHistory
const PREVIOUS_DATA: Record<string, { weight: number; reps: number }> = {
  'Bench Press': { weight: 80, reps: 8 },
  'Incline Dumbbell Press': { weight: 30, reps: 10 },
  'Overhead Press': { weight: 50, reps: 6 },
  'Cable Fly': { weight: 15, reps: 12 },
};

// Default templates data (matches workout-templates.tsx)
const DEFAULT_TEMPLATES_DATA: Record<string, { name: string; exercises: Array<{ name: string; muscle: string; sets: number; reps: number }> }> = {
  'default-0': {
    name: 'Push Day',
    exercises: [
      { name: 'Bench Press', muscle: 'Chest', sets: 4, reps: 8 },
      { name: 'Incline Dumbbell Press', muscle: 'Chest', sets: 3, reps: 10 },
      { name: 'Overhead Press', muscle: 'Shoulders', sets: 3, reps: 8 },
      { name: 'Lateral Raise', muscle: 'Shoulders', sets: 3, reps: 12 },
      { name: 'Tricep Pushdown', muscle: 'Triceps', sets: 3, reps: 12 },
    ],
  },
  'default-1': {
    name: 'Pull Day',
    exercises: [
      { name: 'Deadlift', muscle: 'Back', sets: 4, reps: 5 },
      { name: 'Barbell Row', muscle: 'Back', sets: 4, reps: 8 },
      { name: 'Lat Pulldown', muscle: 'Back', sets: 3, reps: 10 },
      { name: 'Face Pull', muscle: 'Back', sets: 3, reps: 15 },
      { name: 'Barbell Curl', muscle: 'Biceps', sets: 3, reps: 10 },
    ],
  },
  'default-2': {
    name: 'Leg Day',
    exercises: [
      { name: 'Squat', muscle: 'Quadriceps', sets: 4, reps: 6 },
      { name: 'Romanian Deadlift', muscle: 'Hamstrings', sets: 4, reps: 8 },
      { name: 'Leg Press', muscle: 'Quadriceps', sets: 3, reps: 10 },
      { name: 'Leg Curl', muscle: 'Hamstrings', sets: 3, reps: 12 },
      { name: 'Standing Calf Raise', muscle: 'Calves', sets: 4, reps: 15 },
    ],
  },
  'default-3': {
    name: 'Upper Body',
    exercises: [
      { name: 'Bench Press', muscle: 'Chest', sets: 4, reps: 8 },
      { name: 'Barbell Row', muscle: 'Back', sets: 4, reps: 8 },
      { name: 'Overhead Press', muscle: 'Shoulders', sets: 3, reps: 10 },
      { name: 'Pull-Up', muscle: 'Back', sets: 3, reps: 8 },
      { name: 'Dumbbell Curl', muscle: 'Biceps', sets: 2, reps: 12 },
      { name: 'Tricep Pushdown', muscle: 'Triceps', sets: 2, reps: 12 },
    ],
  },
  'default-4': {
    name: 'Full Body',
    exercises: [
      { name: 'Squat', muscle: 'Quadriceps', sets: 3, reps: 8 },
      { name: 'Bench Press', muscle: 'Chest', sets: 3, reps: 8 },
      { name: 'Barbell Row', muscle: 'Back', sets: 3, reps: 8 },
      { name: 'Overhead Press', muscle: 'Shoulders', sets: 3, reps: 10 },
      { name: 'Romanian Deadlift', muscle: 'Hamstrings', sets: 3, reps: 10 },
      { name: 'Plank', muscle: 'Core', sets: 3, reps: 60 },
    ],
  },
};

export default function WorkoutActive() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    templateId?: string;
    templateName?: string;
    programWorkout?: string;
  }>();
  const { saveWorkout, workoutHistory, workoutTemplates, useTemplate, completeWorkout } = useData();
  const { startTimer, autoStart, defaultDuration, isRunning } = useRestTimer();
  const { pendingExercise, setPendingExercise } = useExerciseSelection();
  const [workoutName, setWorkoutName] = useState(params.templateName || 'New Workout');
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(Date.now());
  const nextExerciseId = useRef(100);
  const templateLoaded = useRef(false);
  const [exercises, setExercises] = useState<LocalExercise[]>([]);

  // Store program workout info for completion tracking
  const programWorkoutRef = useRef<{ week: number; day: number } | null>(null);

  // Load template or program exercises
  useEffect(() => {
    if (!templateLoaded.current) {
      if (params.programWorkout) {
        templateLoaded.current = true;
        loadProgramWorkout();
      } else if (params.templateId) {
        templateLoaded.current = true;
        loadTemplateExercises();
      }
    }
  }, [params.templateId, params.programWorkout]);

  const loadProgramWorkout = () => {
    try {
      const programData = JSON.parse(params.programWorkout || '{}');
      if (programData.exercises && programData.exercises.length > 0) {
        programWorkoutRef.current = { week: programData.week, day: programData.day };
        setWorkoutName(programData.name || 'Program Workout');

        const localExercises: LocalExercise[] = programData.exercises.map((ex: any, idx: number) => ({
          id: String(idx + 1),
          name: ex.name,
          muscle: ex.muscle,
          previousBest: PREVIOUS_DATA[ex.name],
          sets: Array.from({ length: ex.targetSets }, (_, setIdx) => ({
            id: String(setIdx + 1),
            weight: 0,
            reps: 0,
            completed: false,
            previous: PREVIOUS_DATA[ex.name],
          })),
        }));

        setExercises(localExercises);
        nextExerciseId.current = localExercises.length + 100;
      }
    } catch (error) {
      console.error('Error loading program workout:', error);
    }
  };

  const loadTemplateExercises = async () => {
    const templateId = params.templateId;
    if (!templateId) return;

    let templateExercises: Array<{ name: string; muscle: string; sets: number; reps: number }> = [];

    // Check if it's a default template
    if (templateId.startsWith('default-')) {
      const defaultTemplate = DEFAULT_TEMPLATES_DATA[templateId];
      if (defaultTemplate) {
        templateExercises = defaultTemplate.exercises;
        setWorkoutName(defaultTemplate.name);
      }
    } else {
      // Load from user's custom templates
      const template = await useTemplate(templateId);
      if (template) {
        templateExercises = template.exercises.map(ex => ({
          name: ex.name,
          muscle: ex.muscle,
          sets: ex.targetSets,
          reps: ex.targetReps,
        }));
        setWorkoutName(template.name);
      }
    }

    // Convert to LocalExercise format
    const localExercises: LocalExercise[] = templateExercises.map((ex, idx) => ({
      id: String(idx + 1),
      name: ex.name,
      muscle: ex.muscle,
      previousBest: PREVIOUS_DATA[ex.name],
      sets: Array.from({ length: ex.sets }, (_, setIdx) => ({
        id: String(setIdx + 1),
        weight: 0,
        reps: 0,
        completed: false,
        previous: PREVIOUS_DATA[ex.name],
      })),
    }));

    if (localExercises.length > 0) {
      setExercises(localExercises);
      nextExerciseId.current = localExercises.length + 100;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle adding exercise when returning from exercise library
  useFocusEffect(
    useCallback(() => {
      if (pendingExercise) {
        const newExercise: LocalExercise = {
          id: String(nextExerciseId.current++),
          name: pendingExercise.name,
          muscle: MUSCLE_LABELS[pendingExercise.muscle] || pendingExercise.muscle,
          sets: [
            { id: '1', weight: 0, reps: 0, completed: false },
            { id: '2', weight: 0, reps: 0, completed: false },
            { id: '3', weight: 0, reps: 0, completed: false },
          ],
        };
        setExercises(prev => [...prev, newExercise]);
        setPendingExercise(null);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, [pendingExercise, setPendingExercise])
  );

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-fill from previous workout
  const autoFillSet = (exerciseId: string, setId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId && set.previous
                  ? { ...set, weight: set.previous.weight, reps: set.previous.reps }
                  : set
              ),
            }
          : exercise
      )
    );
  };

  // Quick weight adjustment
  const adjustWeight = (exerciseId: string, setId: string, delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) => {
                if (set.id === setId) {
                  const newWeight = Math.max(0, set.weight + delta);
                  return { ...set, weight: newWeight };
                }
                return set;
              }),
            }
          : exercise
      )
    );
  };

  // Quick reps adjustment
  const adjustReps = (exerciseId: string, setId: string, delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) => {
                if (set.id === setId) {
                  const newReps = Math.max(0, set.reps + delta);
                  return { ...set, reps: newReps };
                }
                return set;
              }),
            }
          : exercise
      )
    );
  };

  const updateSetValue = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => {
    const numValue = parseFloat(value) || 0;
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, [field]: numValue } : set
              ),
            }
          : exercise
      )
    );
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Find if we're completing or uncompleting
    const exercise = exercises.find(e => e.id === exerciseId);
    const set = exercise?.sets.find(s => s.id === setId);
    const isCompleting = set && !set.completed;

    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, completed: !set.completed } : set
              ),
            }
          : exercise
      )
    );

    // Auto-start rest timer when completing a set
    if (isCompleting && autoStart && !isRunning) {
      startTimer(defaultDuration);
    }
  };

  const addSet = (exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        const lastSet = exercise.sets[exercise.sets.length - 1];
        const newSet: LocalWorkoutSet = {
          id: String(exercise.sets.length + 1),
          weight: 0,
          reps: 0,
          completed: false,
          previous: lastSet?.previous,
        };
        return { ...exercise, sets: [...exercise.sets, newSet] };
      })
    );
  };

  const removeExercise = (exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Remove Exercise?',
      'This will remove the exercise and all its sets.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setExercises(prev => prev.filter(e => e.id !== exerciseId)),
        },
      ]
    );
  };

  const calculateWorkoutStats = () => {
    let totalVolume = 0;
    let totalSets = 0;

    exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed && set.weight > 0 && set.reps > 0) {
          totalVolume += set.weight * set.reps;
          totalSets++;
        }
      });
    });

    return { totalVolume, totalSets };
  };

  const handleFinish = () => {
    const { totalSets } = calculateWorkoutStats();

    if (totalSets === 0) {
      Alert.alert(
        'No Sets Completed',
        'Please complete at least one set before finishing.',
        [{ text: 'OK' }]
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Finish Workout?',
      'Are you sure you want to finish this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Finish', onPress: finishWorkout },
      ]
    );
  };

  const finishWorkout = async () => {
    const { totalVolume, totalSets } = calculateWorkoutStats();
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);

    // Convert exercises to storage format (only completed sets)
    const workoutExercises: WorkoutExercise[] = exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      muscle: exercise.muscle,
      sets: exercise.sets
        .filter(set => set.completed)
        .map(set => ({
          id: set.id,
          weight: set.weight,
          reps: set.reps,
          completed: true,
        })),
    })).filter(e => e.sets.length > 0);

    await saveWorkout({
      date: new Date().toISOString().split('T')[0],
      name: workoutName,
      duration,
      exercises: workoutExercises,
      totalVolume,
      totalSets,
    });

    // If this was a program workout, mark it as completed
    if (programWorkoutRef.current) {
      await completeWorkout(programWorkoutRef.current.week, programWorkoutRef.current.day);
    }

    // Navigate to completion screen with stats
    router.replace({
      pathname: '/log/workout-complete',
      params: {
        duration: String(duration),
        exercises: String(workoutExercises.length),
        sets: String(totalSets),
        volume: String(Math.round(totalVolume)),
        name: workoutName,
      },
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Workout?',
      'You will lose all progress for this workout.',
      [
        { text: 'Keep Training', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={18} color={colors.accent.primary} />
          <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
        </View>
        <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
          <Text style={styles.finishText}>Finish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workout Title */}
        <TextInput
          style={styles.workoutTitle}
          placeholder="Workout Name"
          placeholderTextColor={colors.text.tertiary}
          value={workoutName}
          onChangeText={setWorkoutName}
        />

        {/* Exercises */}
        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                <Ionicons name="trash-outline" size={20} color={colors.error.primary} />
              </TouchableOpacity>
            </View>

            {/* Previous Best */}
            {exercise.previousBest && (
              <View style={styles.previousBest}>
                <Ionicons name="trophy-outline" size={14} color={colors.warning.primary} />
                <Text style={styles.previousBestText}>
                  Previous best: {exercise.previousBest.weight}kg × {exercise.previousBest.reps}
                </Text>
              </View>
            )}

            {/* Sets Header */}
            <View style={styles.setsHeader}>
              <Text style={[styles.setHeaderText, { width: 36 }]}>SET</Text>
              <Text style={[styles.setHeaderText, { width: 56 }]}>PREV</Text>
              <Text style={[styles.setHeaderText, { flex: 1 }]}>KG</Text>
              <Text style={[styles.setHeaderText, { flex: 1 }]}>REPS</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Sets */}
            {exercise.sets.map((set, setIndex) => (
              <View key={set.id} style={styles.setRow}>
                <Text style={styles.setNumber}>{setIndex + 1}</Text>

                {/* Previous value - tap to auto-fill */}
                <TouchableOpacity
                  style={styles.prevButton}
                  onPress={() => autoFillSet(exercise.id, set.id)}
                >
                  <Text style={styles.prevValue}>
                    {set.previous ? `${set.previous.weight}×${set.previous.reps}` : '-'}
                  </Text>
                </TouchableOpacity>

                {/* Weight input with quick adjust */}
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.adjustButton}
                    onPress={() => adjustWeight(exercise.id, set.id, -2.5)}
                  >
                    <Text style={styles.adjustText}>−</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.setInput, set.completed && styles.setInputCompleted]}
                    value={set.weight > 0 ? String(set.weight) : ''}
                    onChangeText={(v) => updateSetValue(exercise.id, set.id, 'weight', v)}
                    placeholder={set.previous ? String(set.previous.weight) : '0'}
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.adjustButton}
                    onPress={() => adjustWeight(exercise.id, set.id, 2.5)}
                  >
                    <Text style={styles.adjustText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Reps input with quick adjust */}
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.adjustButton}
                    onPress={() => adjustReps(exercise.id, set.id, -1)}
                  >
                    <Text style={styles.adjustText}>−</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.setInput, set.completed && styles.setInputCompleted]}
                    value={set.reps > 0 ? String(set.reps) : ''}
                    onChangeText={(v) => updateSetValue(exercise.id, set.id, 'reps', v)}
                    placeholder={set.previous ? String(set.previous.reps) : '0'}
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.adjustButton}
                    onPress={() => adjustReps(exercise.id, set.id, 1)}
                  >
                    <Text style={styles.adjustText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Complete button */}
                <TouchableOpacity
                  style={[styles.checkButton, set.completed && styles.checkButtonCompleted]}
                  onPress={() => toggleSetComplete(exercise.id, set.id)}
                >
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={set.completed ? colors.text.primary : colors.text.tertiary}
                  />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Set Button */}
            <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(exercise.id)}>
              <Ionicons name="add" size={18} color={colors.accent.primary} />
              <Text style={styles.addSetText}>Add Set</Text>
            </TouchableOpacity>
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

        {/* Quick Tips */}
        <View style={styles.tipsCard}>
          <Ionicons name="bulb-outline" size={20} color={colors.warning.primary} />
          <Text style={styles.tipsText}>
            Tap the previous value to auto-fill. Use +/− to quickly adjust weight and reps.
          </Text>
        </View>

        {/* Rest Timer Prompt */}
        <View style={styles.restTimerCard}>
          <Text style={styles.restTimerTitle}>Rest Timer</Text>
          <Text style={styles.restTimerSubtitle}>
            {autoStart ? 'Auto-starts after completing a set' : 'Tap to start timer'}
          </Text>
          <View style={styles.restTimerOptions}>
            {[
              { label: '1:00', seconds: 60 },
              { label: '1:30', seconds: 90 },
              { label: '2:00', seconds: 120 },
              { label: '3:00', seconds: 180 },
            ].map((preset) => (
              <TouchableOpacity
                key={preset.label}
                style={[
                  styles.restTimerOption,
                  defaultDuration === preset.seconds && styles.restTimerOptionActive,
                ]}
                onPress={() => startTimer(preset.seconds)}
              >
                <Text
                  style={[
                    styles.restTimerOptionText,
                    defaultDuration === preset.seconds && styles.restTimerOptionTextActive,
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Rest Timer Overlay */}
      <RestTimerOverlay />
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
  cancelButton: {
    paddingVertical: spacing.sm,
  },
  cancelText: {
    fontSize: fontSize.md,
    color: colors.error.primary,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  timer: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  finishButton: {
    backgroundColor: colors.success.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  finishText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  workoutTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  exerciseCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  exerciseName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.accent.primary,
  },
  previousBest: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.warning.muted,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  previousBestText: {
    fontSize: fontSize.xs,
    color: colors.warning.primary,
  },
  setsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  setHeaderText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  setNumber: {
    width: 36,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  prevButton: {
    width: 56,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
  },
  prevValue: {
    fontSize: fontSize.xs,
    color: colors.accent.primary,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  adjustButton: {
    width: 24,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
  },
  adjustText: {
    fontSize: fontSize.lg,
    color: colors.accent.primary,
    fontWeight: fontWeight.bold,
  },
  setInput: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginHorizontal: 2,
    fontSize: fontSize.md,
    color: colors.text.primary,
    textAlign: 'center',
  },
  setInputCompleted: {
    backgroundColor: colors.success.muted,
  },
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonCompleted: {
    backgroundColor: colors.success.primary,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  addSetText: {
    fontSize: fontSize.sm,
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
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
    marginBottom: spacing.lg,
  },
  tipsText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  restTimerCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    alignItems: 'center',
    ...shadows.sm,
  },
  restTimerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  restTimerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  restTimerOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  restTimerOption: {
    backgroundColor: colors.background.tertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  restTimerOptionActive: {
    backgroundColor: colors.accent.primary,
  },
  restTimerOptionText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  restTimerOptionTextActive: {
    color: colors.text.primary,
    fontWeight: fontWeight.bold,
  },
});
