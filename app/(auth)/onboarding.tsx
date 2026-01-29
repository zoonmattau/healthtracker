import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

type Gender = 'male' | 'female' | 'other' | null;
type Unit = 'metric' | 'imperial';

export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [unit, setUnit] = useState<Unit>('metric');

  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: null as Gender,
    height: '',
    weight: '',
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Calculate height in cm and weight in kg for storage
        let heightCm = parseFloat(formData.height) || null;
        let weightKg = parseFloat(formData.weight) || null;

        if (unit === 'imperial') {
          // Convert feet to cm (assuming input is in feet, e.g., 5.10 for 5'10")
          if (heightCm) {
            const feet = Math.floor(heightCm);
            const inches = (heightCm - feet) * 10;
            heightCm = (feet * 30.48) + (inches * 2.54);
          }
          // Convert lbs to kg
          if (weightKg) {
            weightKg = weightKg * 0.453592;
          }
        }

        // Save profile data
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            date_of_birth: formData.dateOfBirth || null,
            gender: formData.gender,
            height_cm: heightCm,
            weight_kg: weightKg,
            unit_preference: unit,
            onboarding_completed: true,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>When were you born?</Text>
            <Text style={styles.stepSubtitle}>
              This helps us personalize your experience
            </Text>

            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={colors.text.tertiary}
              value={formData.dateOfBirth}
              onChangeText={(v) => setFormData(prev => ({ ...prev, dateOfBirth: v }))}
              keyboardType="numeric"
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your gender?</Text>
            <Text style={styles.stepSubtitle}>
              Used for accurate calorie and macro calculations
            </Text>

            <View style={styles.genderOptions}>
              {(['male', 'female', 'other'] as Gender[]).map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderOption,
                    formData.gender === gender && styles.genderOptionSelected,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, gender }))}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      formData.gender === gender && styles.genderOptionTextSelected,
                    ]}
                  >
                    {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your measurements</Text>
            <Text style={styles.stepSubtitle}>
              Track your progress from day one
            </Text>

            {/* Unit Toggle */}
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitOption, unit === 'metric' && styles.unitOptionSelected]}
                onPress={() => setUnit('metric')}
              >
                <Text style={[styles.unitOptionText, unit === 'metric' && styles.unitOptionTextSelected]}>
                  Metric (kg/cm)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitOption, unit === 'imperial' && styles.unitOptionSelected]}
                onPress={() => setUnit('imperial')}
              >
                <Text style={[styles.unitOptionText, unit === 'imperial' && styles.unitOptionTextSelected]}>
                  Imperial (lb/ft)
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.measurementInputs}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Height</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={[styles.input, styles.inputFlex]}
                    placeholder={unit === 'metric' ? '175' : '5.10'}
                    placeholderTextColor={colors.text.tertiary}
                    value={formData.height}
                    onChangeText={(v) => setFormData(prev => ({ ...prev, height: v }))}
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unitLabel}>{unit === 'metric' ? 'cm' : 'ft'}</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Weight</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={[styles.input, styles.inputFlex]}
                    placeholder={unit === 'metric' ? '75' : '165'}
                    placeholderTextColor={colors.text.tertiary}
                    value={formData.weight}
                    onChangeText={(v) => setFormData(prev => ({ ...prev, weight: v }))}
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unitLabel}>{unit === 'metric' ? 'kg' : 'lb'}</Text>
                </View>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {step} of {totalSteps}</Text>
      </View>

      {/* Step Content */}
      {renderStep()}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.continueButton, loading && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Saving...' : step === totalSteps ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  progressContainer: {
    marginBottom: spacing.xxl,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  stepContent: {
    flex: 1,
    marginBottom: spacing.xl,
  },
  stepTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.lg,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  genderOptions: {
    gap: spacing.md,
  },
  genderOption: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
  genderOptionSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.muted,
  },
  genderOptionText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
  },
  genderOptionTextSelected: {
    color: colors.accent.primary,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  unitOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  unitOptionSelected: {
    backgroundColor: colors.accent.primary,
  },
  unitOptionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
  },
  unitOptionTextSelected: {
    color: colors.text.primary,
  },
  measurementInputs: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputFlex: {
    flex: 1,
  },
  unitLabel: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    width: 40,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  continueButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  skipButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
});
