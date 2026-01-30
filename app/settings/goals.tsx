import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData } from '../../src/context/DataContext';

const FITNESS_GOALS = [
  { id: 'lose', label: 'Lose Weight', icon: '🔥', description: 'Burn fat and slim down', calorieModifier: -500 },
  { id: 'maintain', label: 'Maintain Weight', icon: '⚖️', description: 'Stay at current weight', calorieModifier: 0 },
  { id: 'gain', label: 'Build Muscle', icon: '💪', description: 'Gain lean muscle mass', calorieModifier: 300 },
  { id: 'strength', label: 'Get Stronger', icon: '🏋️', description: 'Increase strength & power', calorieModifier: 200 },
  { id: 'endurance', label: 'Improve Endurance', icon: '🏃', description: 'Better cardio fitness', calorieModifier: 100 },
  { id: 'health', label: 'General Health', icon: '❤️', description: 'Overall wellness', calorieModifier: 0 },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little or no exercise', multiplier: 1.2 },
  { id: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week', multiplier: 1.375 },
  { id: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week', multiplier: 1.55 },
  { id: 'very', label: 'Very Active', description: 'Hard exercise 6-7 days/week', multiplier: 1.725 },
  { id: 'extra', label: 'Extra Active', description: 'Very hard exercise & physical job', multiplier: 1.9 },
];

type EditModalType = 'calories' | 'protein' | 'carbs' | 'fat' | 'water' | 'weight' | 'workouts' | null;

export default function Goals() {
  const router = useRouter();
  const { goals, updateGoals, latestWeight } = useData();

  const [selectedGoal, setSelectedGoal] = useState('gain');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [editModal, setEditModal] = useState<EditModalType>(null);
  const [editValue, setEditValue] = useState('');

  // Local state for goals
  const [localGoals, setLocalGoals] = useState(goals);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  const currentWeight = latestWeight?.weight || 75;

  const handleGoalSelect = (goalId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedGoal(goalId);
    setHasChanges(true);

    // Recalculate calories based on goal
    const goal = FITNESS_GOALS.find(g => g.id === goalId);
    const activity = ACTIVITY_LEVELS.find(a => a.id === activityLevel);
    if (goal && activity) {
      // Simple BMR calculation (Mifflin-St Jeor approximation)
      const baseBMR = 10 * currentWeight + 625; // Simplified
      const tdee = Math.round(baseBMR * activity.multiplier);
      const targetCalories = Math.round(tdee + goal.calorieModifier);

      // Set macros based on calories
      const protein = Math.round(currentWeight * 2); // 2g per kg
      const fat = Math.round((targetCalories * 0.25) / 9); // 25% from fat
      const carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);

      setLocalGoals(prev => ({
        ...prev,
        calories: targetCalories,
        protein,
        carbs,
        fat,
      }));
    }
  };

  const handleActivitySelect = (levelId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActivityLevel(levelId);
    setHasChanges(true);

    // Recalculate calories
    const goal = FITNESS_GOALS.find(g => g.id === selectedGoal);
    const activity = ACTIVITY_LEVELS.find(a => a.id === levelId);
    if (goal && activity) {
      const baseBMR = 10 * currentWeight + 625;
      const tdee = Math.round(baseBMR * activity.multiplier);
      const targetCalories = Math.round(tdee + goal.calorieModifier);

      const protein = Math.round(currentWeight * 2);
      const fat = Math.round((targetCalories * 0.25) / 9);
      const carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);

      setLocalGoals(prev => ({
        ...prev,
        calories: targetCalories,
        protein,
        carbs,
        fat,
      }));
    }
  };

  const openEditModal = (type: EditModalType) => {
    setEditModal(type);
    switch (type) {
      case 'calories':
        setEditValue(String(localGoals.calories));
        break;
      case 'protein':
        setEditValue(String(localGoals.protein));
        break;
      case 'carbs':
        setEditValue(String(localGoals.carbs));
        break;
      case 'fat':
        setEditValue(String(localGoals.fat));
        break;
      case 'water':
        setEditValue(String(localGoals.water));
        break;
      case 'weight':
        setEditValue(String(localGoals.weight));
        break;
      case 'workouts':
        setEditValue(String(localGoals.workoutsPerWeek));
        break;
    }
  };

  const handleEditSave = () => {
    const numValue = parseFloat(editValue) || 0;
    setHasChanges(true);

    switch (editModal) {
      case 'calories':
        setLocalGoals(prev => ({ ...prev, calories: Math.round(numValue) }));
        break;
      case 'protein':
        setLocalGoals(prev => ({ ...prev, protein: Math.round(numValue) }));
        break;
      case 'carbs':
        setLocalGoals(prev => ({ ...prev, carbs: Math.round(numValue) }));
        break;
      case 'fat':
        setLocalGoals(prev => ({ ...prev, fat: Math.round(numValue) }));
        break;
      case 'water':
        setLocalGoals(prev => ({ ...prev, water: Math.round(numValue) }));
        break;
      case 'weight':
        setLocalGoals(prev => ({ ...prev, weight: numValue }));
        break;
      case 'workouts':
        setLocalGoals(prev => ({ ...prev, workoutsPerWeek: Math.round(numValue) }));
        break;
    }
    setEditModal(null);
  };

  const handleSave = async () => {
    await updateGoals(localGoals);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const getModalTitle = () => {
    switch (editModal) {
      case 'calories': return 'Daily Calories';
      case 'protein': return 'Protein Goal';
      case 'carbs': return 'Carbs Goal';
      case 'fat': return 'Fat Goal';
      case 'water': return 'Water Goal (ml)';
      case 'weight': return 'Target Weight (kg)';
      case 'workouts': return 'Workouts Per Week';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Goals</Text>
        <TouchableOpacity onPress={handleSave} disabled={!hasChanges}>
          <Text style={[styles.saveText, !hasChanges && styles.saveTextDisabled]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Fitness Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's your main goal?</Text>
          <View style={styles.goalsGrid}>
            {FITNESS_GOALS.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[styles.goalCard, selectedGoal === goal.id && styles.goalCardActive]}
                onPress={() => handleGoalSelect(goal.id)}
              >
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <Text style={styles.goalLabel}>{goal.label}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
                {selectedGoal === goal.id && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={16} color={colors.text.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activity Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Level</Text>
          <View style={styles.activityList}>
            {ACTIVITY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[styles.activityCard, activityLevel === level.id && styles.activityCardActive]}
                onPress={() => handleActivitySelect(level.id)}
              >
                <View style={styles.activityInfo}>
                  <Text style={styles.activityLabel}>{level.label}</Text>
                  <Text style={styles.activityDescription}>{level.description}</Text>
                </View>
                <View style={[styles.radio, activityLevel === level.id && styles.radioActive]}>
                  {activityLevel === level.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nutrition Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Nutrition Targets</Text>
          <View style={styles.targetsCard}>
            <TouchableOpacity style={styles.targetRow} onPress={() => openEditModal('calories')}>
              <View style={styles.targetInfo}>
                <Text style={styles.targetLabel}>Daily Calories</Text>
                <Text style={styles.targetValue}>{localGoals.calories.toLocaleString()} kcal</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            <View style={styles.targetDivider} />
            <View style={styles.macrosRow}>
              <TouchableOpacity style={styles.macroItem} onPress={() => openEditModal('protein')}>
                <Text style={styles.macroValue}>{localGoals.protein}g</Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.macroItem} onPress={() => openEditModal('carbs')}>
                <Text style={styles.macroValue}>{localGoals.carbs}g</Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.macroItem} onPress={() => openEditModal('fat')}>
                <Text style={styles.macroValue}>{localGoals.fat}g</Text>
                <Text style={styles.macroLabel}>Fat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Other Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Goals</Text>
          <View style={styles.otherGoalsCard}>
            <TouchableOpacity style={styles.otherGoalRow} onPress={() => openEditModal('water')}>
              <View style={styles.otherGoalIcon}>
                <Ionicons name="water" size={20} color={colors.accent.primary} />
              </View>
              <View style={styles.otherGoalInfo}>
                <Text style={styles.otherGoalLabel}>Daily Water</Text>
                <Text style={styles.otherGoalValue}>{(localGoals.water / 1000).toFixed(1)}L</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            <View style={styles.targetDivider} />
            <TouchableOpacity style={styles.otherGoalRow} onPress={() => openEditModal('weight')}>
              <View style={styles.otherGoalIcon}>
                <Ionicons name="scale" size={20} color={colors.accent.primary} />
              </View>
              <View style={styles.otherGoalInfo}>
                <Text style={styles.otherGoalLabel}>Target Weight</Text>
                <Text style={styles.otherGoalValue}>{localGoals.weight} kg</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            <View style={styles.targetDivider} />
            <TouchableOpacity style={styles.otherGoalRow} onPress={() => openEditModal('workouts')}>
              <View style={styles.otherGoalIcon}>
                <Ionicons name="barbell" size={20} color={colors.accent.primary} />
              </View>
              <View style={styles.otherGoalInfo}>
                <Text style={styles.otherGoalLabel}>Workouts Per Week</Text>
                <Text style={styles.otherGoalValue}>{localGoals.workoutsPerWeek} days</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Summary */}
        {latestWeight && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Progress</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressRow}>
                <View style={styles.progressItem}>
                  <Text style={styles.progressLabel}>Current</Text>
                  <Text style={styles.progressValue}>{currentWeight.toFixed(1)} kg</Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color={colors.text.tertiary} />
                <View style={styles.progressItem}>
                  <Text style={styles.progressLabel}>Goal</Text>
                  <Text style={styles.progressValue}>{localGoals.weight} kg</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        Math.max(
                          ((currentWeight - localGoals.weight) / (currentWeight - localGoals.weight + 10)) * 100,
                          0
                        ),
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.abs(currentWeight - localGoals.weight).toFixed(1)} kg to go
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModal !== null} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <TouchableOpacity onPress={() => setEditModal(null)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              keyboardType="numeric"
              autoFocus
              selectTextOnFocus
            />
            <TouchableOpacity style={styles.modalSaveButton} onPress={handleEditSave}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  saveText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.accent.primary,
  },
  saveTextDisabled: {
    color: colors.text.tertiary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  goalCard: {
    width: '47%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  goalCardActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.muted,
  },
  goalIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  goalLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  goalDescription: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityList: {
    gap: spacing.sm,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activityCardActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.muted,
  },
  activityInfo: {
    flex: 1,
  },
  activityLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  activityDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: colors.accent.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent.primary,
  },
  targetsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  targetInfo: {},
  targetLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  targetValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  targetDivider: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginVertical: spacing.lg,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  macroValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  macroLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  otherGoalsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  otherGoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  otherGoalIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  otherGoalInfo: {
    flex: 1,
  },
  otherGoalLabel: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  otherGoalValue: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  progressCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  progressValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  modalInput: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  modalSaveButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalSaveText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
});
