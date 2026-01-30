import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData } from '../../src/context/DataContext';

const QUICK_ADD = [250, 500, 750, 1000];

interface WaterLog {
  time: string;
  amount: number;
}

export default function LogWater() {
  const router = useRouter();
  const { todayWater, addWater, goals } = useData();
  const [sessionLogs, setSessionLogs] = useState<WaterLog[]>([]);

  const intake = todayWater.amount;
  const goal = todayWater.goal || goals.water;
  const progress = Math.min((intake / goal) * 100, 100);

  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleAddWater = async (amount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await addWater(amount);

    // Track this log entry
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setSessionLogs(prev => [{ time: timeStr, amount }, ...prev]);
  };

  const handleRemoveWater = async () => {
    if (intake >= 250) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await addWater(-250);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Log Water</Text>
        <TouchableOpacity onPress={handleRemoveWater} style={styles.undoButton}>
          <Ionicons name="remove-circle-outline" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Water Circle */}
        <View style={styles.circleContainer}>
          <View style={styles.outerCircle}>
            <View style={[styles.waterFill, { height: `${progress}%` }]} />
            <View style={styles.circleContent}>
              <Ionicons name="water" size={32} color={colors.accent.primary} />
              <Text style={styles.intakeAmount}>{(intake / 1000).toFixed(1)}L</Text>
              <Text style={styles.intakeGoal}>of {goal / 1000}L goal</Text>
            </View>
          </View>
          <Text style={styles.progressText}>
            {progress >= 100 ? 'Goal reached!' : `${Math.round(progress)}% complete`}
          </Text>
        </View>

        {/* Quick Add Buttons */}
        <View style={styles.quickAddSection}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddGrid}>
            {QUICK_ADD.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAddButton}
                onPress={() => handleAddWater(amount)}
              >
                <Ionicons name="water" size={20} color={colors.accent.primary} />
                <Text style={styles.quickAddAmount}>{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Add */}
        <TouchableOpacity style={styles.customButton}>
          <Ionicons name="add-circle" size={24} color={colors.accent.primary} />
          <Text style={styles.customButtonText}>Custom Amount</Text>
        </TouchableOpacity>

        {/* Session Log */}
        {sessionLogs.length > 0 && (
          <View style={styles.logSection}>
            <Text style={styles.sectionTitle}>Added This Session</Text>
            <View style={styles.logCard}>
              {sessionLogs.map((log, index) => (
                <View key={index}>
                  <View style={styles.logItem}>
                    <Text style={styles.logTime}>{log.time}</Text>
                    <Text style={styles.logAmount}>+{log.amount}ml</Text>
                  </View>
                  {index < sessionLogs.length - 1 && <View style={styles.logDivider} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Total Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Today's Total</Text>
            <Text style={styles.summaryValue}>{intake}ml</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.summaryValue, intake >= goal && styles.goalMet]}>
              {Math.max(goal - intake, 0)}ml
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Done Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        }}
      >
        <Text style={styles.saveButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  undoButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.background.secondary,
    borderWidth: 4,
    borderColor: colors.accent.primary,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.accent.muted,
  },
  circleContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  intakeAmount: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  intakeGoal: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  progressText: {
    fontSize: fontSize.md,
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
    marginTop: spacing.md,
  },
  quickAddSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  quickAddGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickAddButton: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.sm,
  },
  quickAddAmount: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderStyle: 'dashed',
  },
  customButtonText: {
    fontSize: fontSize.md,
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
  },
  logSection: {
    marginBottom: spacing.lg,
  },
  logCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  logTime: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  logAmount: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.success.primary,
  },
  logDivider: {
    height: 1,
    backgroundColor: colors.border.primary,
  },
  summaryCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  goalMet: {
    color: colors.success.primary,
  },
  saveButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  saveButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
});
