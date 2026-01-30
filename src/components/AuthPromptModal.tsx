import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function AuthPromptModal() {
  const router = useRouter();
  const { showAuthPrompt, setShowAuthPrompt } = useAuth();

  const handleSignUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowAuthPrompt(false);
    router.push('/(auth)/signup');
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAuthPrompt(false);
    router.push('/(auth)/login');
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAuthPrompt(false);
  };

  return (
    <Modal
      visible={showAuthPrompt}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={colors.text.secondary} />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="lock-open" size={48} color={colors.accent.primary} />
          </View>

          {/* Content */}
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.description}>
            Sign up to save your progress, sync across devices, and unlock all features.
          </Text>

          {/* Benefits */}
          <View style={styles.benefits}>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success.primary} />
              <Text style={styles.benefitText}>Save workouts & nutrition logs</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success.primary} />
              <Text style={styles.benefitText}>Track your progress over time</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success.primary} />
              <Text style={styles.benefitText}>Sync across all your devices</Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
            <Text style={styles.primaryButtonText}>Create Free Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleLogin}>
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>

          {/* Continue as guest */}
          <TouchableOpacity style={styles.guestButton} onPress={handleClose}>
            <Text style={styles.guestButtonText}>Continue exploring</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  benefits: {
    width: '100%',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  benefitText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  secondaryButton: {
    width: '100%',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.secondary,
    marginBottom: spacing.md,
  },
  secondaryButtonText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  guestButton: {
    padding: spacing.sm,
  },
  guestButtonText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
});
