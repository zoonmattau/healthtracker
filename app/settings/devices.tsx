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

const CONNECTED_DEVICES = [
  {
    id: '1',
    name: 'Apple Watch Series 9',
    type: 'watch',
    connected: true,
    lastSync: '2 min ago',
    icon: '⌚',
  },
];

const AVAILABLE_INTEGRATIONS = [
  { id: 'apple_health', name: 'Apple Health', icon: '❤️', description: 'Sync workouts, steps, and heart rate' },
  { id: 'garmin', name: 'Garmin Connect', icon: '🏃', description: 'Import runs and cycling activities' },
  { id: 'fitbit', name: 'Fitbit', icon: '📊', description: 'Sync sleep and activity data' },
  { id: 'strava', name: 'Strava', icon: '🚴', description: 'Share workouts with your network' },
  { id: 'myfitnesspal', name: 'MyFitnessPal', icon: '🍎', description: 'Sync nutrition data' },
];

export default function Devices() {
  const router = useRouter();
  const [autoSync, setAutoSync] = useState(true);
  const [backgroundSync, setBackgroundSync] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Connected Devices</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Connected Devices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected</Text>
          {CONNECTED_DEVICES.length > 0 ? (
            CONNECTED_DEVICES.map((device) => (
              <TouchableOpacity key={device.id} style={styles.deviceCard}>
                <View style={styles.deviceIcon}>
                  <Text style={styles.deviceIconText}>{device.icon}</Text>
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <View style={styles.deviceStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Connected · {device.lastSync}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>⌚</Text>
              <Text style={styles.emptyTitle}>No devices connected</Text>
              <Text style={styles.emptyText}>Connect a wearable to automatically sync your workouts</Text>
            </View>
          )}
        </View>

        {/* Sync Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sync Settings</Text>
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Auto-sync</Text>
                <Text style={styles.toggleDescription}>Automatically sync when device connects</Text>
              </View>
              <Switch
                value={autoSync}
                onValueChange={(val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAutoSync(val);
                }}
                trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
                thumbColor={colors.text.primary}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Background Sync</Text>
                <Text style={styles.toggleDescription}>Sync data even when app is closed</Text>
              </View>
              <Switch
                value={backgroundSync}
                onValueChange={(val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setBackgroundSync(val);
                }}
                trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
                thumbColor={colors.text.primary}
              />
            </View>
          </View>
        </View>

        {/* Available Integrations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Integrations</Text>
          {AVAILABLE_INTEGRATIONS.map((integration) => (
            <TouchableOpacity key={integration.id} style={styles.integrationCard}>
              <View style={styles.integrationIcon}>
                <Text style={styles.integrationIconText}>{integration.icon}</Text>
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>{integration.name}</Text>
                <Text style={styles.integrationDescription}>{integration.description}</Text>
              </View>
              <View style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Manual Sync */}
        <TouchableOpacity style={styles.syncButton}>
          <Ionicons name="sync" size={20} color={colors.text.primary} />
          <Text style={styles.syncButtonText}>Sync All Devices Now</Text>
        </TouchableOpacity>

        {/* Last Sync Info */}
        <Text style={styles.lastSync}>Last synced: Today at 2:34 PM</Text>
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
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  deviceIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  deviceIconText: {
    fontSize: 28,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success.primary,
  },
  statusText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
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
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: fontSize.md,
    color: colors.text.primary,
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
  integrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  integrationIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  integrationIconText: {
    fontSize: 24,
  },
  integrationInfo: {
    flex: 1,
  },
  integrationName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  integrationDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  connectButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent.muted,
  },
  connectButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.accent.primary,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  syncButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  lastSync: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
});
