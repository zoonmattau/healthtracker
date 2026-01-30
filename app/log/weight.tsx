import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData } from '../../src/context/DataContext';

export default function LogWeight() {
  const router = useRouter();
  const { weightHistory, latestWeight, addWeight, goals } = useData();
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  const currentWeight = latestWeight?.weight || 0;
  const startWeight = weightHistory.length > 0
    ? weightHistory[weightHistory.length - 1].weight
    : currentWeight;
  const goalWeight = goals.weight;

  const hasProgress = startWeight > 0 && goalWeight > 0 && startWeight !== goalWeight;
  const totalLost = startWeight - currentWeight;
  const toGoal = currentWeight - goalWeight;
  const progressPercent = hasProgress
    ? Math.round(((startWeight - currentWeight) / (startWeight - goalWeight)) * 100)
    : 0;

  // Format weight history for display
  const getDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';

    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const recentEntries = weightHistory.slice(0, 7);

  const handleSave = async () => {
    const weightValue = parseFloat(weight);
    if (!weightValue || isNaN(weightValue)) return;

    // Convert lbs to kg if needed
    const weightInKg = unit === 'lbs' ? weightValue * 0.453592 : weightValue;

    await addWeight(weightInKg);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Log Weight</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weight Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Today's Weight</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.weightInput}
              value={weight}
              onChangeText={setWeight}
              placeholder={currentWeight ? currentWeight.toFixed(1) : '0.0'}
              placeholderTextColor={colors.text.tertiary}
              keyboardType="decimal-pad"
              autoFocus
            />
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'kg' && styles.unitButtonActive]}
                onPress={() => setUnit('kg')}
              >
                <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>kg</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'lbs' && styles.unitButtonActive]}
                onPress={() => setUnit('lbs')}
              >
                <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>lbs</Text>
              </TouchableOpacity>
            </View>
          </View>
          {latestWeight && (
            <Text style={styles.lastEntry}>
              Last entry: {latestWeight.weight.toFixed(1)} kg ({getDateLabel(latestWeight.date)})
            </Text>
          )}
        </View>

        {/* Progress Stats - only show if we have data */}
        {currentWeight > 0 && (
          <View style={styles.statsCard}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Current</Text>
              <Text style={styles.statValue}>{currentWeight.toFixed(1)} kg</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Change</Text>
              <Text style={[
                styles.statValue,
                totalLost > 0 ? styles.successText : totalLost < 0 ? styles.warningText : null
              ]}>
                {totalLost > 0 ? '-' : totalLost < 0 ? '+' : ''}{Math.abs(totalLost).toFixed(1)} kg
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>To Goal</Text>
              <Text style={styles.statValue}>{toGoal.toFixed(1)} kg</Text>
            </View>
          </View>
        )}

        {/* Progress Bar - only show if meaningful progress */}
        {hasProgress && progressPercent > 0 && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress to Goal</Text>
              <Text style={styles.progressPercent}>{Math.min(progressPercent, 100)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(progressPercent, 100)}%` }
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabelText}>Start: {startWeight.toFixed(1)} kg</Text>
              <Text style={styles.progressLabelText}>Goal: {goalWeight.toFixed(1)} kg</Text>
            </View>
          </View>
        )}

        {/* History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Entries</Text>
          {recentEntries.length > 0 ? (
            recentEntries.map((entry, index) => (
              <View key={entry.id} style={styles.historyItem}>
                <Text style={styles.historyDate}>{getDateLabel(entry.date)}</Text>
                <View style={styles.historyRight}>
                  <Text style={styles.historyWeight}>{entry.weight.toFixed(1)} kg</Text>
                  {index > 0 && (
                    <Text style={[
                      styles.historyChange,
                      entry.weight < recentEntries[index - 1].weight
                        ? styles.successText
                        : entry.weight > recentEntries[index - 1].weight
                          ? styles.warningText
                          : null
                    ]}>
                      {entry.weight < recentEntries[index - 1].weight ? '↓' :
                       entry.weight > recentEntries[index - 1].weight ? '↑' : '–'}
                    </Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyHistory}>
              <Ionicons name="scale-outline" size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyHistoryText}>No weight entries yet</Text>
              <Text style={styles.emptyHistorySubtext}>Log your first weight above</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, !weight && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!weight}
        >
          <Text style={styles.saveButtonText}>Save Weight</Text>
        </TouchableOpacity>
      </View>
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
  inputCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  weightInput: {
    fontSize: 56,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    minWidth: 150,
    textAlign: 'center',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  unitButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  unitButtonActive: {
    backgroundColor: colors.accent.primary,
  },
  unitText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  unitTextActive: {
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  lastEntry: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.lg,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  successText: {
    color: colors.success.primary,
  },
  warningText: {
    color: colors.warning.primary,
  },
  progressSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  progressLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  progressPercent: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.accent.primary,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.full,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  historySection: {
    marginBottom: spacing.xl,
  },
  historyTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  historyDate: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  historyWeight: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  historyChange: {
    fontSize: fontSize.md,
    color: colors.text.tertiary,
  },
  emptyHistory: {
    alignItems: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
  },
  emptyHistoryText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptyHistorySubtext: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  saveButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.background.secondary,
  },
  saveButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
});
