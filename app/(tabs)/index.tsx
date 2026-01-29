import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

const { width } = Dimensions.get('window');

// Animated Progress Ring Component
function ProgressRing({
  progress,
  size = 140,
  strokeWidth = 12,
  color = colors.accent.primary
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={{ width: size, height: size }}>
      {/* Background Ring */}
      <View
        style={[
          styles.ringBackground,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
          },
        ]}
      />
      {/* Progress Ring - using a view-based approach for web compatibility */}
      <View
        style={[
          styles.ringProgress,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: 'transparent',
            borderRightColor: progress > 25 ? color : 'transparent',
            borderBottomColor: progress > 50 ? color : 'transparent',
            borderLeftColor: progress > 75 ? color : 'transparent',
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
    </View>
  );
}

// Animated Macro Bar Component
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
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.macroItem}>
      <View style={styles.macroHeader}>
        <View style={styles.macroLabelContainer}>
          <View style={[styles.macroIcon, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon as any} size={14} color={color} />
          </View>
          <Text style={styles.macroLabel}>{label}</Text>
        </View>
        <Text style={styles.macroValue}>
          <Text style={{ color: color, fontWeight: '600' }}>{current}g</Text>
          <Text style={styles.macroGoal}> / {goal}g</Text>
        </Text>
      </View>
      <View style={styles.macroBarContainer}>
        <Animated.View
          style={[
            styles.macroBarFill,
            {
              width: widthInterpolate,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

// Quick Action Button Component
function QuickAction({
  icon,
  label,
  gradient,
  onPress,
}: {
  icon: string;
  label: string;
  gradient: string[];
  onPress?: () => void;
}) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.quickAction,
        pressed && styles.quickActionPressed,
      ]}
    >
      <LinearGradient
        colors={gradient}
        style={styles.quickActionIconContainer}
      >
        <Ionicons name={icon as any} size={22} color="#FFF" />
      </LinearGradient>
      <Text style={styles.quickActionText}>{label}</Text>
    </Pressable>
  );
}

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const caloriesScale = useRef(new Animated.Value(0.9)).current;
  const cardsTranslate = useRef(new Animated.Value(30)).current;
  const cardsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(caloriesScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(cardsOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(cardsTranslate, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

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

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  // Placeholder data - will be dynamic later
  const caloriesConsumed = 1840;
  const caloriesGoal = 2400;
  const caloriesRemaining = caloriesGoal - caloriesConsumed;
  const caloriesPercent = Math.round((caloriesConsumed / caloriesGoal) * 100);

  const macros = {
    protein: { current: 142, goal: 180, color: '#EF4444', icon: 'fish-outline' },
    carbs: { current: 180, goal: 250, color: '#F59E0B', icon: 'leaf-outline' },
    fat: { current: 62, goal: 80, color: '#3B82F6', icon: 'water-outline' },
  };

  const streak = 12;

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
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()}{userName ? `, ${userName}` : ''} 👋
          </Text>
          <Text style={styles.date}>{getFormattedDate()}</Text>
        </View>
        <Pressable
          style={styles.avatarContainer}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/(tabs)/profile');
          }}
        >
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {userName ? userName[0].toUpperCase() : '?'}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Calories Card */}
      <Animated.View
        style={[
          styles.caloriesCard,
          {
            transform: [{ scale: caloriesScale }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.caloriesGradient}
        />

        <View style={styles.caloriesContent}>
          <View style={styles.caloriesLeft}>
            <View style={styles.caloriesRingContainer}>
              <ProgressRing progress={caloriesPercent} />
              <View style={styles.caloriesCenter}>
                <Text style={styles.caloriesNumber}>{caloriesConsumed}</Text>
                <Text style={styles.caloriesUnit}>kcal</Text>
              </View>
            </View>
          </View>

          <View style={styles.caloriesRight}>
            <View style={styles.caloriesStat}>
              <Text style={styles.caloriesStatLabel}>Goal</Text>
              <Text style={styles.caloriesStatValue}>{caloriesGoal}</Text>
            </View>
            <View style={styles.caloriesDivider} />
            <View style={styles.caloriesStat}>
              <Text style={styles.caloriesStatLabel}>Remaining</Text>
              <Text style={[styles.caloriesStatValue, { color: colors.success.primary }]}>
                {caloriesRemaining}
              </Text>
            </View>
          </View>
        </View>

        {/* Macros */}
        <View style={styles.macrosContainer}>
          <MacroBar {...macros.protein} label="Protein" />
          <MacroBar {...macros.carbs} label="Carbs" />
          <MacroBar {...macros.fat} label="Fat" />
        </View>
      </Animated.View>

      {/* Today's Workout Card */}
      <Animated.View
        style={[
          styles.workoutCard,
          {
            opacity: cardsOpacity,
            transform: [{ translateY: cardsTranslate }],
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.workoutPressable,
            pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <View style={styles.workoutContent}>
            <View style={styles.workoutInfo}>
              <View style={styles.workoutBadge}>
                <Ionicons name="barbell" size={14} color={colors.accent.primary} />
                <Text style={styles.workoutBadgeText}>TODAY'S WORKOUT</Text>
              </View>
              <Text style={styles.workoutTitle}>Push Day - Chest & Triceps</Text>
              <Text style={styles.workoutMeta}>8 exercises • ~45 min</Text>
            </View>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.playButton}
            >
              <Ionicons name="play" size={24} color="#FFF" style={{ marginLeft: 3 }} />
            </LinearGradient>
          </View>
        </Pressable>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View
        style={[
          { opacity: cardsOpacity, transform: [{ translateY: cardsTranslate }] },
        ]}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            icon="camera-outline"
            label="Scan Food"
            gradient={['#F59E0B', '#D97706']}
          />
          <QuickAction
            icon="restaurant-outline"
            label="Log Meal"
            gradient={['#10B981', '#059669']}
          />
          <QuickAction
            icon="barbell-outline"
            label="Workout"
            gradient={['#3B82F6', '#2563EB']}
          />
          <QuickAction
            icon="water-outline"
            label="Water"
            gradient={['#06B6D4', '#0891B2']}
          />
        </View>
      </Animated.View>

      {/* Streak Card */}
      <Animated.View
        style={[
          styles.streakCard,
          {
            opacity: cardsOpacity,
            transform: [{ translateY: cardsTranslate }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(249, 115, 22, 0.15)', 'rgba(234, 88, 12, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
          />
        <View style={styles.streakContent}>
          <View style={styles.streakLeft}>
            <View style={styles.streakIconContainer}>
              <Text style={styles.streakEmoji}>🔥</Text>
            </View>
            <View>
              <Text style={styles.streakNumber}>{streak} Day Streak!</Text>
              <Text style={styles.streakText}>Keep it going, champion</Text>
            </View>
          </View>
          <View style={styles.streakDays}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <View key={i} style={styles.streakDay}>
                <Text style={styles.streakDayLabel}>{day}</Text>
                <View
                  style={[
                    styles.streakDot,
                    i < 5 && styles.streakDotActive,
                  ]}
                >
                  {i < 5 && <Ionicons name="checkmark" size={10} color="#FFF" />}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Mental Check-in Card */}
      <Animated.View
        style={[
          styles.checkinCard,
          {
            opacity: cardsOpacity,
            transform: [{ translateY: cardsTranslate }],
          },
        ]}
      >
        <View style={styles.checkinContent}>
          <View style={styles.checkinIcon}>
            <Ionicons name="happy-outline" size={24} color={colors.accent.primary} />
          </View>
          <View style={styles.checkinText}>
            <Text style={styles.checkinTitle}>How are you feeling today?</Text>
            <Text style={styles.checkinSubtitle}>Quick daily check-in</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </View>
      </Animated.View>
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
    paddingTop: 60,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: 4,
  },
  avatarContainer: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },

  // Calories Card
  caloriesCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  caloriesGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  caloriesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  caloriesLeft: {
    flex: 1,
  },
  caloriesRingContainer: {
    position: 'relative',
    width: 140,
    height: 140,
  },
  caloriesCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text.primary,
  },
  caloriesUnit: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: -4,
  },
  caloriesRight: {
    flex: 1,
    paddingLeft: spacing.lg,
  },
  caloriesStat: {
    marginBottom: spacing.md,
  },
  caloriesStatLabel: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  caloriesStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  caloriesDivider: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginBottom: spacing.md,
  },

  // Progress Ring
  ringBackground: {
    position: 'absolute',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ringProgress: {
    position: 'absolute',
  },

  // Macros
  macrosContainer: {
    gap: spacing.md,
  },
  macroItem: {
    gap: spacing.xs,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  macroIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  macroValue: {
    fontSize: fontSize.sm,
  },
  macroGoal: {
    color: colors.text.tertiary,
  },
  macroBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Workout Card
  workoutCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  workoutPressable: {
    padding: spacing.lg,
  },
  workoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  workoutBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent.primary,
    letterSpacing: 0.5,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  workoutMeta: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Section Title
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  quickActionPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  quickActionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    fontWeight: '500',
  },

  // Streak Card
  streakCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
    overflow: 'hidden',
  },
  streakContent: {
    gap: spacing.md,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  streakText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  streakDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakDay: {
    alignItems: 'center',
    gap: 6,
  },
  streakDayLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  streakDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakDotActive: {
    backgroundColor: '#F97316',
  },

  // Check-in Card
  checkinCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  checkinContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  checkinIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkinText: {
    flex: 1,
  },
  checkinTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  checkinSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
});
