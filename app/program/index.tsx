import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData, TrainingProgram } from '../../src/context/DataContext';
import { TRAINING_PROGRAMS } from '../../src/data/programs';

const LEVEL_COLORS = {
  beginner: colors.success.primary,
  intermediate: colors.warning.primary,
  advanced: colors.error.primary,
};

const GOAL_LABELS = {
  strength: 'Strength',
  hypertrophy: 'Muscle Growth',
  endurance: 'Endurance',
  general: 'General Fitness',
};

const GOAL_ICONS = {
  strength: 'barbell-outline',
  hypertrophy: 'fitness-outline',
  endurance: 'heart-outline',
  general: 'body-outline',
};

export default function Programs() {
  const router = useRouter();
  const { activeProgram, startProgram, endProgram, getProgramProgress } = useData();
  const [selectedLevel, setSelectedLevel] = useState<TrainingProgram['level'] | null>(null);

  const filteredPrograms = selectedLevel
    ? TRAINING_PROGRAMS.filter(p => p.level === selectedLevel)
    : TRAINING_PROGRAMS;

  const handleStartProgram = (program: TrainingProgram) => {
    if (activeProgram) {
      Alert.alert(
        'Active Program',
        'You already have an active program. Would you like to end it and start this one?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Switch Programs',
            onPress: async () => {
              await endProgram();
              await startProgram(program);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.push('/program/active');
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Start Program',
        `Start "${program.name}"? This is a ${program.durationWeeks}-week program.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Start',
            onPress: async () => {
              await startProgram(program);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.push('/program/active');
            },
          },
        ]
      );
    }
  };

  const progress = getProgramProgress();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Training Programs</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active Program Card */}
        {activeProgram && (
          <TouchableOpacity
            style={styles.activeCard}
            onPress={() => router.push('/program/active')}
          >
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE PROGRAM</Text>
            </View>
            <Text style={styles.activeTitle}>{activeProgram.programName}</Text>
            <View style={styles.activeProgress}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBar, { width: `${progress.percentComplete}%` }]}
                />
              </View>
              <Text style={styles.progressText}>
                Week {activeProgram.currentWeek} · {progress.percentComplete}% complete
              </Text>
            </View>
            <View style={styles.activeActions}>
              <Text style={styles.continueText}>Continue Training</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.primary} />
            </View>
          </TouchableOpacity>
        )}

        {/* Level Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by level</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterChip, !selectedLevel && styles.filterChipActive]}
                onPress={() => setSelectedLevel(null)}
              >
                <Text style={[styles.filterChipText, !selectedLevel && styles.filterChipTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.filterChip,
                    selectedLevel === level && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedLevel(level)}
                >
                  <View
                    style={[styles.levelDot, { backgroundColor: LEVEL_COLORS[level] }]}
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedLevel === level && styles.filterChipTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Programs List */}
        <View style={styles.programsList}>
          {filteredPrograms.map(program => (
            <TouchableOpacity
              key={program.id}
              style={styles.programCard}
              onPress={() => handleStartProgram(program)}
            >
              <View style={styles.programHeader}>
                <View style={styles.programIcon}>
                  <Ionicons
                    name={GOAL_ICONS[program.goal] as any}
                    size={24}
                    color={colors.accent.primary}
                  />
                </View>
                <View style={styles.programInfo}>
                  <Text style={styles.programName}>{program.name}</Text>
                  <View style={styles.programMeta}>
                    <View
                      style={[
                        styles.levelBadge,
                        { backgroundColor: LEVEL_COLORS[program.level] + '20' },
                      ]}
                    >
                      <View
                        style={[styles.levelDotSmall, { backgroundColor: LEVEL_COLORS[program.level] }]}
                      />
                      <Text
                        style={[styles.levelText, { color: LEVEL_COLORS[program.level] }]}
                      >
                        {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.goalText}>{GOAL_LABELS[program.goal]}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.programDescription}>{program.description}</Text>

              <View style={styles.programStats}>
                <View style={styles.statItem}>
                  <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
                  <Text style={styles.statText}>{program.durationWeeks} weeks</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="barbell-outline" size={16} color={colors.text.secondary} />
                  <Text style={styles.statText}>{program.daysPerWeek} days/week</Text>
                </View>
              </View>

              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>
                  {activeProgram?.programId === program.id ? 'Active' : 'Start Program'}
                </Text>
                {activeProgram?.programId !== program.id && (
                  <Ionicons name="play" size={16} color={colors.accent.primary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  activeCard: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  activeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  activeBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  activeTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  activeProgress: {
    marginBottom: spacing.md,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.text.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  activeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  continueText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  filterChipActive: {
    backgroundColor: colors.accent.primary,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  programsList: {
    paddingBottom: spacing.xxl,
  },
  programCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  programIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  programMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  levelDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  levelText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  goalText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  programDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  programStats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent.muted,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  startButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.accent.primary,
  },
});
