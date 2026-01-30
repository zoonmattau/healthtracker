import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';

const PROGRAMS: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Push Pull Legs',
    emoji: '💪',
    description: 'A classic 6-day split focusing on push movements, pull movements, and legs. Perfect for intermediate to advanced lifters looking to build muscle and strength.',
    author: 'LucasGym Team',
    duration: '12 weeks',
    frequency: '6 days/week',
    rating: 4.8,
    reviews: 1243,
    downloads: '12.4k',
    difficulty: 'Intermediate',
    goals: ['Build Muscle', 'Increase Strength'],
    equipment: ['Barbell', 'Dumbbells', 'Cables', 'Machines'],
    schedule: [
      { day: 'Monday', name: 'Push Day', exercises: 8 },
      { day: 'Tuesday', name: 'Pull Day', exercises: 7 },
      { day: 'Wednesday', name: 'Leg Day', exercises: 6 },
      { day: 'Thursday', name: 'Push Day', exercises: 8 },
      { day: 'Friday', name: 'Pull Day', exercises: 7 },
      { day: 'Saturday', name: 'Leg Day', exercises: 6 },
      { day: 'Sunday', name: 'Rest', exercises: 0 },
    ],
  },
  '2': {
    id: '2',
    name: 'Couch to 5K',
    emoji: '🏃',
    description: 'A beginner-friendly running program that takes you from walking to running 5 kilometers in just 8 weeks. Perfect for those new to running.',
    author: 'LucasGym Team',
    duration: '8 weeks',
    frequency: '3 days/week',
    rating: 4.6,
    reviews: 892,
    downloads: '8.2k',
    difficulty: 'Beginner',
    goals: ['Improve Endurance', 'Lose Weight'],
    equipment: ['Running Shoes'],
    schedule: [
      { day: 'Monday', name: 'Run/Walk', exercises: 1 },
      { day: 'Tuesday', name: 'Rest', exercises: 0 },
      { day: 'Wednesday', name: 'Run/Walk', exercises: 1 },
      { day: 'Thursday', name: 'Rest', exercises: 0 },
      { day: 'Friday', name: 'Run/Walk', exercises: 1 },
      { day: 'Saturday', name: 'Rest', exercises: 0 },
      { day: 'Sunday', name: 'Rest', exercises: 0 },
    ],
  },
  '3': {
    id: '3',
    name: '5x5 Strength',
    emoji: '🎯',
    description: 'A proven strength-building program based on 5 sets of 5 reps for compound movements. Ideal for building raw strength and a solid foundation.',
    author: 'LucasGym Team',
    duration: '12 weeks',
    frequency: '3 days/week',
    rating: 4.9,
    reviews: 2156,
    downloads: '22.1k',
    difficulty: 'Beginner',
    goals: ['Build Strength', 'Build Muscle'],
    equipment: ['Barbell', 'Squat Rack', 'Bench'],
    schedule: [
      { day: 'Monday', name: 'Workout A', exercises: 3 },
      { day: 'Tuesday', name: 'Rest', exercises: 0 },
      { day: 'Wednesday', name: 'Workout B', exercises: 3 },
      { day: 'Thursday', name: 'Rest', exercises: 0 },
      { day: 'Friday', name: 'Workout A', exercises: 3 },
      { day: 'Saturday', name: 'Rest', exercises: 0 },
      { day: 'Sunday', name: 'Rest', exercises: 0 },
    ],
  },
};

export default function ProgramDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isStarted, setIsStarted] = useState(false);

  const program = PROGRAMS[id as string] || PROGRAMS['1'];

  const handleStartProgram = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Start Program',
      `Are you sure you want to start "${program.name}"? This will become your active program.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            setIsStarted(true);
            Alert.alert('Program Started!', 'Your first workout is ready. Good luck!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroEmoji}>{program.emoji}</Text>
          </View>
          <Text style={styles.heroTitle}>{program.name}</Text>
          <Text style={styles.heroAuthor}>by {program.author}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="time-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.statText}>{program.duration}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="calendar-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.statText}>{program.frequency}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="star" size={18} color={colors.warning.primary} />
              <Text style={styles.statText}>{program.rating}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{program.description}</Text>
        </View>

        {/* Quick Info */}
        <View style={styles.section}>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Difficulty</Text>
              <Text style={styles.infoValue}>{program.difficulty}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Downloads</Text>
              <Text style={styles.infoValue}>{program.downloads}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Reviews</Text>
              <Text style={styles.infoValue}>{program.reviews}</Text>
            </View>
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals</Text>
          <View style={styles.tagsRow}>
            {program.goals.map((goal: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{goal}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Equipment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          <View style={styles.tagsRow}>
            {program.equipment.map((item: string, index: number) => (
              <View key={index} style={styles.equipmentTag}>
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>
          <View style={styles.scheduleCard}>
            {program.schedule.map((day: any, index: number) => (
              <View
                key={index}
                style={[styles.scheduleRow, index < program.schedule.length - 1 && styles.scheduleRowBorder]}
              >
                <Text style={styles.scheduleDay}>{day.day}</Text>
                <View style={styles.scheduleInfo}>
                  <Text style={[styles.scheduleName, day.exercises === 0 && styles.restDay]}>
                    {day.name}
                  </Text>
                  {day.exercises > 0 && (
                    <Text style={styles.scheduleExercises}>{day.exercises} exercises</Text>
                  )}
                </View>
                {day.exercises > 0 && (
                  <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Reviews Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewAvatarText}>J</Text>
              </View>
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewName}>John D.</Text>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={14} color={colors.warning.primary} />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewDate}>2 weeks ago</Text>
            </View>
            <Text style={styles.reviewText}>
              Amazing program! Saw great gains in just 6 weeks. The progressive overload is
              well-structured and the rest days are perfectly placed.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <TouchableOpacity
          style={[styles.startButton, isStarted && styles.startedButton]}
          onPress={handleStartProgram}
          disabled={isStarted}
        >
          <Ionicons
            name={isStarted ? 'checkmark-circle' : 'play'}
            size={24}
            color={colors.text.primary}
          />
          <Text style={styles.startButtonText}>
            {isStarted ? 'Program Active' : 'Start Program'}
          </Text>
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
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroEmoji: {
    fontSize: 48,
  },
  heroTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  heroAuthor: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  statText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border.primary,
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
  seeAll: {
    fontSize: fontSize.sm,
    color: colors.accent.primary,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.accent.muted,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: fontSize.sm,
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
  },
  equipmentTag: {
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  equipmentText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  scheduleCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  scheduleRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  scheduleDay: {
    width: 80,
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  restDay: {
    color: colors.text.tertiary,
  },
  scheduleExercises: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  reviewCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  reviewAvatarText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.accent.primary,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  reviewStars: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  reviewDate: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  reviewText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  bottomCta: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    backgroundColor: colors.background.primary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  startedButton: {
    backgroundColor: colors.success.primary,
  },
  startButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
});
