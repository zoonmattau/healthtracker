import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';

export default function Progress() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Lifts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Nutrition</Text>
        </TouchableOpacity>
      </View>

      {/* Weight Section */}
      <View style={styles.section}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Current Weight</Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>+ Log</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statValue}>
            <Text style={styles.statNumber}>--</Text>
            <Text style={styles.statUnit}>kg</Text>
          </View>
          <Text style={styles.statSubtext}>No data yet</Text>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weight Over Time</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>📈</Text>
            <Text style={styles.chartPlaceholderLabel}>Log your weight to see trends</Text>
          </View>
        </View>
      </View>

      {/* Personal Records */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Records</Text>

        <View style={styles.prCard}>
          <Text style={styles.prIcon}>🏆</Text>
          <View style={styles.prInfo}>
            <Text style={styles.prExercise}>Bench Press</Text>
            <Text style={styles.prValue}>-- kg</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.addButton}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.prCard}>
          <Text style={styles.prIcon}>🏆</Text>
          <View style={styles.prInfo}>
            <Text style={styles.prExercise}>Squat</Text>
            <Text style={styles.prValue}>-- kg</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.addButton}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.prCard}>
          <Text style={styles.prIcon}>🏆</Text>
          <View style={styles.prInfo}>
            <Text style={styles.prExercise}>Deadlift</Text>
            <Text style={styles.prValue}>-- kg</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.addButton}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Photos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Progress Photos</Text>
          <TouchableOpacity>
            <Text style={styles.addButton}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.photosEmpty}>
          <Text style={styles.photosEmptyIcon}>📷</Text>
          <Text style={styles.photosEmptyText}>No photos yet</Text>
          <Text style={styles.photosEmptySubtext}>Track your visual progress over time</Text>
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
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tabActive: {
    backgroundColor: colors.accent.primary,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  statCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  addButton: {
    fontSize: fontSize.sm,
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statNumber: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  statUnit: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  statSubtext: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  chartCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  chartTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  chartPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
  },
  chartPlaceholderText: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  chartPlaceholderLabel: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  prCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  prIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  prInfo: {
    flex: 1,
  },
  prExercise: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  prValue: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  photosEmpty: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.sm,
  },
  photosEmptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  photosEmptyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  photosEmptySubtext: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
