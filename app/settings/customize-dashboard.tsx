import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import {
  useDashboard,
  QuickAction,
  DashboardSection,
  UserFocus,
  ACTION_DETAILS,
} from '../../src/context/DashboardContext';

const FOCUS_OPTIONS: { id: UserFocus; label: string; description: string; icon: string }[] = [
  { id: 'nutrition', label: 'Nutrition Focused', description: 'Prioritize calorie & macro tracking', icon: '🥗' },
  { id: 'training', label: 'Training Focused', description: 'Prioritize workouts & exercises', icon: '🏋️' },
  { id: 'hybrid', label: 'Balanced', description: 'Equal focus on both', icon: '⚖️' },
];

const ALL_ACTIONS: QuickAction[] = ['food', 'workout', 'water', 'weight', 'sleep', 'supplements'];

const SECTION_LABELS: Record<DashboardSection, { label: string; description: string }> = {
  calories: { label: 'Calorie Tracker', description: 'Daily calorie goal progress' },
  macros: { label: 'Macros Breakdown', description: 'Protein, carbs, and fat tracking' },
  actions: { label: 'Quick Actions', description: 'Fast access buttons' },
  todayWorkout: { label: "Today's Workout", description: 'Current workout from your program' },
  streak: { label: 'Streak Counter', description: 'Your consistency tracker' },
};

export default function CustomizeDashboard() {
  const router = useRouter();
  const { config, updateQuickActions, updateVisibleSections, setUserFocus, resetToDefault } = useDashboard();

  const [selectedFocus, setSelectedFocus] = useState<UserFocus>(config.userFocus);
  const [selectedActions, setSelectedActions] = useState<QuickAction[]>(config.quickActions);
  const [visibleSections, setVisibleSections] = useState<DashboardSection[]>(config.visibleSections);

  const handleFocusChange = async (focus: UserFocus) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedFocus(focus);
    await setUserFocus(focus);
  };

  const toggleAction = (action: QuickAction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let newActions: QuickAction[];
    if (selectedActions.includes(action)) {
      newActions = selectedActions.filter((a) => a !== action);
    } else if (selectedActions.length < 4) {
      newActions = [...selectedActions, action];
    } else {
      return; // Max 4 actions
    }
    setSelectedActions(newActions);
    updateQuickActions(newActions);
  };

  const toggleSection = (section: DashboardSection) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let newSections: DashboardSection[];
    if (visibleSections.includes(section)) {
      newSections = visibleSections.filter((s) => s !== section);
    } else {
      newSections = [...visibleSections, section];
    }
    setVisibleSections(newSections);
    updateVisibleSections(newSections);
  };

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    resetToDefault();
    setSelectedFocus('hybrid');
    setSelectedActions(['food', 'workout', 'water']);
    setVisibleSections(['calories', 'macros', 'actions', 'todayWorkout', 'streak']);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Customize Dashboard</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Focus Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's your focus?</Text>
          <Text style={styles.sectionDescription}>
            We'll optimize your dashboard based on your goals
          </Text>
          <View style={styles.focusOptions}>
            {FOCUS_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.focusCard, selectedFocus === option.id && styles.focusCardActive]}
                onPress={() => handleFocusChange(option.id)}
              >
                <Text style={styles.focusIcon}>{option.icon}</Text>
                <Text style={styles.focusLabel}>{option.label}</Text>
                <Text style={styles.focusDescription}>{option.description}</Text>
                {selectedFocus === option.id && (
                  <View style={styles.focusCheck}>
                    <Ionicons name="checkmark" size={16} color={colors.text.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionDescription}>
            Choose up to 4 actions for fast access ({selectedActions.length}/4)
          </Text>
          <View style={styles.actionsGrid}>
            {ALL_ACTIONS.map((action) => {
              const details = ACTION_DETAILS[action];
              const isSelected = selectedActions.includes(action);
              return (
                <TouchableOpacity
                  key={action}
                  style={[styles.actionCard, isSelected && styles.actionCardActive]}
                  onPress={() => toggleAction(action)}
                >
                  <View style={[styles.actionIcon, isSelected && styles.actionIconActive]}>
                    <Ionicons
                      name={details.icon as any}
                      size={24}
                      color={isSelected ? colors.text.primary : colors.text.secondary}
                    />
                  </View>
                  <Text style={[styles.actionLabel, isSelected && styles.actionLabelActive]}>
                    {details.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.actionCheck}>
                      <Ionicons name="checkmark-circle" size={20} color={colors.accent.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Dashboard Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard Sections</Text>
          <Text style={styles.sectionDescription}>
            Show or hide sections on your home screen
          </Text>
          <View style={styles.sectionsCard}>
            {(Object.keys(SECTION_LABELS) as DashboardSection[]).map((section, index) => {
              const details = SECTION_LABELS[section];
              const isVisible = visibleSections.includes(section);
              return (
                <View key={section}>
                  <View style={styles.sectionRow}>
                    <View style={styles.sectionInfo}>
                      <Text style={styles.sectionLabel}>{details.label}</Text>
                      <Text style={styles.sectionDesc}>{details.description}</Text>
                    </View>
                    <Switch
                      value={isVisible}
                      onValueChange={() => toggleSection(section)}
                      trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
                      thumbColor={colors.text.primary}
                    />
                  </View>
                  {index < Object.keys(SECTION_LABELS).length - 1 && <View style={styles.divider} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Preview Hint */}
        <View style={styles.previewHint}>
          <Ionicons name="eye-outline" size={20} color={colors.text.tertiary} />
          <Text style={styles.previewHintText}>
            Changes are saved automatically. Go back to see your customized dashboard.
          </Text>
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
  resetText: {
    fontSize: fontSize.md,
    color: colors.accent.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  focusOptions: {
    gap: spacing.md,
  },
  focusCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  focusCardActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.muted,
  },
  focusIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  focusLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  focusDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  focusCheck: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '30%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  actionCardActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.muted,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionIconActive: {
    backgroundColor: colors.accent.primary,
  },
  actionLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  actionLabelActive: {
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  actionCheck: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  sectionsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  sectionDesc: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginHorizontal: spacing.lg,
  },
  previewHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  previewHintText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
});
