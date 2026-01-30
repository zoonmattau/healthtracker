import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';

export default function Programs() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Programs</Text>
      </View>

      {/* Active Program Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Program</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No active program</Text>
          <Text style={styles.emptyText}>
            Start a program to get structured workouts tailored to your goals
          </Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Find a Program</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Browse Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse Programs</Text>
        <View style={styles.filterRow}>
          <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
            <Text style={[styles.filterChipText, styles.filterChipTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>Strength</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>Hypertrophy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>Cardio</Text>
          </TouchableOpacity>
        </View>

        {/* Placeholder program cards */}
        <TouchableOpacity style={styles.programCard} onPress={() => router.push('/program/1')}>
          <View style={styles.programImage}>
            <Text style={styles.programImageText}>💪</Text>
          </View>
          <View style={styles.programInfo}>
            <Text style={styles.programTitle}>Push Pull Legs</Text>
            <Text style={styles.programMeta}>6 days/week • 12 weeks</Text>
            <View style={styles.programRating}>
              <Text style={styles.ratingText}>★ 4.8</Text>
              <Text style={styles.downloadText}>12.4k downloads</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.programCard} onPress={() => router.push('/program/2')}>
          <View style={styles.programImage}>
            <Text style={styles.programImageText}>🏃</Text>
          </View>
          <View style={styles.programInfo}>
            <Text style={styles.programTitle}>Couch to 5K</Text>
            <Text style={styles.programMeta}>3 days/week • 8 weeks</Text>
            <View style={styles.programRating}>
              <Text style={styles.ratingText}>★ 4.6</Text>
              <Text style={styles.downloadText}>8.2k downloads</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.programCard} onPress={() => router.push('/program/3')}>
          <View style={styles.programImage}>
            <Text style={styles.programImageText}>🎯</Text>
          </View>
          <View style={styles.programInfo}>
            <Text style={styles.programTitle}>5x5 Strength</Text>
            <Text style={styles.programMeta}>3 days/week • 12 weeks</Text>
            <View style={styles.programRating}>
              <Text style={styles.ratingText}>★ 4.9</Text>
              <Text style={styles.downloadText}>22.1k downloads</Text>
            </View>
          </View>
        </TouchableOpacity>
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
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  emptyState: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  primaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
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
  programCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  programImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  programImageText: {
    fontSize: 32,
  },
  programInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  programTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  programMeta: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  programRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  ratingText: {
    fontSize: fontSize.sm,
    color: colors.warning.primary,
  },
  downloadText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
});
