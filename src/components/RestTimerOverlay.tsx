import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRestTimer } from '../context/RestTimerContext';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RestTimerOverlayProps {
  onComplete?: () => void;
}

export default function RestTimerOverlay({ onComplete }: RestTimerOverlayProps) {
  const {
    isRunning,
    timeRemaining,
    totalTime,
    stopTimer,
    addTime,
  } = useRestTimer();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Animate in when timer starts
  useEffect(() => {
    if (isRunning) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isRunning]);

  // Update progress animation
  useEffect(() => {
    const progress = totalTime > 0 ? 1 - (timeRemaining / totalTime) : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [timeRemaining, totalTime]);

  // Call onComplete when timer finishes
  useEffect(() => {
    if (!isRunning && timeRemaining === 0 && totalTime > 0) {
      onComplete?.();
    }
  }, [isRunning, timeRemaining, totalTime, onComplete]);

  if (!isRunning && timeRemaining === 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>

        <View style={styles.main}>
          {/* Timer display */}
          <View style={styles.timerSection}>
            <Text style={styles.label}>REST</Text>
            <Text style={styles.time}>{formatTime(timeRemaining)}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => addTime(-15)}
            >
              <Text style={styles.adjustText}>-15s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => addTime(15)}
            >
              <Text style={styles.adjustText}>+15s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={stopTimer}
            >
              <Ionicons name="play-skip-forward" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
  },
  content: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.text.primary,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  timerSection: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  time: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  adjustButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  adjustText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  skipButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
