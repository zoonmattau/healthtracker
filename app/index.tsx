import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function Landing() {
  const router = useRouter();
  const { session, isGuest, setGuestMode } = useAuth();

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslate = useRef(new Animated.Value(40)).current;

  // Floating orbs animation
  const orb1 = useRef(new Animated.Value(0)).current;
  const orb2 = useRef(new Animated.Value(0)).current;
  const orb3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence the entrance animations
    Animated.sequence([
      // Logo pops in
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Title fades in and slides up
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Subtitle fades in
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Buttons slide up
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(buttonsTranslate, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Logo glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoGlow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating orbs animation
    const animateOrb = (orb: Animated.Value, duration: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(orb, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(orb, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateOrb(orb1, 4000);
    animateOrb(orb2, 5000);
    animateOrb(orb3, 6000);

    // If user is already logged in or in guest mode, redirect to tabs
    if (session || isGuest) {
      router.replace('/(tabs)');
    }
  }, [session, isGuest]);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(auth)/signup');
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/login');
  };

  const handleExplore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setGuestMode(true);
    router.replace('/(tabs)');
  };

  // Interpolate orb positions
  const orb1Translate = orb1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });
  const orb2Translate = orb2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });
  const orb3Translate = orb3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const glowOpacity = logoGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#0A0A0A', '#0F172A', '#0A0A0A']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Floating Orbs */}
      <Animated.View
        style={[
          styles.orb,
          styles.orb1,
          { transform: [{ translateY: orb1Translate }] },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.orb2,
          { transform: [{ translateY: orb2Translate }] },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.orb3,
          { transform: [{ translateY: orb3Translate }] },
        ]}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View
            style={[
              styles.logoContainer,
              { transform: [{ scale: logoScale }] },
            ]}
          >
            {/* Glow Effect */}
            <Animated.View
              style={[
                styles.logoGlow,
                { opacity: glowOpacity },
              ]}
            />
            {/* Logo */}
            <LinearGradient
              colors={['#3B82F6', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logo}
            >
              <Ionicons name="fitness" size={48} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslate }],
              },
            ]}
          >
            UpRep
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text
            style={[
              styles.subtitle,
              { opacity: subtitleOpacity },
            ]}
          >
            Your one-stop gym ecosystem.{'\n'}
            Train smarter. Live better.
          </Animated.Text>
        </View>

        {/* Features Preview */}
        <Animated.View
          style={[
            styles.featuresContainer,
            { opacity: subtitleOpacity },
          ]}
        >
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="nutrition-outline" size={20} color={colors.accent.primary} />
            </View>
            <Text style={styles.featureText}>Track Nutrition</Text>
          </View>
          <View style={styles.featureDot} />
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="barbell-outline" size={20} color={colors.accent.primary} />
            </View>
            <Text style={styles.featureText}>Log Workouts</Text>
          </View>
          <View style={styles.featureDot} />
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="trending-up-outline" size={20} color={colors.accent.primary} />
            </View>
            <Text style={styles.featureText}>See Progress</Text>
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonsOpacity,
              transform: [{ translateY: buttonsTranslate }],
            },
          ]}
        >
          {/* Primary Button */}
          <Pressable
            onPressIn={handlePressIn}
            onPress={handleGetStarted}
            style={({ pressed }) => [
              styles.primaryButtonWrapper,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>

          {/* Secondary Button */}
          <Pressable
            onPressIn={handlePressIn}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </Pressable>

          {/* Explore as Guest */}
          <Pressable
            onPressIn={handlePressIn}
            onPress={handleExplore}
            style={({ pressed }) => [
              styles.ghostButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Ionicons name="compass-outline" size={18} color={colors.text.tertiary} />
            <Text style={styles.ghostButtonText}>Explore without an account</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Bottom Gradient Fade */}
      <LinearGradient
        colors={['transparent', 'rgba(10,10,10,0.8)']}
        style={styles.bottomFade}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: height * 0.12,
    paddingBottom: spacing.xxl + 20,
  },

  // Floating Orbs
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: '#3B82F6',
    top: -50,
    right: -100,
    transform: [{ rotate: '45deg' }],
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: '#8B5CF6',
    bottom: 100,
    left: -80,
  },
  orb3: {
    width: 150,
    height: 150,
    backgroundColor: '#06B6D4',
    top: height * 0.4,
    right: -50,
  },

  // Logo Section
  logoSection: {
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3B82F6',
    top: -10,
    left: -10,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -1,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
  },

  // Features
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  featureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.tertiary,
  },

  // Buttons
  buttonContainer: {
    gap: spacing.md,
  },
  primaryButtonWrapper: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    gap: spacing.sm,
  },
  primaryButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  secondaryButtonText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  ghostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  ghostButtonText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },

  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
});
