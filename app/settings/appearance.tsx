import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';

const THEMES = [
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'system', label: 'System', icon: '📱' },
];

const ACCENT_COLORS = [
  { id: 'blue', color: '#3B82F6', label: 'Blue' },
  { id: 'purple', color: '#8B5CF6', label: 'Purple' },
  { id: 'pink', color: '#EC4899', label: 'Pink' },
  { id: 'green', color: '#22C55E', label: 'Green' },
  { id: 'orange', color: '#F97316', label: 'Orange' },
  { id: 'red', color: '#EF4444', label: 'Red' },
];

const APP_ICONS = [
  { id: 'default', label: 'Default', color: '#3B82F6' },
  { id: 'dark', label: 'Dark', color: '#1C1C1E' },
  { id: 'gradient', label: 'Gradient', color: '#8B5CF6' },
  { id: 'minimal', label: 'Minimal', color: '#FFFFFF' },
];

export default function Appearance() {
  const router = useRouter();
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('blue');
  const [appIcon, setAppIcon] = useState('default');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Appearance</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <View style={styles.themeRow}>
            {THEMES.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.themeCard, theme === t.id && styles.themeCardActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme(t.id);
                }}
              >
                <Text style={styles.themeIcon}>{t.icon}</Text>
                <Text style={styles.themeLabel}>{t.label}</Text>
                {theme === t.id && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={14} color={colors.text.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Accent Color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accent Color</Text>
          <View style={styles.colorGrid}>
            {ACCENT_COLORS.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.colorOption}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAccentColor(c.id);
                }}
              >
                <View
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: c.color },
                    accentColor === c.id && styles.colorSwatchActive,
                  ]}
                >
                  {accentColor === c.id && (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.colorLabel}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Icon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Icon</Text>
          <View style={styles.iconGrid}>
            {APP_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon.id}
                style={[styles.iconOption, appIcon === icon.id && styles.iconOptionActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAppIcon(icon.id);
                }}
              >
                <View style={[styles.iconPreview, { backgroundColor: icon.color }]}>
                  <Text style={styles.iconText}>LG</Text>
                </View>
                <Text style={styles.iconLabel}>{icon.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.iconNote}>
            Changing the app icon may take a moment to apply
          </Text>
        </View>

        {/* Text Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text Size</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.textSizeRow}>
              <Text style={styles.textSizeLabel}>Text Size</Text>
              <View style={styles.textSizeValue}>
                <Text style={styles.textSizeValueText}>Medium</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={styles.previewAvatar}>
                <Text style={styles.previewAvatarText}>J</Text>
              </View>
              <View style={styles.previewInfo}>
                <Text style={styles.previewName}>John Doe</Text>
                <Text style={styles.previewMeta}>Level 12 · 145 workouts</Text>
              </View>
            </View>
            <View style={styles.previewStats}>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatValue}>2,450</Text>
                <Text style={styles.previewStatLabel}>Calories</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatValue}>45m</Text>
                <Text style={styles.previewStatLabel}>Duration</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatValue}>12</Text>
                <Text style={styles.previewStatLabel}>Streak</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.previewButton, { backgroundColor: ACCENT_COLORS.find(c => c.id === accentColor)?.color }]}>
              <Text style={styles.previewButtonText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
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
  themeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  themeCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  themeCardActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.muted,
  },
  themeIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  themeLabel: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    justifyContent: 'space-between',
  },
  colorOption: {
    alignItems: 'center',
    width: '30%',
  },
  colorSwatch: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  colorSwatchActive: {
    borderWidth: 3,
    borderColor: colors.text.primary,
  },
  colorLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  iconGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionActive: {
    borderColor: colors.accent.primary,
  },
  iconPreview: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  iconLabel: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
  iconNote: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  textSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  textSizeLabel: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  textSizeValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textSizeValueText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  previewCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  previewAvatarText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.accent.primary,
  },
  previewInfo: {},
  previewName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  previewMeta: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.primary,
    marginBottom: spacing.lg,
  },
  previewStat: {
    alignItems: 'center',
  },
  previewStatValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  previewStatLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  previewButton: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
});
