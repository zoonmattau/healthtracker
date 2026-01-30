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

export default function Preferences() {
  const router = useRouter();
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [startOfWeek, setStartOfWeek] = useState<'sunday' | 'monday'>('monday');
  const [autoRestTimer, setAutoRestTimer] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [sounds, setSounds] = useState(true);

  const SettingRow = ({
    icon,
    label,
    value,
    onPress,
  }: {
    icon: string;
    label: string;
    value: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingValue}>
        <Text style={styles.settingValueText}>{value}</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );

  const ToggleRow = ({
    icon,
    label,
    description,
    value,
    onValueChange,
  }: {
    icon: string;
    label: string;
    description?: string;
    value: boolean;
    onValueChange: (val: boolean) => void;
  }) => (
    <View style={styles.toggleRow}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.toggleInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.toggleDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={(val) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onValueChange(val);
        }}
        trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
        thumbColor={colors.text.primary}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Preferences</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dashboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          <TouchableOpacity
            style={styles.dashboardCard}
            onPress={() => router.push('/settings/customize-dashboard')}
          >
            <View style={styles.dashboardInfo}>
              <Ionicons name="grid-outline" size={24} color={colors.accent.primary} />
              <View style={styles.dashboardText}>
                <Text style={styles.dashboardLabel}>Customize Dashboard</Text>
                <Text style={styles.dashboardDesc}>Reorder sections and quick actions</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Units Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units & Formats</Text>
          <View style={styles.card}>
            <SettingRow
              icon="📏"
              label="Units"
              value={units === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lbs, ft)'}
              onPress={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="📅"
              label="Start of Week"
              value={startOfWeek === 'monday' ? 'Monday' : 'Sunday'}
              onPress={() => setStartOfWeek(startOfWeek === 'monday' ? 'sunday' : 'monday')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="🕐"
              label="Time Format"
              value="12-hour"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Workout Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout</Text>
          <View style={styles.card}>
            <SettingRow
              icon="⏱️"
              label="Default Rest Timer"
              value="90 seconds"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="🔄"
              label="Auto-start Rest Timer"
              description="Automatically start timer after logging a set"
              value={autoRestTimer}
              onValueChange={setAutoRestTimer}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="🏋️"
              label="Default Weight Increment"
              value="2.5 kg"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* App Behavior */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Behavior</Text>
          <View style={styles.card}>
            <ToggleRow
              icon="📳"
              label="Haptic Feedback"
              description="Vibration feedback for actions"
              value={haptics}
              onValueChange={setHaptics}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="🔊"
              label="Sound Effects"
              description="Audio feedback for timers and actions"
              value={sounds}
              onValueChange={setSounds}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="📱"
              label="Keep Screen On"
              value="During Workout"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <SettingRow
              icon="☁️"
              label="Sync Frequency"
              value="Real-time"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="💾"
              label="Offline Mode"
              value="Enabled"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Reset */}
        <TouchableOpacity style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
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
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  settingLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingValueText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleDescription: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginHorizontal: spacing.lg,
  },
  resetButton: {
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  resetButtonText: {
    fontSize: fontSize.md,
    color: colors.error.primary,
  },
  dashboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  dashboardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dashboardText: {},
  dashboardLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  dashboardDesc: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
