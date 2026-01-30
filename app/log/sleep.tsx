import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData, SleepEntry } from '../../src/context/DataContext';

const SLEEP_QUALITY: { id: SleepEntry['quality']; emoji: string; label: string }[] = [
  { id: 'poor', emoji: '😫', label: 'Poor' },
  { id: 'fair', emoji: '😕', label: 'Fair' },
  { id: 'good', emoji: '😊', label: 'Good' },
  { id: 'excellent', emoji: '😴', label: 'Excellent' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

export default function LogSleep() {
  const router = useRouter();
  const { sleepHistory, todaySleep, addSleep } = useData();

  // Parse existing sleep or use defaults
  const defaultBedtime = todaySleep?.bedtime || '23:00';
  const defaultWakeTime = todaySleep?.wakeTime || '07:00';
  const defaultQuality = todaySleep?.quality || 'good';

  const [bedtime, setBedtime] = useState(defaultBedtime);
  const [wakeTime, setWakeTime] = useState(defaultWakeTime);
  const [quality, setQuality] = useState<SleepEntry['quality']>(defaultQuality);
  const [showTimePicker, setShowTimePicker] = useState<'bedtime' | 'wake' | null>(null);

  // Calculate sleep duration
  const sleepDuration = useMemo(() => {
    const [bedH, bedM] = bedtime.split(':').map(Number);
    const [wakeH, wakeM] = wakeTime.split(':').map(Number);

    let bedMinutes = bedH * 60 + bedM;
    let wakeMinutes = wakeH * 60 + wakeM;

    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60;
    }

    const totalMinutes = wakeMinutes - bedMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    return `${hours}h ${mins}m`;
  }, [bedtime, wakeTime]);

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const weekEntries = sleepHistory.slice(0, 7);
    if (weekEntries.length === 0) return null;

    const avgDuration = weekEntries.reduce((sum, e) => sum + e.duration, 0) / weekEntries.length;

    // Calculate average bedtime
    const bedtimes = weekEntries.map(e => {
      const [h, m] = e.bedtime.split(':').map(Number);
      return h * 60 + m;
    });
    const avgBedtimeMinutes = bedtimes.reduce((sum, m) => sum + m, 0) / bedtimes.length;
    const avgBedH = Math.floor(avgBedtimeMinutes / 60) % 24;
    const avgBedM = Math.round(avgBedtimeMinutes % 60);

    // Quality score (poor=1, fair=2, good=3, excellent=4)
    const qualityMap: Record<string, number> = { poor: 1, fair: 2, good: 3, excellent: 4 };
    const avgQuality = weekEntries.reduce((sum, e) => sum + qualityMap[e.quality], 0) / weekEntries.length;

    return {
      avgDuration: avgDuration.toFixed(1),
      avgBedtime: `${avgBedH % 12 || 12}:${avgBedM.toString().padStart(2, '0')} ${avgBedH >= 12 ? 'PM' : 'AM'}`,
      avgQuality: avgQuality.toFixed(1),
    };
  }, [sleepHistory]);

  const handleSave = async () => {
    await addSleep(bedtime, wakeTime, quality);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const handleTimeSelect = (hours: number, minutes: number) => {
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    if (showTimePicker === 'bedtime') {
      setBedtime(timeStr);
    } else {
      setWakeTime(timeStr);
    }
    setShowTimePicker(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Log Sleep</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sleep Duration Card */}
        <View style={styles.durationCard}>
          <View style={styles.moonIcon}>
            <Ionicons name="moon" size={32} color={colors.accent.primary} />
          </View>
          <Text style={styles.durationLabel}>Sleep Duration</Text>
          <Text style={styles.durationValue}>{sleepDuration}</Text>
          <View style={styles.durationMeta}>
            <Text style={styles.durationMetaText}>Recommended: 7-9 hours</Text>
          </View>
        </View>

        {/* Time Inputs */}
        <View style={styles.timeSection}>
          <TouchableOpacity style={styles.timeCard} onPress={() => setShowTimePicker('bedtime')}>
            <View style={styles.timeIcon}>
              <Ionicons name="bed" size={24} color={colors.accent.secondary} />
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>Bedtime</Text>
              <Text style={styles.timeValue}>{formatTime(bedtime)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.timeCard} onPress={() => setShowTimePicker('wake')}>
            <View style={styles.timeIcon}>
              <Ionicons name="sunny" size={24} color={colors.warning.primary} />
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>Wake Time</Text>
              <Text style={styles.timeValue}>{formatTime(wakeTime)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Sleep Quality */}
        <View style={styles.qualitySection}>
          <Text style={styles.sectionTitle}>How did you sleep?</Text>
          <View style={styles.qualityRow}>
            {SLEEP_QUALITY.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.qualityButton, quality === item.id && styles.qualityButtonActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setQuality(item.id);
                }}
              >
                <Text style={styles.qualityEmoji}>{item.emoji}</Text>
                <Text style={[styles.qualityLabel, quality === item.id && styles.qualityLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weekly Summary */}
        {weeklyStats && (
          <View style={styles.weeklySection}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.weeklyCard}>
              <View style={styles.weeklyStats}>
                <View style={styles.weeklyStat}>
                  <Text style={styles.weeklyStatValue}>{weeklyStats.avgDuration}h</Text>
                  <Text style={styles.weeklyStatLabel}>Avg Sleep</Text>
                </View>
                <View style={styles.weeklyStatDivider} />
                <View style={styles.weeklyStat}>
                  <Text style={styles.weeklyStatValue}>{weeklyStats.avgBedtime}</Text>
                  <Text style={styles.weeklyStatLabel}>Avg Bedtime</Text>
                </View>
                <View style={styles.weeklyStatDivider} />
                <View style={styles.weeklyStat}>
                  <Text style={styles.weeklyStatValue}>{weeklyStats.avgQuality}</Text>
                  <Text style={styles.weeklyStatLabel}>Avg Quality</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Recent Entries */}
        {sleepHistory.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            {sleepHistory.slice(0, 5).map((entry) => (
              <View key={entry.id} style={styles.recentItem}>
                <Text style={styles.recentDate}>
                  {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
                <View style={styles.recentRight}>
                  <Text style={styles.recentDuration}>{entry.duration.toFixed(1)}h</Text>
                  <Text style={styles.recentQuality}>
                    {SLEEP_QUALITY.find(q => q.id === entry.quality)?.emoji}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Sleep Log</Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {showTimePicker === 'bedtime' ? 'Bedtime' : 'Wake Time'}
              </Text>
              <TouchableOpacity onPress={() => setShowTimePicker(null)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.timeGrid}>
              {HOURS.map(hour => (
                <View key={hour} style={styles.hourRow}>
                  <Text style={styles.hourLabel}>
                    {hour % 12 || 12} {hour >= 12 ? 'PM' : 'AM'}
                  </Text>
                  <View style={styles.minuteButtons}>
                    {MINUTES.map(minute => (
                      <TouchableOpacity
                        key={minute}
                        style={styles.minuteButton}
                        onPress={() => handleTimeSelect(hour, minute)}
                      >
                        <Text style={styles.minuteText}>:{minute.toString().padStart(2, '0')}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  durationCard: {
    backgroundColor: colors.accent.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  moonIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  durationLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  durationValue: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  durationMeta: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  durationMetaText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  timeSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  timeIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  timeValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  qualitySection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  qualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  qualityButton: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    flex: 1,
  },
  qualityButtonActive: {
    backgroundColor: colors.accent.muted,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  qualityEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  qualityLabel: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  qualityLabelActive: {
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
  },
  weeklySection: {
    marginBottom: spacing.xl,
  },
  weeklyCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  weeklyStats: {
    flexDirection: 'row',
  },
  weeklyStat: {
    flex: 1,
    alignItems: 'center',
  },
  weeklyStatValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  weeklyStatLabel: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  weeklyStatDivider: {
    width: 1,
    backgroundColor: colors.border.primary,
  },
  recentSection: {
    marginBottom: spacing.xl,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  recentDate: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  recentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  recentDuration: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  recentQuality: {
    fontSize: 20,
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
  saveButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  timeGrid: {
    padding: spacing.lg,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  hourLabel: {
    width: 70,
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  minuteButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  minuteButton: {
    backgroundColor: colors.background.tertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  minuteText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
});
