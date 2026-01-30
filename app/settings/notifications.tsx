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

export default function Notifications() {
  const router = useRouter();
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [waterReminders, setWaterReminders] = useState(false);
  const [progressUpdates, setProgressUpdates] = useState(true);
  const [achievements, setAchievements] = useState(true);
  const [socialNotifs, setSocialNotifs] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const NotificationToggle = ({
    icon,
    title,
    description,
    value,
    onValueChange,
  }: {
    icon: string;
    title: string;
    description: string;
    value: boolean;
    onValueChange: (val: boolean) => void;
  }) => (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleIcon}>{icon}</Text>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
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
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <View style={styles.card}>
            <NotificationToggle
              icon="🏋️"
              title="Workout Reminders"
              description="Get reminded to work out"
              value={workoutReminders}
              onValueChange={setWorkoutReminders}
            />
            <View style={styles.divider} />
            <NotificationToggle
              icon="🍽️"
              title="Meal Reminders"
              description="Log your meals on time"
              value={mealReminders}
              onValueChange={setMealReminders}
            />
            <View style={styles.divider} />
            <NotificationToggle
              icon="💧"
              title="Hydration Reminders"
              description="Stay hydrated throughout the day"
              value={waterReminders}
              onValueChange={setWaterReminders}
            />
          </View>
        </View>

        {/* Reminder Schedule */}
        {workoutReminders && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Reminder Schedule</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.scheduleRow}>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleLabel}>Time</Text>
                  <Text style={styles.scheduleValue}>7:00 AM</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.scheduleRow}>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleLabel}>Days</Text>
                  <Text style={styles.scheduleValue}>Mon, Tue, Wed, Fri</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Progress & Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress & Achievements</Text>
          <View style={styles.card}>
            <NotificationToggle
              icon="📈"
              title="Progress Updates"
              description="Weekly summaries and milestones"
              value={progressUpdates}
              onValueChange={setProgressUpdates}
            />
            <View style={styles.divider} />
            <NotificationToggle
              icon="🏆"
              title="Achievements"
              description="Celebrate your accomplishments"
              value={achievements}
              onValueChange={setAchievements}
            />
          </View>
        </View>

        {/* Social */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social</Text>
          <View style={styles.card}>
            <NotificationToggle
              icon="👥"
              title="Social Notifications"
              description="Likes, comments, and new followers"
              value={socialNotifs}
              onValueChange={setSocialNotifs}
            />
          </View>
        </View>

        {/* Other */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other</Text>
          <View style={styles.card}>
            <NotificationToggle
              icon="📧"
              title="News & Updates"
              description="New features and tips"
              value={marketing}
              onValueChange={setMarketing}
            />
          </View>
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          <TouchableOpacity style={styles.quietHoursCard}>
            <View style={styles.quietHoursInfo}>
              <Ionicons name="moon" size={24} color={colors.accent.primary} />
              <View style={styles.quietHoursText}>
                <Text style={styles.quietHoursTitle}>Do Not Disturb</Text>
                <Text style={styles.quietHoursValue}>10:00 PM - 7:00 AM</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Test Notification */}
        <TouchableOpacity style={styles.testButton}>
          <Ionicons name="notifications-outline" size={20} color={colors.accent.primary} />
          <Text style={styles.testButtonText}>Send Test Notification</Text>
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  toggleIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
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
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  scheduleValue: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  quietHoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  quietHoursInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quietHoursText: {},
  quietHoursTitle: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  quietHoursValue: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  testButtonText: {
    fontSize: fontSize.md,
    color: colors.accent.primary,
  },
});
