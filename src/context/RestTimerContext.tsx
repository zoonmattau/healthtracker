import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface RestTimerContextType {
  // Timer state
  isRunning: boolean;
  timeRemaining: number;
  totalTime: number;

  // Timer controls
  startTimer: (seconds?: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  addTime: (seconds: number) => void;

  // Settings
  defaultDuration: number;
  setDefaultDuration: (seconds: number) => Promise<void>;
  autoStart: boolean;
  setAutoStart: (enabled: boolean) => Promise<void>;
  vibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => Promise<void>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => Promise<void>;
}

const RestTimerContext = createContext<RestTimerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DEFAULT_DURATION: '@uprep_rest_timer_duration',
  AUTO_START: '@uprep_rest_timer_auto_start',
  VIBRATION: '@uprep_rest_timer_vibration',
  SOUND: '@uprep_rest_timer_sound',
};

export function RestTimerProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(90);

  const [defaultDuration, setDefaultDurationState] = useState(90);
  const [autoStart, setAutoStartState] = useState(true);
  const [vibrationEnabled, setVibrationEnabledState] = useState(true);
  const [soundEnabled, setSoundEnabledState] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPaused = useRef(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [duration, autoStartVal, vibration, sound] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_DURATION),
        AsyncStorage.getItem(STORAGE_KEYS.AUTO_START),
        AsyncStorage.getItem(STORAGE_KEYS.VIBRATION),
        AsyncStorage.getItem(STORAGE_KEYS.SOUND),
      ]);

      if (duration) setDefaultDurationState(parseInt(duration, 10));
      if (autoStartVal) setAutoStartState(autoStartVal === 'true');
      if (vibration) setVibrationEnabledState(vibration !== 'false');
      if (sound) setSoundEnabledState(sound !== 'false');
    } catch (error) {
      console.error('Error loading rest timer settings:', error);
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (isRunning && !isPaused.current) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer complete
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setIsRunning(false);

            // Haptic feedback
            if (vibrationEnabled) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            return 0;
          }

          // Warning haptic at 5 seconds
          if (prev === 6 && vibrationEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, vibrationEnabled]);

  const startTimer = useCallback((seconds?: number) => {
    const duration = seconds || defaultDuration;
    setTotalTime(duration);
    setTimeRemaining(duration);
    setIsRunning(true);
    isPaused.current = false;

    if (vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [defaultDuration, vibrationEnabled]);

  const pauseTimer = useCallback(() => {
    isPaused.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resumeTimer = useCallback(() => {
    isPaused.current = false;
    // The useEffect will restart the interval
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setTimeRemaining(0);
    isPaused.current = false;
  }, []);

  const addTime = useCallback((seconds: number) => {
    setTimeRemaining((prev) => Math.max(0, prev + seconds));
    setTotalTime((prev) => Math.max(0, prev + seconds));

    if (vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [vibrationEnabled]);

  const setDefaultDuration = async (seconds: number) => {
    setDefaultDurationState(seconds);
    await AsyncStorage.setItem(STORAGE_KEYS.DEFAULT_DURATION, String(seconds));
  };

  const setAutoStart = async (enabled: boolean) => {
    setAutoStartState(enabled);
    await AsyncStorage.setItem(STORAGE_KEYS.AUTO_START, String(enabled));
  };

  const setVibrationEnabled = async (enabled: boolean) => {
    setVibrationEnabledState(enabled);
    await AsyncStorage.setItem(STORAGE_KEYS.VIBRATION, String(enabled));
  };

  const setSoundEnabled = async (enabled: boolean) => {
    setSoundEnabledState(enabled);
    await AsyncStorage.setItem(STORAGE_KEYS.SOUND, String(enabled));
  };

  return (
    <RestTimerContext.Provider
      value={{
        isRunning,
        timeRemaining,
        totalTime,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        addTime,
        defaultDuration,
        setDefaultDuration,
        autoStart,
        setAutoStart,
        vibrationEnabled,
        setVibrationEnabled,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </RestTimerContext.Provider>
  );
}

export function useRestTimer() {
  const context = useContext(RestTimerContext);
  if (context === undefined) {
    throw new Error('useRestTimer must be used within a RestTimerProvider');
  }
  return context;
}
