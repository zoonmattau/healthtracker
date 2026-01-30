import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';

const FEEDBACK_TYPES = [
  { id: 'bug', icon: '🐛', label: 'Bug Report', description: 'Something isn\'t working' },
  { id: 'feature', icon: '💡', label: 'Feature Request', description: 'Suggest a new feature' },
  { id: 'improvement', icon: '✨', label: 'Improvement', description: 'Make something better' },
  { id: 'other', icon: '💬', label: 'Other', description: 'General feedback' },
];

export default function Feedback() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!selectedType || !title || !description) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Thank You!',
      'Your feedback has been submitted. We appreciate you helping us improve!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Send Feedback</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={styles.intro}>
          <Text style={styles.introTitle}>We'd love to hear from you</Text>
          <Text style={styles.introText}>
            Your feedback helps us build a better app. Let us know what you think!
          </Text>
        </View>

        {/* Feedback Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What type of feedback is this?</Text>
          <View style={styles.typeGrid}>
            {FEEDBACK_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeCard, selectedType === type.id && styles.typeCardActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedType(type.id);
                }}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={styles.typeLabel}>{type.label}</Text>
                <Text style={styles.typeDescription}>{type.description}</Text>
                {selectedType === type.id && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={14} color={colors.text.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Brief summary of your feedback"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Please provide as much detail as possible..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/1000</Text>
        </View>

        {/* Screenshots */}
        <View style={styles.section}>
          <Text style={styles.label}>Attachments (Optional)</Text>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="image-outline" size={24} color={colors.accent.primary} />
            <Text style={styles.attachButtonText}>Add Screenshots</Text>
          </TouchableOpacity>
        </View>

        {/* Email */}
        <View style={styles.section}>
          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="For follow-up if needed"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.hint}>We'll only use this to respond to your feedback</Text>
        </View>

        {/* Rate Experience */}
        <View style={styles.section}>
          <Text style={styles.label}>How would you rate your experience?</Text>
          <View style={styles.ratingRow}>
            {['😞', '😕', '😐', '🙂', '😍'].map((emoji, index) => (
              <TouchableOpacity key={index} style={styles.ratingButton}>
                <Text style={styles.ratingEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="send" size={20} color={colors.text.primary} />
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
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
  submitText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.accent.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  intro: {
    marginBottom: spacing.xl,
  },
  introTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  introText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  typeCard: {
    width: '47%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  typeCardActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.muted,
  },
  typeIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  typeLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  typeDescription: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
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
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderStyle: 'dashed',
  },
  attachButtonText: {
    fontSize: fontSize.md,
    color: colors.accent.primary,
  },
  hint: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingEmoji: {
    fontSize: 28,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  submitButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
});
