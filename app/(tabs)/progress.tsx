import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData } from '../../src/context/DataContext';

type TabType = 'weight' | 'lifts' | 'nutrition';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.lg * 2 - spacing.lg * 2;

export default function Progress() {
  const router = useRouter();
  const { weightHistory, personalRecords, workoutHistory, todayNutrition, streak } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('weight');

  const latestWeight = weightHistory.length > 0 ? weightHistory[0] : null;
  const oldestWeight = weightHistory.length > 1 ? weightHistory[weightHistory.length - 1] : null;

  // Calculate weight change
  const weightChange = latestWeight && oldestWeight
    ? (latestWeight.weight - oldestWeight.weight).toFixed(1)
    : null;

  // Prepare weight chart data (last 7 entries)
  const chartData = useMemo(() => {
    return weightHistory.slice(0, 7).reverse();
  }, [weightHistory]);

  const maxWeight = chartData.length > 0 ? Math.max(...chartData.map(d => d.weight)) : 0;
  const minWeight = chartData.length > 0 ? Math.min(...chartData.map(d => d.weight)) : 0;
  const weightRange = maxWeight - minWeight || 1;

  // Calculate workout stats
  const workoutStats = useMemo(() => {
    const last30Days = workoutHistory.filter(w => {
      const date = new Date(w.date);
      const now = new Date();
      const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 30;
    });

    const totalVolume = last30Days.reduce((sum, w) => sum + w.totalVolume, 0);
    const totalWorkouts = last30Days.length;

    return { totalVolume, totalWorkouts };
  }, [workoutHistory]);

  const renderWeightTab = () => (
    <>
      {/* Current Weight */}
      <View style={styles.section}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Current Weight</Text>
            <TouchableOpacity onPress={() => router.push('/log/weight')}>
              <Text style={styles.addButton}>+ Log</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statValue}>
            <Text style={styles.statNumber}>
              {latestWeight ? latestWeight.weight.toFixed(1) : '--'}
            </Text>
            <Text style={styles.statUnit}>kg</Text>
          </View>
          <Text style={styles.statSubtext}>
            {latestWeight
              ? `Last logged: ${new Date(latestWeight.date).toLocaleDateString()}`
              : 'No data yet'}
          </Text>
          {weightChange && (
            <View style={[
              styles.changeBadge,
              parseFloat(weightChange) < 0 ? styles.changeBadgeGood : styles.changeBadgeNeutral
            ]}>
              <Ionicons
                name={parseFloat(weightChange) < 0 ? 'trending-down' : 'trending-up'}
                size={14}
                color={parseFloat(weightChange) < 0 ? colors.success.primary : colors.text.secondary}
              />
              <Text style={[
                styles.changeText,
                parseFloat(weightChange) < 0 ? styles.changeTextGood : styles.changeTextNeutral
              ]}>
                {parseFloat(weightChange) > 0 ? '+' : ''}{weightChange} kg overall
              </Text>
            </View>
          )}
        </View>

        {/* Weight Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weight Over Time</Text>
          {chartData.length > 1 ? (
            <View style={styles.chart}>
              <View style={styles.chartYAxis}>
                <Text style={styles.chartYLabel}>{maxWeight.toFixed(1)}</Text>
                <Text style={styles.chartYLabel}>{minWeight.toFixed(1)}</Text>
              </View>
              <View style={styles.chartArea}>
                <View style={styles.chartBars}>
                  {chartData.map((entry, index) => {
                    const height = ((entry.weight - minWeight) / weightRange) * 100;
                    return (
                      <View key={entry.id} style={styles.chartBarColumn}>
                        <View style={styles.chartBarContainer}>
                          <View
                            style={[styles.chartBar, { height: `${Math.max(height, 10)}%` }]}
                          />
                        </View>
                        <Text style={styles.chartXLabel}>
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>📈</Text>
              <Text style={styles.chartPlaceholderLabel}>
                {chartData.length === 1
                  ? 'Log more entries to see your trend'
                  : 'Log your weight to see trends'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Weight History */}
      {weightHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          {weightHistory.slice(0, 5).map((entry) => (
            <View key={entry.id} style={styles.historyItem}>
              <Text style={styles.historyDate}>
                {new Date(entry.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
              <Text style={styles.historyValue}>{entry.weight.toFixed(1)} kg</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );

  const renderLiftsTab = () => (
    <>
      {/* Workout Stats */}
      <View style={styles.section}>
        <View style={styles.statsRow}>
          <View style={styles.miniStatCard}>
            <Ionicons name="barbell" size={24} color={colors.accent.primary} />
            <Text style={styles.miniStatValue}>{workoutStats.totalWorkouts}</Text>
            <Text style={styles.miniStatLabel}>Workouts (30d)</Text>
          </View>
          <View style={styles.miniStatCard}>
            <Ionicons name="layers" size={24} color={colors.accent.primary} />
            <Text style={styles.miniStatValue}>
              {workoutStats.totalVolume > 1000
                ? `${(workoutStats.totalVolume / 1000).toFixed(1)}k`
                : workoutStats.totalVolume}
            </Text>
            <Text style={styles.miniStatLabel}>Volume (kg)</Text>
          </View>
          <View style={styles.miniStatCard}>
            <Ionicons name="flame" size={24} color={colors.warning.primary} />
            <Text style={styles.miniStatValue}>{streak.currentStreak}</Text>
            <Text style={styles.miniStatLabel}>Day Streak</Text>
          </View>
        </View>
      </View>

      {/* Personal Records */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Records</Text>

        {personalRecords.length > 0 ? (
          personalRecords.slice(0, 5).map((pr, index) => (
            <View key={index} style={styles.prCard}>
              <Text style={styles.prIcon}>🏆</Text>
              <View style={styles.prInfo}>
                <Text style={styles.prExercise}>{pr.exercise}</Text>
                <Text style={styles.prValue}>
                  {pr.weight} kg × {pr.reps} reps
                </Text>
              </View>
              <Text style={styles.prDate}>
                {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="trophy-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>No personal records yet</Text>
            <Text style={styles.emptySubtext}>Complete workouts to track your PRs</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/log/workout')}
            >
              <Text style={styles.emptyButtonText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Recent Workouts */}
      {workoutHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          {workoutHistory.slice(0, 3).map((workout) => (
            <View key={workout.id} style={styles.workoutItem}>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutMeta}>
                  {workout.exercises.length} exercises · {Math.round(workout.duration / 60)} min
                </Text>
              </View>
              <Text style={styles.workoutDate}>
                {new Date(workout.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </View>
          ))}
        </View>
      )}
    </>
  );

  const renderNutritionTab = () => (
    <>
      {/* Today's Summary */}
      <View style={styles.section}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today's Nutrition</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{todayNutrition.calories}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(todayNutrition.protein)}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(todayNutrition.carbs)}g</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(todayNutrition.fat)}g</Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Goals</Text>
        <View style={styles.goalCard}>
          <GoalRow
            label="Calories"
            current={todayNutrition.calories}
            goal={todayNutrition.calorieGoal}
            unit="kcal"
          />
          <GoalRow
            label="Protein"
            current={todayNutrition.protein}
            goal={todayNutrition.proteinGoal}
            unit="g"
          />
          <GoalRow
            label="Carbs"
            current={todayNutrition.carbs}
            goal={todayNutrition.carbsGoal}
            unit="g"
          />
          <GoalRow
            label="Fat"
            current={todayNutrition.fat}
            goal={todayNutrition.fatGoal}
            unit="g"
          />
        </View>
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabRow}>
        {(['weight', 'lifts', 'nutrition'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'weight' && renderWeightTab()}
      {activeTab === 'lifts' && renderLiftsTab()}
      {activeTab === 'nutrition' && renderNutritionTab()}
    </ScrollView>
  );
}

function GoalRow({
  label,
  current,
  goal,
  unit
}: {
  label: string;
  current: number;
  goal: number;
  unit: string;
}) {
  const progress = Math.min(Math.round((current / goal) * 100), 100);
  return (
    <View style={styles.goalRow}>
      <View style={styles.goalInfo}>
        <Text style={styles.goalLabel}>{label}</Text>
        <Text style={styles.goalValues}>
          {Math.round(current)}/{goal} {unit}
        </Text>
      </View>
      <View style={styles.goalBarContainer}>
        <View style={[styles.goalBar, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tabActive: {
    backgroundColor: colors.accent.primary,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.text.primary,
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
  statCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  addButton: {
    fontSize: fontSize.sm,
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statNumber: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  statUnit: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  statSubtext: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  changeBadgeGood: {
    backgroundColor: colors.success.muted,
  },
  changeBadgeNeutral: {
    backgroundColor: colors.background.tertiary,
  },
  changeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  changeTextGood: {
    color: colors.success.primary,
  },
  changeTextNeutral: {
    color: colors.text.secondary,
  },
  chartCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  chartTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  chart: {
    flexDirection: 'row',
    height: 150,
  },
  chartYAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: spacing.sm,
  },
  chartYLabel: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  chartArea: {
    flex: 1,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  chartBarColumn: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarContainer: {
    height: 100,
    width: 20,
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.sm,
  },
  chartXLabel: {
    fontSize: 9,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  chartPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
  },
  chartPlaceholderText: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  chartPlaceholderLabel: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  historyDate: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  historyValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  miniStatValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  miniStatLabel: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  prCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  prIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  prInfo: {
    flex: 1,
  },
  prExercise: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  prValue: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  prDate: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  emptyCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.sm,
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
  },
  emptyButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  emptyButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  workoutMeta: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  workoutDate: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  nutritionGrid: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  nutritionLabel: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  goalCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  goalRow: {
    marginBottom: spacing.md,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  goalLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  goalValues: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  goalBarContainer: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
  },
  goalBar: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.full,
  },
});
