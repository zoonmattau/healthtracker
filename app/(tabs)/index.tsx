import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.first_name) {
        setUserName(user.user_metadata.first_name);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Placeholder data - will be dynamic later
  const caloriesConsumed = 1840;
  const caloriesGoal = 2400;
  const caloriesPercent = Math.round((caloriesConsumed / caloriesGoal) * 100);

  const macros = {
    protein: { current: 142, goal: 180 },
    carbs: { current: 180, goal: 250 },
    fat: { current: 62, goal: 80 },
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()}{userName ? `, ${userName}` : ''}
          </Text>
          <Text style={styles.date}>{getFormattedDate()}</Text>
        </View>
        <TouchableOpacity style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {userName ? userName[0].toUpperCase() : '?'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calories Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Calories</Text>

        {/* Progress Ring Placeholder */}
        <View style={styles.caloriesContainer}>
          <View style={styles.caloriesRing}>
            <Text style={styles.caloriesMain}>{caloriesConsumed}</Text>
            <Text style={styles.caloriesGoal}>of {caloriesGoal}</Text>
          </View>
          <Text style={styles.caloriesPercent}>{caloriesPercent}%</Text>
        </View>

        {/* Macros */}
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Protein</Text>
            <View style={styles.macroBar}>
              <View
                style={[
                  styles.macroFill,
                  styles.proteinFill,
                  { width: `${(macros.protein.current / macros.protein.goal) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.macroValue}>{macros.protein.current}g</Text>
          </View>

          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <View style={styles.macroBar}>
              <View
                style={[
                  styles.macroFill,
                  styles.carbsFill,
                  { width: `${(macros.carbs.current / macros.carbs.goal) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.macroValue}>{macros.carbs.current}g</Text>
          </View>

          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fat</Text>
            <View style={styles.macroBar}>
              <View
                style={[
                  styles.macroFill,
                  styles.fatFill,
                  { width: `${(macros.fat.current / macros.fat.goal) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.macroValue}>{macros.fat.current}g</Text>
          </View>
        </View>
      </View>

      {/* Today's Workout Card */}
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <Text style={styles.cardTitle}>Today's Workout</Text>
        <View style={styles.workoutPreview}>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutName}>No workout scheduled</Text>
            <Text style={styles.workoutSubtext}>Tap to start a workout</Text>
          </View>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>📸</Text>
          <Text style={styles.quickActionText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>🍎</Text>
          <Text style={styles.quickActionText}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>🏋️</Text>
          <Text style={styles.quickActionText}>Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>💧</Text>
          <Text style={styles.quickActionText}>Water</Text>
        </TouchableOpacity>
      </View>

      {/* Streak Card */}
      <View style={styles.streakCard}>
        <Text style={styles.streakIcon}>🔥</Text>
        <View style={styles.streakInfo}>
          <Text style={styles.streakNumber}>0 day streak</Text>
          <Text style={styles.streakText}>Log something to start!</Text>
        </View>
      </View>
    </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.accent.primary,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  caloriesRing: {
    alignItems: 'flex-start',
  },
  caloriesMain: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  caloriesGoal: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  caloriesPercent: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.accent.primary,
  },
  macrosContainer: {
    gap: spacing.md,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  macroLabel: {
    width: 60,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  macroBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
  },
  macroFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  proteinFill: {
    backgroundColor: '#EF4444',
  },
  carbsFill: {
    backgroundColor: '#F59E0B',
  },
  fatFill: {
    backgroundColor: '#3B82F6',
  },
  macroValue: {
    width: 45,
    fontSize: fontSize.sm,
    color: colors.text.primary,
    textAlign: 'right',
  },
  workoutPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  workoutSubtext: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 18,
    color: colors.text.primary,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  quickActionText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
  streakCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  streakIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  streakText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
});
