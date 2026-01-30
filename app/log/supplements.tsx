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

// Default supplements list - in a real app, users would customize this
const DEFAULT_SUPPLEMENTS = [
  { id: 'creatine', name: 'Creatine', dosage: '5g', time: 'Morning', emoji: '💪' },
  { id: 'vitamin-d3', name: 'Vitamin D3', dosage: '4000 IU', time: 'Morning', emoji: '☀️' },
  { id: 'omega-3', name: 'Omega-3', dosage: '2 capsules', time: 'With lunch', emoji: '🐟' },
  { id: 'magnesium', name: 'Magnesium', dosage: '400mg', time: 'Before bed', emoji: '💤' },
  { id: 'protein-shake', name: 'Protein Shake', dosage: '30g', time: 'Post-workout', emoji: '🥤' },
];

const SUGGESTED_SUPPLEMENTS = [
  { name: 'Zinc', description: 'Immune support', emoji: '🛡️' },
  { name: 'B12', description: 'Energy metabolism', emoji: '⚡' },
  { name: 'Ashwagandha', description: 'Stress & recovery', emoji: '🧘' },
];

export default function LogSupplements() {
  const router = useRouter();
  const { todaySupplements, toggleSupplement } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggle = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleSupplement(id);
  };

  const takenCount = todaySupplements.length;
  const totalCount = DEFAULT_SUPPLEMENTS.length;

  const filteredSupplements = DEFAULT_SUPPLEMENTS.filter(
    s => s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Supplements</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.accent.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressCount}>
              {takenCount}/{totalCount} taken
            </Text>
          </View>
          <View style={[
            styles.progressCircle,
            takenCount === totalCount && styles.progressCircleComplete
          ]}>
            <Text style={styles.progressPercent}>
              {totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0}%
            </Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search supplements..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* My Supplements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Supplements</Text>
          {filteredSupplements.map((supplement) => {
            const isTaken = todaySupplements.includes(supplement.id);
            return (
              <TouchableOpacity
                key={supplement.id}
                style={[styles.supplementCard, isTaken && styles.supplementCardTaken]}
                onPress={() => handleToggle(supplement.id)}
              >
                <View style={styles.supplementEmoji}>
                  <Text style={styles.emoji}>{supplement.emoji}</Text>
                </View>
                <View style={styles.supplementInfo}>
                  <Text style={[styles.supplementName, isTaken && styles.supplementNameTaken]}>
                    {supplement.name}
                  </Text>
                  <Text style={styles.supplementMeta}>
                    {supplement.dosage} · {supplement.time}
                  </Text>
                </View>
                <View style={[styles.checkbox, isTaken && styles.checkboxChecked]}>
                  {isTaken && (
                    <Ionicons name="checkmark" size={18} color={colors.text.primary} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add New */}
        <TouchableOpacity style={styles.addNewButton}>
          <Ionicons name="add-circle-outline" size={24} color={colors.accent.primary} />
          <Text style={styles.addNewText}>Add New Supplement</Text>
        </TouchableOpacity>

        {/* Suggested */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested For You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.suggestedRow}>
              {SUGGESTED_SUPPLEMENTS.map((supp, index) => (
                <TouchableOpacity key={index} style={styles.suggestedCard}>
                  <Text style={styles.suggestedEmoji}>{supp.emoji}</Text>
                  <Text style={styles.suggestedName}>{supp.name}</Text>
                  <Text style={styles.suggestedDesc}>{supp.description}</Text>
                  <View style={styles.suggestedAddButton}>
                    <Ionicons name="add" size={16} color={colors.accent.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Reminders */}
        <TouchableOpacity style={styles.reminderCard}>
          <View style={styles.reminderIcon}>
            <Ionicons name="notifications-outline" size={24} color={colors.accent.primary} />
          </View>
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTitle}>Set Reminders</Text>
            <Text style={styles.reminderText}>Get notified when it's time to take your supplements</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

        {/* Completion Message */}
        {takenCount === totalCount && totalCount > 0 && (
          <View style={styles.completionCard}>
            <Text style={styles.completionEmoji}>🎉</Text>
            <Text style={styles.completionText}>All supplements taken for today!</Text>
          </View>
        )}
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
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accent.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  progressInfo: {},
  progressTitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  progressCount: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleComplete: {
    backgroundColor: colors.success.primary,
  },
  progressPercent: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginLeft: spacing.sm,
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
  supplementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  supplementCardTaken: {
    backgroundColor: colors.success.muted,
    borderWidth: 1,
    borderColor: colors.success.primary,
  },
  supplementEmoji: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  emoji: {
    fontSize: 24,
  },
  supplementInfo: {
    flex: 1,
  },
  supplementName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  supplementNameTaken: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  supplementMeta: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success.primary,
    borderColor: colors.success.primary,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderStyle: 'dashed',
  },
  addNewText: {
    fontSize: fontSize.md,
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
  },
  suggestedRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  suggestedCard: {
    width: 140,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  suggestedEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  suggestedName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  suggestedDesc: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  suggestedAddButton: {
    marginTop: spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  reminderText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  completionCard: {
    backgroundColor: colors.success.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.success.primary,
  },
  completionEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  completionText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.success.primary,
  },
});
