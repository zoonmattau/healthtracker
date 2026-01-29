import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';

export default function Log() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log</Text>
        <Text style={styles.subtitle}>What do you want to track?</Text>
      </View>

      <View style={styles.options}>
        <TouchableOpacity style={styles.optionCard} activeOpacity={0.8}>
          <View style={styles.optionIcon}>
            <Text style={styles.iconText}>🍽️</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Log Food</Text>
            <Text style={styles.optionDescription}>Track meals, snacks, and drinks</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} activeOpacity={0.8}>
          <View style={styles.optionIcon}>
            <Text style={styles.iconText}>🏋️</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Log Workout</Text>
            <Text style={styles.optionDescription}>Start or log a training session</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} activeOpacity={0.8}>
          <View style={styles.optionIcon}>
            <Text style={styles.iconText}>💧</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Log Water</Text>
            <Text style={styles.optionDescription}>Track your hydration</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} activeOpacity={0.8}>
          <View style={styles.optionIcon}>
            <Text style={styles.iconText}>😴</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Log Sleep</Text>
            <Text style={styles.optionDescription}>Record last night's rest</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} activeOpacity={0.8}>
          <View style={styles.optionIcon}>
            <Text style={styles.iconText}>⚖️</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Log Weight</Text>
            <Text style={styles.optionDescription}>Update your body weight</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} activeOpacity={0.8}>
          <View style={styles.optionIcon}>
            <Text style={styles.iconText}>💊</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Log Supplements</Text>
            <Text style={styles.optionDescription}>Track what you've taken</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  options: {
    gap: spacing.md,
  },
  optionCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  optionDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  arrow: {
    fontSize: fontSize.xl,
    color: colors.text.tertiary,
  },
});
