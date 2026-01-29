import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../src/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();
    Animated.timing(fadeIn, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.first_name) setUserName(user.user_metadata.first_name);
    } catch (e) {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadUserData();
    setRefreshing(false);
  };

  // Data
  const calories = { eaten: 1840, goal: 2400 };
  const remaining = calories.goal - calories.eaten;
  const progress = Math.round((calories.eaten / calories.goal) * 100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />}
    >
      <Animated.View style={{ opacity: fadeIn }}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {userName || 'there'}</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.profileBtn}
          >
            <Ionicons name="person" size={20} color="#FFF" />
          </Pressable>
        </View>

        {/* Calories - The Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Calories remaining</Text>
          <Text style={styles.heroNumber}>{remaining}</Text>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNumber}>{calories.eaten}</Text>
              <Text style={styles.heroStatLabel}>eaten</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNumber}>{calories.goal}</Text>
              <Text style={styles.heroStatLabel}>goal</Text>
            </View>
          </View>
        </View>

        {/* Macros */}
        <View style={styles.macrosCard}>
          <MacroRow label="Protein" current={142} goal={180} />
          <MacroRow label="Carbs" current={180} goal={250} />
          <MacroRow label="Fat" current={62} goal={80} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <ActionButton icon="restaurant" label="Log Food" onPress={() => {}} />
          <ActionButton icon="barbell" label="Workout" onPress={() => {}} />
          <ActionButton icon="water" label="Water" onPress={() => {}} />
        </View>

        {/* Today's Workout */}
        <Pressable style={styles.workoutCard}>
          <View>
            <Text style={styles.workoutLabel}>Today's Workout</Text>
            <Text style={styles.workoutTitle}>Push Day</Text>
            <Text style={styles.workoutMeta}>8 exercises · 45 min</Text>
          </View>
          <View style={styles.startBtn}>
            <Ionicons name="play" size={24} color="#000" />
          </View>
        </Pressable>

        {/* Streak */}
        <View style={styles.streakCard}>
          <Ionicons name="flame" size={24} color="#FFF" />
          <View style={styles.streakInfo}>
            <Text style={styles.streakNumber}>12 day streak</Text>
            <Text style={styles.streakText}>Keep it up!</Text>
          </View>
        </View>

      </Animated.View>
    </ScrollView>
  );
}

// Macro Row Component
function MacroRow({ label, current, goal }: { label: string; current: number; goal: number }) {
  const progress = Math.round((current / goal) * 100);
  return (
    <View style={styles.macroRow}>
      <Text style={styles.macroLabel}>{label}</Text>
      <View style={styles.macroBarContainer}>
        <View style={[styles.macroBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.macroValue}>{current}<Text style={styles.macroGoal}>/{goal}g</Text></Text>
    </View>
  );
}

// Action Button Component
function ActionButton({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <Ionicons name={icon as any} size={24} color="#FFF" />
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const CARD_BG = '#1C1C1E';
const ACCENT = '#007AFF';
const TEXT = '#FFFFFF';
const TEXT_SECONDARY = '#8E8E93';
const BORDER = '#2C2C2E';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: TEXT,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hero Card
  heroCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  heroLabel: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginBottom: 8,
  },
  heroNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: BORDER,
    borderRadius: 4,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: 4,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStat: {
    flex: 1,
  },
  heroStatNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
  },
  heroStatLabel: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: BORDER,
    marginHorizontal: 20,
  },

  // Macros Card
  macrosCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 16,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroLabel: {
    width: 60,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  macroBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: BORDER,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  macroBar: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: 4,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
    width: 70,
    textAlign: 'right',
  },
  macroGoal: {
    color: TEXT_SECONDARY,
    fontWeight: '400',
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionLabel: {
    fontSize: 13,
    color: TEXT,
    fontWeight: '500',
  },

  // Workout Card
  workoutCard: {
    backgroundColor: ACCENT,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  workoutLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
  },
  workoutMeta: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  startBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: TEXT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Streak Card
  streakCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakInfo: {},
  streakNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT,
  },
  streakText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
});
