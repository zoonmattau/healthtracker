import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';

export default function WorkoutComplete() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    duration?: string;
    exercises?: string;
    sets?: string;
    volume?: string;
    name?: string;
  }>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Parse params with fallbacks
  const duration = parseInt(params.duration || '0', 10);
  const exerciseCount = parseInt(params.exercises || '0', 10);
  const setCount = parseInt(params.sets || '0', 10);
  const totalVolume = parseInt(params.volume || '0', 10);
  const workoutName = params.name || 'Workout';

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Estimate calories (very rough: ~5 kcal per minute of strength training)
  const estimatedCalories = Math.round((duration / 60) * 5);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `Just crushed my ${workoutName} workout! 💪 ${formatDuration(duration)} min, ${exerciseCount} exercises, ${totalVolume.toLocaleString()} kg volume.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Celebration Icon */}
      <Animated.View style={[styles.celebrationContainer, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.celebrationCircle}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text style={styles.title}>Workout Complete!</Text>
        <Text style={styles.subtitle}>Great job crushing {workoutName}</Text>
      </Animated.View>

      {/* Stats Card */}
      <Animated.View style={[styles.statsCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Ionicons name="time-outline" size={24} color={colors.accent.primary} />
            <Text style={styles.statValue}>{formatDuration(duration)}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="barbell-outline" size={24} color={colors.accent.primary} />
            <Text style={styles.statValue}>{exerciseCount}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="layers-outline" size={24} color={colors.accent.primary} />
            <Text style={styles.statValue}>{setCount}</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
        </View>

        <View style={styles.volumeRow}>
          <View style={styles.volumeStat}>
            <Text style={styles.volumeLabel}>Total Volume</Text>
            <Text style={styles.volumeValue}>{totalVolume.toLocaleString()} kg</Text>
          </View>
          <View style={styles.volumeStat}>
            <Text style={styles.volumeLabel}>Calories Burned</Text>
            <Text style={styles.volumeValue}>~{estimatedCalories} kcal</Text>
          </View>
        </View>
      </Animated.View>

      {/* Streak Message */}
      <Animated.View style={[styles.streakSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.streakCard}>
          <View style={styles.streakIcon}>
            <Ionicons name="flame" size={28} color={colors.warning.primary} />
          </View>
          <View style={styles.streakInfo}>
            <Text style={styles.streakTitle}>Streak Updated!</Text>
            <Text style={styles.streakText}>Keep showing up - consistency is key</Text>
          </View>
        </View>
      </Animated.View>

      {/* Actions */}
      <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={colors.text.primary} />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl * 2,
    alignItems: 'center',
  },
  celebrationContainer: {
    marginBottom: spacing.xl,
  },
  celebrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.accent.primary,
  },
  celebrationEmoji: {
    fontSize: 56,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  statsCard: {
    width: '100%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.primary,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  volumeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  volumeStat: {
    flex: 1,
  },
  volumeLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  volumeValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  streakSection: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.warning.primary,
  },
  streakIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  streakText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    position: 'absolute',
    bottom: spacing.xxl,
    left: spacing.lg,
    right: spacing.lg,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    flex: 1,
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  shareButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  doneButton: {
    flex: 2,
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
});
