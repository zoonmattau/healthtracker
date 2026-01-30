import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

export default function PersonalInfo() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    email: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: 'Moderate',
  });

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserInfo({
          email: user.email || '',
          dateOfBirth: user.user_metadata?.date_of_birth || '',
          gender: user.user_metadata?.gender || '',
          height: user.user_metadata?.height || '',
          weight: user.user_metadata?.weight || '',
          activityLevel: user.user_metadata?.activity_level || 'Moderate',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const InfoRow = ({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.infoRow} onPress={onPress} disabled={!onPress}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueContainer}>
        <Text style={styles.infoValue}>{value || 'Not set'}</Text>
        {onPress && <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Personal Info</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <InfoRow label="Email" value={userInfo.email} />
            <View style={styles.divider} />
            <InfoRow label="Password" value="••••••••" onPress={() => {}} />
          </View>
        </View>

        {/* Personal Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <View style={styles.card}>
            <InfoRow label="Date of Birth" value={userInfo.dateOfBirth} onPress={() => {}} />
            <View style={styles.divider} />
            <InfoRow label="Gender" value={userInfo.gender} onPress={() => {}} />
            <View style={styles.divider} />
            <InfoRow label="Height" value={userInfo.height} onPress={() => {}} />
            <View style={styles.divider} />
            <InfoRow label="Weight" value={userInfo.weight} onPress={() => {}} />
          </View>
        </View>

        {/* Fitness Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Profile</Text>
          <View style={styles.card}>
            <InfoRow label="Activity Level" value={userInfo.activityLevel} onPress={() => {}} />
            <View style={styles.divider} />
            <InfoRow label="Fitness Goals" value="Build Muscle" onPress={() => {}} />
            <View style={styles.divider} />
            <InfoRow label="Experience Level" value="Intermediate" onPress={() => {}} />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.dangerRow}>
              <Ionicons name="download-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.dangerText}>Export My Data</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.dangerRow}>
              <Ionicons name="trash-outline" size={20} color={colors.error.primary} />
              <Text style={[styles.dangerText, styles.dangerTextRed]}>Delete Account</Text>
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
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginHorizontal: spacing.lg,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  dangerText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  dangerTextRed: {
    color: colors.error.primary,
  },
});
