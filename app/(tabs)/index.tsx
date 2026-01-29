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
import { colors, fontSize, spacing } from '../../src/constants/theme';
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
  borderColor = 'rgba(255,255,255,0.08)',
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
function AnimatedNumber({ value, suffix = '', prefix = '', style }: { value: number; suffix?: string; prefix?: string; style?: any }) {
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

  return <Text style={style}>{prefix}{displayValue.toLocaleString()}{suffix}</Text>;
}

// ============================================
// CIRCULAR PROGRESS COMPONENT
// ============================================
function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 10,
  color = '#3B82F6',
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}) {
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
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      />
      {/* Progress arc */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          borderTopColor: progress > 25 ? color : 'transparent',
          borderRightColor: progress > 50 ? color : 'transparent',
          borderBottomColor: progress > 75 ? color : 'transparent',
          borderLeftColor: 'transparent',
          transform: [{ rotate: '-135deg' }],
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
        <Animated.View style={[styles.waterFill, { height: heightInterpolate }]}>
          <LinearGradient
            colors={['#22D3EE', '#0891B2']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.waterWave} />
        </Animated.View>
        <View style={styles.glassReflection} />
      </View>
      <View style={styles.waterInfo}>
        <Text style={styles.waterCurrent}>{(current / 1000).toFixed(1)}L</Text>
        <Text style={styles.waterGoal}> / {(goal / 1000).toFixed(1)}L</Text>
      </View>
    </View>
  );
}

// ============================================
// MACRO BAR COMPONENT
// ============================================
function MacroBar({
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
    <View style={styles.macroBar}>
      <View style={[styles.macroIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon as any} size={16} color={color} />
      </View>
      <View style={styles.macroInfo}>
        <View style={styles.macroHeader}>
          <Text style={styles.macroLabel}>{label}</Text>
          <Text style={styles.macroValue}>
            <Text style={{ color, fontWeight: '600' }}>{current}</Text>
            <Text style={styles.macroGoal}>/{goal}g</Text>
          </Text>
        </View>
        <View style={styles.macroTrack}>
          <View style={[styles.macroFill, { width: `${progress}%`, backgroundColor: color }]} />
        </View>
      </View>
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
      <Text style={[styles.scheduleTime, isCompleted && { opacity: 0.4 }]}>{time}</Text>
      <View style={styles.scheduleTimeline}>
        <View style={[
          styles.scheduleNode,
          isCompleted && { backgroundColor: colors.success.primary, borderColor: colors.success.primary },
          isActive && { backgroundColor: color, borderColor: color, transform: [{ scale: 1.2 }] },
          !isCompleted && !isActive && { borderColor: 'rgba(255,255,255,0.2)' }
        ]}>
          {isCompleted && <Ionicons name="checkmark" size={8} color="#FFF" />}
        </View>
        <View style={[styles.scheduleLine, isCompleted && { backgroundColor: colors.success.primary }]} />
      </View>
      <View style={[styles.scheduleContent, isCompleted && { opacity: 0.4 }]}>
        <View style={[styles.scheduleIcon, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon as any} size={14} color={color} />
        </View>
        <View style={styles.scheduleText}>
          <Text style={styles.scheduleTitle}>{title}</Text>
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

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    loadUserData();
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
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

  // Data
  const calories = { consumed: 1840, goal: 2400 };
  const caloriesPercent = Math.round((calories.consumed / calories.goal) * 100);
  const water = { current: 1800, goal: 3000 };
  const streak = 12;

  const macros = [
    { label: 'Protein', current: 142, goal: 180, color: '#F43F5E', icon: 'fish-outline' },
    { label: 'Carbs', current: 180, goal: 250, color: '#F59E0B', icon: 'leaf-outline' },
    { label: 'Fat', current: 62, goal: 80, color: '#3B82F6', icon: 'water-outline' },
  ];

  const schedule = [
    { time: '07:00', title: 'Breakfast', subtitle: 'Oats & Protein', icon: 'sunny-outline', color: '#F59E0B', isCompleted: true },
    { time: '10:00', title: 'Snack', subtitle: 'Greek Yogurt', icon: 'nutrition-outline', color: '#10B981', isCompleted: true },
    { time: '12:30', title: 'Lunch', subtitle: 'Chicken & Rice', icon: 'restaurant-outline', color: '#3B82F6', isCompleted: true },
    { time: '15:00', title: 'Pre-Workout', subtitle: 'Banana & Coffee', icon: 'cafe-outline', color: '#8B5CF6', isActive: true },
    { time: '16:00', title: 'Push Day', subtitle: 'Chest & Triceps', icon: 'barbell-outline', color: '#EC4899' },
    { time: '19:00', title: 'Dinner', subtitle: 'Salmon & Veggies', icon: 'moon-outline', color: '#06B6D4' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent.primary} />
      }
    >
      <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{userName || 'Champion'}</Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/profile');
            }}
            style={({ pressed }) => pressed && { opacity: 0.8 }}
          >
            <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.avatar}>
              <Text style={styles.avatarText}>{userName ? userName[0].toUpperCase() : '?'}</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Progress Banner */}
        <GlassCard
          style={styles.progressBanner}
          gradient={['rgba(34, 197, 94, 0.12)', 'rgba(34, 197, 94, 0.04)']}
          borderColor="rgba(34, 197, 94, 0.2)"
        >
          <View style={styles.progressIcon}>
            <Ionicons name="trending-up" size={18} color="#22C55E" />
          </View>
          <View style={styles.progressText}>
            <Text style={styles.progressTitle}>Great progress this week</Text>
            <Text style={styles.progressSubtitle}>
              <Text style={{ color: '#22C55E', fontWeight: '600' }}>+12%</Text> more consistent than last week
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
        </GlassCard>

        {/* Bento Grid */}
        <View style={styles.bentoGrid}>

          {/* Row 1: Calories + Water & Streak */}
          <View style={styles.bentoRow}>
            {/* Calories Card */}
            <GlassCard
              style={[styles.bentoCard, styles.bentoLarge]}
              gradient={['rgba(59, 130, 246, 0.08)', 'rgba(139, 92, 246, 0.04)']}
              borderColor="rgba(59, 130, 246, 0.15)"
              onPress={() => router.push('/(tabs)/log')}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Ionicons name="flame" size={16} color="#3B82F6" />
                  <Text style={styles.cardLabel}>Calories</Text>
                </View>
                <Text style={styles.cardPercent}>{caloriesPercent}%</Text>
              </View>

              <View style={styles.caloriesBody}>
                <CircularProgress progress={caloriesPercent} size={90} strokeWidth={7} color="#3B82F6">
                  <View style={styles.caloriesCenter}>
                    <AnimatedNumber value={calories.consumed} style={styles.caloriesNumber} />
                    <Text style={styles.caloriesUnit}>kcal</Text>
                  </View>
                </CircularProgress>

                <View style={styles.caloriesStats}>
                  <View style={styles.calorieStat}>
                    <Text style={styles.calorieStatLabel}>Goal</Text>
                    <Text style={styles.calorieStatValue}>{calories.goal}</Text>
                  </View>
                  <View style={styles.calorieStatDivider} />
                  <View style={styles.calorieStat}>
                    <Text style={styles.calorieStatLabel}>Left</Text>
                    <Text style={[styles.calorieStatValue, { color: '#22C55E' }]}>
                      {calories.goal - calories.consumed}
                    </Text>
                  </View>
                </View>
              </View>
            </GlassCard>

            {/* Right Column */}
            <View style={styles.bentoColumn}>
              {/* Water */}
              <GlassCard
                style={[styles.bentoCard, styles.bentoSmall]}
                gradient={['rgba(6, 182, 212, 0.08)', 'rgba(6, 182, 212, 0.03)']}
                borderColor="rgba(6, 182, 212, 0.15)"
                onPress={() => {}}
              >
                <View style={styles.smallCardHeader}>
                  <Ionicons name="water" size={14} color="#06B6D4" />
                  <Text style={styles.smallCardLabel}>Hydration</Text>
                </View>
                <WaterGlass current={water.current} goal={water.goal} />
              </GlassCard>

              {/* Streak */}
              <GlassCard
                style={[styles.bentoCard, styles.bentoSmall]}
                gradient={['rgba(249, 115, 22, 0.12)', 'rgba(249, 115, 22, 0.04)']}
                borderColor="rgba(249, 115, 22, 0.2)"
              >
                <View style={styles.streakCard}>
                  <View style={styles.streakIconContainer}>
                    <Ionicons name="flame" size={22} color="#F97316" />
                  </View>
                  <AnimatedNumber value={streak} style={styles.streakNumber} />
                  <Text style={styles.streakLabel}>day streak</Text>
                </View>
              </GlassCard>
            </View>
          </View>

          {/* Macros Card */}
          <GlassCard style={[styles.bentoCard, styles.bentoFull]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="pie-chart" size={16} color="rgba(255,255,255,0.5)" />
                <Text style={styles.cardLabel}>Macros</Text>
              </View>
              <Pressable>
                <Text style={styles.cardLink}>Details</Text>
              </Pressable>
            </View>
            <View style={styles.macrosGrid}>
              {macros.map((macro, i) => (
                <MacroBar key={i} {...macro} />
              ))}
            </View>
          </GlassCard>

          {/* Workout Card */}
          <GlassCard
            style={[styles.bentoCard, styles.bentoFull]}
            gradient={['rgba(236, 72, 153, 0.08)', 'rgba(139, 92, 246, 0.04)']}
            borderColor="rgba(236, 72, 153, 0.15)"
            onPress={() => {}}
          >
            <View style={styles.workoutCard}>
              <View style={styles.workoutLeft}>
                <View style={styles.workoutBadge}>
                  <Ionicons name="time-outline" size={10} color="#EC4899" />
                  <Text style={styles.workoutBadgeText}>SCHEDULED 4:00 PM</Text>
                </View>
                <Text style={styles.workoutTitle}>Push Day</Text>
                <Text style={styles.workoutSubtitle}>Chest, Shoulders & Triceps</Text>
                <View style={styles.workoutStats}>
                  <View style={styles.workoutStat}>
                    <Ionicons name="layers-outline" size={12} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.workoutStatText}>8 exercises</Text>
                  </View>
                  <View style={styles.workoutStat}>
                    <Ionicons name="hourglass-outline" size={12} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.workoutStatText}>~45 min</Text>
                  </View>
                </View>
              </View>
              <Pressable
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                style={({ pressed }) => [styles.playButton, pressed && { transform: [{ scale: 0.95 }] }]}
              >
                <LinearGradient colors={['#EC4899', '#8B5CF6']} style={styles.playButtonGradient}>
                  <Ionicons name="play" size={26} color="#FFF" style={{ marginLeft: 3 }} />
                </LinearGradient>
              </Pressable>
            </View>
          </GlassCard>

          {/* Schedule Card */}
          <GlassCard style={[styles.bentoCard, styles.bentoFull, { paddingBottom: 8 }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="calendar" size={16} color="rgba(255,255,255,0.5)" />
                <Text style={styles.cardLabel}>Today's Schedule</Text>
              </View>
              <Pressable>
                <Text style={styles.cardLink}>Edit</Text>
              </Pressable>
            </View>
            <View style={styles.scheduleList}>
              {schedule.map((item, i) => (
                <ScheduleItem key={i} {...item} />
              ))}
            </View>
          </GlassCard>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {[
              { icon: 'scan-outline', label: 'Scan', colors: ['#F59E0B', '#D97706'] },
              { icon: 'add', label: 'Log Meal', colors: ['#10B981', '#059669'] },
              { icon: 'barbell', label: 'Workout', colors: ['#3B82F6', '#2563EB'] },
              { icon: 'heart', label: 'Check-in', colors: ['#EC4899', '#DB2777'] },
            ].map((action, i) => (
              <Pressable
                key={i}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={({ pressed }) => [styles.quickAction, pressed && { transform: [{ scale: 0.92 }], opacity: 0.8 }]}
              >
                <LinearGradient colors={action.colors} style={styles.quickActionIcon}>
                  <Ionicons name={action.icon as any} size={20} color="#FFF" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  content: {
    paddingHorizontal: PADDING,
    paddingTop: 56,
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },

  // Progress Banner
  progressBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 16,
  },
  progressIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressText: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 1,
  },

  // Glass Card
  glassCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 14,
  },

  // Bento
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
  bentoCard: {},
  bentoLarge: {
    width: HALF_WIDTH + 16,
    minHeight: 180,
  },
  bentoSmall: {
    flex: 1,
  },
  bentoFull: {
    width: '100%',
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  cardPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  cardLink: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  smallCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  smallCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },

  // Calories
  caloriesBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caloriesCenter: {
    alignItems: 'center',
  },
  caloriesNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  caloriesUnit: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: -2,
  },
  caloriesStats: {
    alignItems: 'flex-end',
    gap: 8,
  },
  calorieStat: {
    alignItems: 'flex-end',
  },
  calorieStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  calorieStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: -1,
  },
  calorieStatDivider: {
    width: 30,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Water
  waterGlassContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  waterGlass: {
    width: 32,
    height: 44,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    overflow: 'hidden',
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  waterWave: {
    position: 'absolute',
    top: -3,
    left: -5,
    right: -5,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
  },
  glassReflection: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 4,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
  },
  waterInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  waterCurrent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22D3EE',
  },
  waterGoal: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
  },

  // Streak
  streakCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakIconContainer: {
    marginBottom: 4,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F97316',
  },
  streakLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    marginTop: -2,
  },

  // Macros
  macrosGrid: {
    gap: 10,
  },
  macroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  macroIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroInfo: {
    flex: 1,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  macroLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  macroValue: {
    fontSize: 12,
  },
  macroGoal: {
    color: 'rgba(255,255,255,0.35)',
  },
  macroTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Workout
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutLeft: {
    flex: 1,
  },
  workoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  workoutBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EC4899',
    letterSpacing: 0.3,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  workoutSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutStatText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  playButton: {
    marginLeft: 12,
  },
  playButtonGradient: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Schedule
  scheduleList: {},
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  scheduleItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    marginHorizontal: -14,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  scheduleTime: {
    width: 42,
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  scheduleTimeline: {
    alignItems: 'center',
    marginRight: 10,
  },
  scheduleNode: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleLine: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: 2,
  },
  scheduleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scheduleIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleText: {},
  scheduleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scheduleSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginTop: 4,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
});
