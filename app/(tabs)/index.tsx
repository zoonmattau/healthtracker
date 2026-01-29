import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, spacing, borderRadius } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const PADDING = 20;
const HALF_WIDTH = (width - PADDING * 2 - CARD_GAP) / 2;

// ============================================
// GLASSMORPHISM CARD COMPONENT
// ============================================
function GlassCard({
  children,
  style,
  gradient = ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)'],
  borderColor = 'rgba(255,255,255,0.1)',
  onPress,
}: {
  children: React.ReactNode;
  style?: any;
  gradient?: string[];
  borderColor?: string;
  onPress?: () => void;
}) {
  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => [
          styles.glassCard,
          { borderColor },
          style,
          pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
        ]}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.glassCard, { borderColor }, style]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </View>
  );
}

// ============================================
// ANIMATED NUMBER COMPONENT
// ============================================
function AnimatedNumber({ value, suffix = '', style }: { value: number; suffix?: string; style?: any }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });

    return () => animatedValue.removeAllListeners();
  }, [value]);

  return <Text style={style}>{displayValue.toLocaleString()}{suffix}</Text>;
}

// ============================================
// CIRCULAR PROGRESS COMPONENT
// ============================================
function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 10,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const rotation = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background circle */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      />
      {/* Progress arc - simplified for web */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: '#3B82F6',
          borderTopColor: progress > 25 ? '#3B82F6' : 'transparent',
          borderRightColor: progress > 50 ? '#3B82F6' : 'transparent',
          borderBottomColor: progress > 75 ? '#3B82F6' : 'transparent',
          borderLeftColor: 'transparent',
          transform: [{ rotate: '-135deg' }],
        }}
      />
      {/* Gradient overlay for glow effect */}
      <View
        style={{
          position: 'absolute',
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          borderRadius: (size - strokeWidth * 2) / 2,
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
        }}
      />
      {children}
    </View>
  );
}

// ============================================
// WATER GLASS COMPONENT
// ============================================
function WaterGlass({ current, goal }: { current: number; goal: number }) {
  const progress = Math.min((current / goal) * 100, 100);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const heightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.waterGlassContainer}>
      <View style={styles.waterGlass}>
        {/* Water fill */}
        <Animated.View
          style={[
            styles.waterFill,
            { height: heightInterpolate },
          ]}
        >
          <LinearGradient
            colors={['#06B6D4', '#0891B2']}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Water wave effect */}
          <View style={styles.waterWave} />
        </Animated.View>
        {/* Glass reflection */}
        <View style={styles.glassReflection} />
      </View>
      <View style={styles.waterInfo}>
        <Text style={styles.waterCurrent}>{current}ml</Text>
        <Text style={styles.waterGoal}>/ {goal}ml</Text>
      </View>
    </View>
  );
}

// ============================================
// MACRO PILL COMPONENT
// ============================================
function MacroPill({
  label,
  current,
  goal,
  color,
  icon,
}: {
  label: string;
  current: number;
  goal: number;
  color: string;
  icon: string;
}) {
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <View style={styles.macroPill}>
      <View style={[styles.macroPillIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={16} color={color} />
      </View>
      <View style={styles.macroPillInfo}>
        <Text style={styles.macroPillLabel}>{label}</Text>
        <View style={styles.macroPillBar}>
          <View
            style={[
              styles.macroPillFill,
              { width: `${progress}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
      <Text style={[styles.macroPillValue, { color }]}>{current}g</Text>
    </View>
  );
}

// ============================================
// SCHEDULE ITEM COMPONENT
// ============================================
function ScheduleItem({
  time,
  title,
  subtitle,
  icon,
  color,
  isActive,
  isCompleted,
}: {
  time: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  isActive?: boolean;
  isCompleted?: boolean;
}) {
  return (
    <View style={[styles.scheduleItem, isActive && styles.scheduleItemActive]}>
      <Text style={[styles.scheduleTime, isCompleted && styles.scheduleTimeCompleted]}>
        {time}
      </Text>
      <View style={[styles.scheduleIndicator, { backgroundColor: isCompleted ? colors.success.primary : color }]}>
        {isCompleted && <Ionicons name="checkmark" size={10} color="#FFF" />}
      </View>
      <View style={styles.scheduleContent}>
        <View style={[styles.scheduleIcon, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon as any} size={16} color={color} />
        </View>
        <View>
          <Text style={[styles.scheduleTitle, isCompleted && styles.scheduleTitleCompleted]}>
            {title}
          </Text>
          <Text style={styles.scheduleSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

// ============================================
// MAIN HOME COMPONENT
// ============================================
export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  // Animation values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadUserData();
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideUp, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadUserData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Data (placeholder - will be dynamic)
  const calories = { consumed: 1840, goal: 2400 };
  const caloriesPercent = Math.round((calories.consumed / calories.goal) * 100);
  const water = { current: 1800, goal: 3000 };
  const streak = 12;

  const macros = [
    { label: 'Protein', current: 142, goal: 180, color: '#EF4444', icon: 'fish-outline' },
    { label: 'Carbs', current: 180, goal: 250, color: '#F59E0B', icon: 'leaf-outline' },
    { label: 'Fat', current: 62, goal: 80, color: '#3B82F6', icon: 'water-outline' },
  ];

  const schedule = [
    { time: '7:00', title: 'Breakfast', subtitle: 'Oats & Protein', icon: 'restaurant-outline', color: '#F59E0B', isCompleted: true },
    { time: '10:00', title: 'Snack', subtitle: 'Greek Yogurt', icon: 'nutrition-outline', color: '#10B981', isCompleted: true },
    { time: '12:30', title: 'Lunch', subtitle: 'Chicken & Rice', icon: 'fast-food-outline', color: '#3B82F6', isCompleted: true },
    { time: '15:00', title: 'Pre-Workout', subtitle: 'Banana & Coffee', icon: 'cafe-outline', color: '#8B5CF6', isActive: true },
    { time: '16:00', title: 'Push Day', subtitle: 'Chest & Triceps', icon: 'barbell-outline', color: '#EC4899' },
    { time: '19:00', title: 'Dinner', subtitle: 'Salmon & Veggies', icon: 'restaurant-outline', color: '#06B6D4' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent.primary}
        />
      }
    >
      <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{userName || 'Champion'} 💪</Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/profile');
            }}
          >
            <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.avatar}>
              <Text style={styles.avatarText}>{userName ? userName[0].toUpperCase() : '?'}</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Progress Comparison Banner */}
        <GlassCard
          style={styles.comparisonCard}
          gradient={['rgba(34, 197, 94, 0.15)', 'rgba(34, 197, 94, 0.05)']}
          borderColor="rgba(34, 197, 94, 0.3)"
        >
          <View style={styles.comparisonContent}>
            <View style={styles.comparisonIcon}>
              <Ionicons name="trending-up" size={20} color={colors.success.primary} />
            </View>
            <View style={styles.comparisonText}>
              <Text style={styles.comparisonTitle}>You're doing great!</Text>
              <Text style={styles.comparisonSubtitle}>
                <Text style={{ color: colors.success.primary, fontWeight: '700' }}>+12% </Text>
                more consistent than last week
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* BENTO GRID */}
        <View style={styles.bentoGrid}>
          {/* Row 1: Calories (large) + Water + Streak */}
          <View style={styles.bentoRow}>
            {/* Calories Card - Large */}
            <GlassCard
              style={[styles.bentoCard, styles.bentoLarge]}
              gradient={['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.05)']}
              borderColor="rgba(59, 130, 246, 0.2)"
              onPress={() => router.push('/(tabs)/log')}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="flame-outline" size={18} color={colors.accent.primary} />
                <Text style={styles.cardLabel}>Calories</Text>
              </View>
              <View style={styles.caloriesContent}>
                <CircularProgress progress={caloriesPercent} size={100} strokeWidth={8}>
                  <View style={styles.caloriesCenter}>
                    <AnimatedNumber value={calories.consumed} style={styles.caloriesNumber} />
                    <Text style={styles.caloriesUnit}>kcal</Text>
                  </View>
                </CircularProgress>
                <View style={styles.caloriesStats}>
                  <View style={styles.calorieStat}>
                    <Text style={styles.calorieStatValue}>{calories.goal}</Text>
                    <Text style={styles.calorieStatLabel}>Goal</Text>
                  </View>
                  <View style={styles.calorieStat}>
                    <Text style={[styles.calorieStatValue, { color: colors.success.primary }]}>
                      {calories.goal - calories.consumed}
                    </Text>
                    <Text style={styles.calorieStatLabel}>Left</Text>
                  </View>
                </View>
              </View>
            </GlassCard>

            {/* Right Column: Water + Streak */}
            <View style={styles.bentoColumn}>
              {/* Water Card */}
              <GlassCard
                style={[styles.bentoCard, styles.bentoSmall]}
                gradient={['rgba(6, 182, 212, 0.1)', 'rgba(6, 182, 212, 0.05)']}
                borderColor="rgba(6, 182, 212, 0.2)"
                onPress={() => {}}
              >
                <View style={styles.cardHeader}>
                  <Ionicons name="water" size={16} color="#06B6D4" />
                  <Text style={styles.cardLabelSmall}>Water</Text>
                </View>
                <WaterGlass current={water.current} goal={water.goal} />
              </GlassCard>

              {/* Streak Card */}
              <GlassCard
                style={[styles.bentoCard, styles.bentoSmall]}
                gradient={['rgba(249, 115, 22, 0.15)', 'rgba(249, 115, 22, 0.05)']}
                borderColor="rgba(249, 115, 22, 0.3)"
              >
                <View style={styles.streakContent}>
                  <Text style={styles.streakEmoji}>🔥</Text>
                  <AnimatedNumber value={streak} style={styles.streakNumber} />
                  <Text style={styles.streakLabel}>Day Streak</Text>
                </View>
              </GlassCard>
            </View>
          </View>

          {/* Row 2: Macros */}
          <GlassCard style={[styles.bentoCard, styles.bentoFull]}>
            <View style={styles.cardHeader}>
              <Ionicons name="pie-chart-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.cardLabel}>Macros</Text>
            </View>
            <View style={styles.macrosRow}>
              {macros.map((macro, i) => (
                <MacroPill key={i} {...macro} />
              ))}
            </View>
          </GlassCard>

          {/* Row 3: Today's Workout */}
          <GlassCard
            style={[styles.bentoCard, styles.bentoFull]}
            gradient={['rgba(236, 72, 153, 0.1)', 'rgba(139, 92, 246, 0.05)']}
            borderColor="rgba(236, 72, 153, 0.2)"
            onPress={() => {}}
          >
            <View style={styles.workoutCard}>
              <View style={styles.workoutInfo}>
                <View style={styles.workoutBadge}>
                  <Text style={styles.workoutBadgeText}>UP NEXT</Text>
                </View>
                <Text style={styles.workoutTitle}>Push Day</Text>
                <Text style={styles.workoutSubtitle}>Chest, Shoulders & Triceps</Text>
                <View style={styles.workoutMeta}>
                  <View style={styles.workoutMetaItem}>
                    <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
                    <Text style={styles.workoutMetaText}>~45 min</Text>
                  </View>
                  <View style={styles.workoutMetaItem}>
                    <Ionicons name="barbell-outline" size={14} color={colors.text.tertiary} />
                    <Text style={styles.workoutMetaText}>8 exercises</Text>
                  </View>
                </View>
              </View>
              <LinearGradient colors={['#EC4899', '#8B5CF6']} style={styles.playButton}>
                <Ionicons name="play" size={28} color="#FFF" style={{ marginLeft: 4 }} />
              </LinearGradient>
            </View>
          </GlassCard>

          {/* Row 4: Schedule Timeline */}
          <GlassCard style={[styles.bentoCard, styles.bentoFull, { paddingBottom: spacing.sm }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.cardLabel}>Today's Schedule</Text>
            </View>
            <View style={styles.scheduleList}>
              {schedule.map((item, i) => (
                <ScheduleItem key={i} {...item} />
              ))}
            </View>
          </GlassCard>

          {/* Row 5: Quick Actions */}
          <View style={styles.quickActionsRow}>
            {[
              { icon: 'camera', label: 'Scan', gradient: ['#F59E0B', '#D97706'] },
              { icon: 'add-circle', label: 'Log', gradient: ['#10B981', '#059669'] },
              { icon: 'barbell', label: 'Workout', gradient: ['#3B82F6', '#2563EB'] },
              { icon: 'happy', label: 'Mood', gradient: ['#8B5CF6', '#7C3AED'] },
            ].map((action, i) => (
              <Pressable
                key={i}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={({ pressed }) => [
                  styles.quickAction,
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
              >
                <LinearGradient colors={action.gradient} style={styles.quickActionIcon}>
                  <Ionicons name={action.icon as any} size={22} color="#FFF" />
                </LinearGradient>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    paddingHorizontal: PADDING,
    paddingTop: 60,
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },

  // Comparison Card
  comparisonCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  comparisonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  comparisonIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comparisonText: {
    flex: 1,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  comparisonSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },

  // Glass Card
  glassCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    padding: spacing.md,
  },

  // Bento Grid
  bentoGrid: {
    gap: CARD_GAP,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  bentoColumn: {
    flex: 1,
    gap: CARD_GAP,
  },
  bentoCard: {
    overflow: 'hidden',
  },
  bentoLarge: {
    width: HALF_WIDTH + 20,
    minHeight: 200,
  },
  bentoSmall: {
    flex: 1,
    minHeight: 94,
  },
  bentoFull: {
    width: '100%',
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  cardLabelSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },

  // Calories
  caloriesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caloriesCenter: {
    alignItems: 'center',
  },
  caloriesNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  caloriesUnit: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: -4,
  },
  caloriesStats: {
    gap: spacing.md,
  },
  calorieStat: {
    alignItems: 'flex-end',
  },
  calorieStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  calorieStatLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
  },

  // Water Glass
  waterGlassContainer: {
    alignItems: 'center',
    gap: 8,
  },
  waterGlass: {
    width: 36,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    overflow: 'hidden',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  waterWave: {
    position: 'absolute',
    top: -4,
    left: -10,
    right: -10,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
  },
  glassReflection: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 6,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  waterInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  waterCurrent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#06B6D4',
  },
  waterGoal: {
    fontSize: 10,
    color: colors.text.tertiary,
  },

  // Streak
  streakContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F97316',
  },
  streakLabel: {
    fontSize: 11,
    color: colors.text.secondary,
  },

  // Macros
  macrosRow: {
    gap: spacing.sm,
  },
  macroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  macroPillIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroPillInfo: {
    flex: 1,
    gap: 4,
  },
  macroPillLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  macroPillBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroPillFill: {
    height: '100%',
    borderRadius: 3,
  },
  macroPillValue: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Workout
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutBadge: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  workoutBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EC4899',
    letterSpacing: 0.5,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  workoutMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutMetaText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Schedule
  scheduleList: {
    gap: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: spacing.sm,
  },
  scheduleItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
  },
  scheduleTime: {
    width: 45,
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  scheduleTimeCompleted: {
    color: colors.text.tertiary,
  },
  scheduleIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scheduleIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  scheduleTitleCompleted: {
    color: colors.text.secondary,
  },
  scheduleSubtitle: {
    fontSize: 12,
    color: colors.text.tertiary,
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginTop: spacing.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});
