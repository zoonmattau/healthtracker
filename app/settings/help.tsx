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
import { useState } from 'react';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';

const FAQ_ITEMS = [
  {
    id: '1',
    question: 'How do I log a workout?',
    answer: 'Tap the Log tab, then select "Log Workout". You can start an empty workout or choose from your templates.',
  },
  {
    id: '2',
    question: 'Can I create custom exercises?',
    answer: 'Yes! When searching for an exercise, tap "Create Custom Exercise" at the bottom of the search results.',
  },
  {
    id: '3',
    question: 'How does the calorie calculation work?',
    answer: 'We use the Mifflin-St Jeor equation based on your age, weight, height, and activity level to estimate your daily calorie needs.',
  },
  {
    id: '4',
    question: 'How do I sync with my Apple Watch?',
    answer: 'Go to Settings > Connected Devices and tap "Apple Health" to enable syncing with HealthKit.',
  },
  {
    id: '5',
    question: 'Can I export my workout data?',
    answer: 'Yes, go to Settings > Personal Info and tap "Export My Data" to download all your workout history.',
  },
  {
    id: '6',
    question: 'How do I change my daily calorie goal?',
    answer: 'Go to Settings > Goals and tap "Daily Calories" to adjust your target intake.',
  },
];

const HELP_CATEGORIES = [
  { id: 'getting-started', icon: '🚀', label: 'Getting Started' },
  { id: 'workouts', icon: '🏋️', label: 'Workouts' },
  { id: 'nutrition', icon: '🥗', label: 'Nutrition' },
  { id: 'account', icon: '👤', label: 'Account & Billing' },
];

export default function Help() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Help & FAQ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Topics</Text>
          <View style={styles.categoriesGrid}>
            {HELP_CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQ_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.faqItem}
              onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Ionicons
                  name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.text.tertiary}
                />
              </View>
              {expandedId === item.id && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Still Need Help?</Text>
          <View style={styles.supportCard}>
            <TouchableOpacity style={styles.supportOption}>
              <View style={styles.supportIcon}>
                <Ionicons name="chatbubble-ellipses" size={24} color={colors.accent.primary} />
              </View>
              <View style={styles.supportInfo}>
                <Text style={styles.supportLabel}>Live Chat</Text>
                <Text style={styles.supportMeta}>Available 9am - 6pm EST</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.supportOption}>
              <View style={styles.supportIcon}>
                <Ionicons name="mail" size={24} color={colors.accent.primary} />
              </View>
              <View style={styles.supportInfo}>
                <Text style={styles.supportLabel}>Email Support</Text>
                <Text style={styles.supportMeta}>Response within 24 hours</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.supportOption}>
              <View style={styles.supportIcon}>
                <Ionicons name="book" size={24} color={colors.accent.primary} />
              </View>
              <View style={styles.supportInfo}>
                <Text style={styles.supportLabel}>Documentation</Text>
                <Text style={styles.supportMeta}>Full guides and tutorials</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Community */}
        <TouchableOpacity style={styles.communityCard}>
          <View style={styles.communityIcon}>
            <Text style={styles.communityEmoji}>💬</Text>
          </View>
          <View style={styles.communityInfo}>
            <Text style={styles.communityTitle}>Join our Community</Text>
            <Text style={styles.communityText}>Connect with other users on Discord</Text>
          </View>
          <Ionicons name="open-outline" size={20} color={colors.accent.primary} />
        </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  faqItem: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    marginRight: spacing.md,
  },
  faqAnswer: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  supportCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  supportIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  supportInfo: {
    flex: 1,
  },
  supportLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  supportMeta: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginHorizontal: spacing.lg,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  communityEmoji: {
    fontSize: 24,
  },
  communityInfo: {
    flex: 1,
  },
  communityTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  communityText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
