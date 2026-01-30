import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useDashboard, ACTION_DETAILS, DashboardSection } from '../../src/context/DashboardContext';
import { useData } from '../../src/context/DataContext';
import { colors } from '../../src/constants/theme';

export default function Home() {
  const router = useRouter();
  const { session, isGuest, setShowAuthPrompt } = useAuth();
  const { config } = useDashboard();
  const {
    todayNutrition,
    todayWater,
    todayWorkout,
    streak,
    activeProgram,
    getProgramProgress,
    isLoading: dataLoading,
  } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();
    Animated.timing(fadeIn, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [session]);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.first_name) setUserName(user.user_metadata.first_name);
    } catch (e) {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadUserData();
    setRefreshing(false);
  };

  // Calculate nutrition data
  const remaining = todayNutrition.calorieGoal - todayNutrition.calories;
  const progress = Math.min(Math.round((todayNutrition.calories / todayNutrition.calorieGoal) * 100), 100);

  // Water progress
  const waterProgress = Math.min(Math.round((todayWater.amount / todayWater.goal) * 100), 100);

  // Check if section is visible
  const isVisible = (section: DashboardSection) => config.visibleSections.includes(section);

  // Render sections in order
  const renderSection = (section: DashboardSection) => {
    switch (section) {
      case 'calories':
        return isVisible('calories') && (
          <Pressable
            key="calories"
            style={styles.heroCard}
            onPress={() => router.push('/log/food')}
          >
            <Text style={styles.heroLabel}>Calories remaining</Text>
            <Text style={[styles.heroNumber, remaining < 0 && styles.overLimit]}>
              {remaining}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>{todayNutrition.calories}</Text>
                <Text style={styles.heroStatLabel}>eaten</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>{todayNutrition.calorieGoal}</Text>
                <Text style={styles.heroStatLabel}>goal</Text>
              </View>
            </View>
          </Pressable>
        );

      case 'macros':
        return isVisible('macros') && (
          <Pressable
            key="macros"
            style={styles.macrosCard}
            onPress={() => router.push('/log/food')}
          >
            <MacroRow
              label="Protein"
              current={todayNutrition.protein}
              goal={todayNutrition.proteinGoal}
            />
            <MacroRow
              label="Carbs"
              current={todayNutrition.carbs}
              goal={todayNutrition.carbsGoal}
            />
            <MacroRow
              label="Fat"
              current={todayNutrition.fat}
              goal={todayNutrition.fatGoal}
            />
          </Pressable>
        );

      case 'actions':
        return isVisible('actions') && (
          <View key="actions" style={styles.actions}>
            {config.quickActions.map((action) => {
              const details = ACTION_DETAILS[action];
              return (
                <ActionButton
                  key={action}
                  icon={details.icon}
                  label={details.label}
                  onPress={() => router.push(details.route as any)}
                  badge={action === 'water' ? `${waterProgress}%` : undefined}
                />
              );
            })}
          </View>
        );

      case 'todayWorkout':
        const programProgress = activeProgram ? getProgramProgress() : null;
        return isVisible('todayWorkout') && (
          <Pressable
            key="todayWorkout"
            style={styles.workoutCard}
            onPress={() => activeProgram ? router.push('/program/active') : router.push('/log/workout')}
          >
            <View style={{ flex: 1 }}>
              {activeProgram ? (
                <>
                  <Text style={styles.workoutLabel}>Active Program</Text>
                  <Text style={styles.workoutTitle}>{activeProgram.programName}</Text>
                  <Text style={styles.workoutMeta}>
                    Week {activeProgram.currentWeek} · {programProgress?.percentComplete || 0}% complete
                  </Text>
                </>
              ) : todayWorkout ? (
                <>
                  <Text style={styles.workoutLabel}>Workout Complete!</Text>
                  <Text style={styles.workoutTitle}>{todayWorkout.name}</Text>
                  <Text style={styles.workoutMeta}>
                    {todayWorkout.exercises.length} exercises · {Math.round(todayWorkout.duration / 60)} min
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.workoutLabel}>Ready to Train?</Text>
                  <Text style={styles.workoutTitle}>Start a Workout</Text>
                  <Text style={styles.workoutMeta}>Templates & programs available</Text>
                </>
              )}
            </View>
            <View style={[styles.startBtn, todayWorkout && !activeProgram && styles.completedBtn]}>
              <Ionicons
                name={todayWorkout && !activeProgram ? 'checkmark' : 'play'}
                size={24}
                color={todayWorkout && !activeProgram ? colors.success.primary : '#000'}
              />
            </View>
          </Pressable>
        );

      case 'streak':
        return isVisible('streak') && (
          <View key="streak" style={styles.streakCard}>
            <Ionicons name="flame" size={24} color={colors.warning.primary} />
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>
                {streak.currentStreak > 0 ? `${streak.currentStreak} day streak` : 'Start your streak!'}
              </Text>
              <Text style={styles.streakText}>
                {streak.currentStreak > 0
                  ? 'Keep it up!'
                  : 'Log something today'}
              </Text>
            </View>
            {streak.longestStreak > 0 && (
              <View style={styles.streakBest}>
                <Text style={styles.streakBestText}>Best: {streak.longestStreak}</Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />}
    >
      <Animated.View style={{ opacity: fadeIn }}>

        {/* Guest Mode Banner */}
        {isGuest && (
          <TouchableOpacity
            style={styles.guestBanner}
            onPress={() => setShowAuthPrompt(true)}
          >
            <View style={styles.guestBannerContent}>
              <Ionicons name="person-add" size={20} color={ACCENT} />
              <View style={styles.guestBannerText}>
                <Text style={styles.guestBannerTitle}>You're exploring as a guest</Text>
                <Text style={styles.guestBannerSubtitle}>Sign up to save your progress</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={TEXT_SECONDARY} />
          </TouchableOpacity>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {userName || (isGuest ? 'Explorer' : 'there')}</Text>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push('/settings/customize-dashboard')}
              style={styles.customizeBtn}
            >
              <Ionicons name="grid-outline" size={20} color="#FFF" />
            </Pressable>
            <Pressable
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.profileBtn}
            >
              <Ionicons name="person" size={20} color="#FFF" />
            </Pressable>
          </View>
        </View>

        {/* Render sections in configured order */}
        {config.sectionOrder.map(renderSection)}

      </Animated.View>
    </ScrollView>
  );
}

// Macro Row Component
function MacroRow({ label, current, goal }: { label: string; current: number; goal: number }) {
  const progress = Math.min(Math.round((current / goal) * 100), 100);
  return (
    <View style={styles.macroRow}>
      <Text style={styles.macroLabel}>{label}</Text>
      <View style={styles.macroBarContainer}>
        <View style={[styles.macroBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.macroValue}>
        {Math.round(current)}<Text style={styles.macroGoal}>/{goal}g</Text>
      </Text>
    </View>
  );
}

// Action Button Component
function ActionButton({
  icon,
  label,
  onPress,
  badge
}: {
  icon: string;
  label: string;
  onPress: () => void;
  badge?: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View style={styles.actionIconContainer}>
        <Ionicons name={icon as any} size={24} color="#FFF" />
        {badge && (
          <View style={styles.actionBadge}>
            <Text style={styles.actionBadgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const CARD_BG = colors.background.secondary;
const ACCENT = colors.accent.primary;
const TEXT = colors.text.primary;
const TEXT_SECONDARY = colors.text.secondary;
const BORDER = colors.border.primary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: TEXT,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  customizeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hero Card
  heroCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  heroLabel: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginBottom: 8,
  },
  heroNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 16,
  },
  overLimit: {
    color: colors.error.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: BORDER,
    borderRadius: 4,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: 4,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStat: {
    flex: 1,
  },
  heroStatNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
  },
  heroStatLabel: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: BORDER,
    marginHorizontal: 20,
  },

  // Macros Card
  macrosCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 16,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroLabel: {
    width: 60,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  macroBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: BORDER,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  macroBar: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: 4,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
    width: 70,
    textAlign: 'right',
  },
  macroGoal: {
    color: TEXT_SECONDARY,
    fontWeight: '400',
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionIconContainer: {
    position: 'relative',
  },
  actionBadge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: ACCENT,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  actionBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: TEXT,
  },
  actionLabel: {
    fontSize: 13,
    color: TEXT,
    fontWeight: '500',
  },

  // Workout Card
  workoutCard: {
    backgroundColor: ACCENT,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  workoutLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
  },
  workoutMeta: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  startBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: TEXT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBtn: {
    backgroundColor: colors.success.muted,
  },

  // Streak Card
  streakCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT,
  },
  streakText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  streakBest: {
    backgroundColor: colors.warning.muted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakBestText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warning.primary,
  },

  // Guest Banner
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  guestBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guestBannerText: {},
  guestBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
  },
  guestBannerSubtitle: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
});
