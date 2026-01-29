import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();
    Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }).start();
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
  const calories = { consumed: 1840, goal: 2400, remaining: 560 };
  const protein = { current: 142, goal: 180 };
  const water = { current: 6, goal: 8 };
  const streak = 12;

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening';
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />}
    >
      <Animated.View style={{ opacity: fadeIn }}>
        {/* Header - Compact */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {userName || 'Champion'}</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.avatar}>
              <Text style={styles.avatarText}>{userName?.[0]?.toUpperCase() || '?'}</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Main Stats Row */}
        <View style={styles.statsRow}>
          {/* Calories - Hero */}
          <Pressable style={styles.calorieCard}>
            <View style={styles.calorieRing}>
              <Text style={styles.calorieNumber}>{calories.consumed}</Text>
              <Text style={styles.calorieLabel}>eaten</Text>
            </View>
            <View style={styles.calorieInfo}>
              <View style={styles.calorieStat}>
                <Text style={styles.calorieStatValue}>{calories.goal}</Text>
                <Text style={styles.calorieStatLabel}>goal</Text>
              </View>
              <View style={styles.calorieStat}>
                <Text style={[styles.calorieStatValue, { color: '#22C55E' }]}>{calories.remaining}</Text>
                <Text style={styles.calorieStatLabel}>left</Text>
              </View>
            </View>
          </Pressable>

          {/* Right Stats */}
          <View style={styles.rightStats}>
            <Pressable style={styles.miniCard}>
              <Ionicons name="flame" size={18} color="#F97316" />
              <Text style={styles.miniValue}>{streak}</Text>
              <Text style={styles.miniLabel}>streak</Text>
            </Pressable>
            <Pressable style={styles.miniCard}>
              <Ionicons name="water" size={18} color="#06B6D4" />
              <Text style={styles.miniValue}>{water.current}/{water.goal}</Text>
              <Text style={styles.miniLabel}>glasses</Text>
            </Pressable>
            <Pressable style={styles.miniCard}>
              <Ionicons name="fish" size={18} color="#F43F5E" />
              <Text style={styles.miniValue}>{protein.current}g</Text>
              <Text style={styles.miniLabel}>protein</Text>
            </Pressable>
          </View>
        </View>

        {/* Macros Bar */}
        <View style={styles.macrosBar}>
          <View style={styles.macroItem}>
            <View style={styles.macroProgress}>
              <View style={[styles.macroFill, { width: '79%', backgroundColor: '#F43F5E' }]} />
            </View>
            <Text style={styles.macroText}>P 142/180</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={styles.macroProgress}>
              <View style={[styles.macroFill, { width: '72%', backgroundColor: '#F59E0B' }]} />
            </View>
            <Text style={styles.macroText}>C 180/250</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={styles.macroProgress}>
              <View style={[styles.macroFill, { width: '78%', backgroundColor: '#3B82F6' }]} />
            </View>
            <Text style={styles.macroText}>F 62/80</Text>
          </View>
        </View>

        {/* Quick Log Row */}
        <View style={styles.quickLogRow}>
          {[
            { icon: 'add-circle', label: 'Food', color: '#10B981' },
            { icon: 'barbell', label: 'Workout', color: '#3B82F6' },
            { icon: 'water', label: 'Water', color: '#06B6D4' },
            { icon: 'scale', label: 'Weight', color: '#8B5CF6' },
          ].map((item, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [styles.quickLogBtn, pressed && { transform: [{ scale: 0.95 }] }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <View style={[styles.quickLogIcon, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={styles.quickLogLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Today's Workout */}
        <Pressable style={styles.workoutCard}>
          <View style={styles.workoutLeft}>
            <View style={styles.workoutBadge}>
              <Ionicons name="time" size={10} color="#EC4899" />
              <Text style={styles.workoutBadgeText}>4:00 PM</Text>
            </View>
            <Text style={styles.workoutTitle}>Push Day</Text>
            <Text style={styles.workoutMeta}>8 exercises · ~45 min</Text>
          </View>
          <LinearGradient colors={['#EC4899', '#8B5CF6']} style={styles.playBtn}>
            <Ionicons name="play" size={22} color="#FFF" style={{ marginLeft: 2 }} />
          </LinearGradient>
        </Pressable>

        {/* Today's Meals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <Pressable><Text style={styles.sectionLink}>Add</Text></Pressable>
          </View>
          {[
            { time: '7:30', name: 'Breakfast', cals: 420, icon: 'sunny' },
            { time: '12:30', name: 'Lunch', cals: 680, icon: 'partly-sunny' },
            { time: '15:00', name: 'Snack', cals: 180, icon: 'cafe' },
          ].map((meal, i) => (
            <Pressable key={i} style={styles.mealRow}>
              <View style={styles.mealIcon}>
                <Ionicons name={meal.icon as any} size={16} color="#F59E0B" />
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <Text style={styles.mealCals}>{meal.cals} kcal</Text>
            </Pressable>
          ))}
          <Pressable style={styles.addMealBtn}>
            <Ionicons name="add" size={18} color="#3B82F6" />
            <Text style={styles.addMealText}>Log Dinner</Text>
          </Pressable>
        </View>

        {/* Weekly Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weekGrid}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const isToday = i === 4;
              const completed = i < 4;
              return (
                <View key={i} style={styles.weekDay}>
                  <Text style={[styles.weekDayLabel, isToday && { color: '#3B82F6' }]}>{day}</Text>
                  <View style={[
                    styles.weekDot,
                    completed && styles.weekDotDone,
                    isToday && styles.weekDotToday,
                  ]}>
                    {completed && <Ionicons name="checkmark" size={10} color="#FFF" />}
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.weekStats}>
            <View style={styles.weekStat}>
              <Text style={styles.weekStatValue}>4</Text>
              <Text style={styles.weekStatLabel}>workouts</Text>
            </View>
            <View style={styles.weekStatDivider} />
            <View style={styles.weekStat}>
              <Text style={styles.weekStatValue}>12,400</Text>
              <Text style={styles.weekStatLabel}>kcal burned</Text>
            </View>
            <View style={styles.weekStatDivider} />
            <View style={styles.weekStat}>
              <Text style={[styles.weekStatValue, { color: '#22C55E' }]}>+2.3%</Text>
              <Text style={styles.weekStatLabel}>vs last week</Text>
            </View>
          </View>
        </View>

      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  content: { paddingHorizontal: 16, paddingTop: 52, paddingBottom: 100 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  date: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#FFF' },

  // Stats Row
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  calorieCard: {
    flex: 1.4,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  calorieRing: { alignItems: 'center', marginRight: 14 },
  calorieNumber: { fontSize: 32, fontWeight: '700', color: '#FFF' },
  calorieLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: -4 },
  calorieInfo: { flex: 1, gap: 6 },
  calorieStat: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  calorieStatValue: { fontSize: 18, fontWeight: '600', color: '#FFF' },
  calorieStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },

  rightStats: { flex: 1, gap: 6 },
  miniCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  miniValue: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  miniLabel: { fontSize: 10, color: 'rgba(255,255,255,0.35)' },

  // Macros Bar
  macrosBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  macroItem: { flex: 1, gap: 4 },
  macroProgress: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2 },
  macroFill: { height: '100%', borderRadius: 2 },
  macroText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },

  // Quick Log
  quickLogRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  quickLogBtn: { flex: 1, alignItems: 'center', gap: 6 },
  quickLogIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  quickLogLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },

  // Workout Card
  workoutCard: {
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.15)',
    marginBottom: 16,
  },
  workoutLeft: { flex: 1 },
  workoutBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  workoutBadgeText: { fontSize: 10, fontWeight: '600', color: '#EC4899' },
  workoutTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  workoutMeta: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  playBtn: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  // Section
  section: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  sectionLink: { fontSize: 12, color: '#3B82F6', fontWeight: '500' },

  // Meals
  mealRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  mealIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(245, 158, 11, 0.12)', justifyContent: 'center', alignItems: 'center' },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 14, fontWeight: '500', color: '#FFF' },
  mealTime: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  mealCals: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  addMealBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, marginTop: 4, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', borderStyle: 'dashed' },
  addMealText: { fontSize: 13, color: '#3B82F6', fontWeight: '500' },

  // Week
  weekGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  weekDay: { alignItems: 'center', gap: 6 },
  weekDayLabel: { fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: '500' },
  weekDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  weekDotDone: { backgroundColor: '#22C55E' },
  weekDotToday: { backgroundColor: '#3B82F6', borderWidth: 2, borderColor: 'rgba(59, 130, 246, 0.3)' },
  weekStats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  weekStat: { alignItems: 'center' },
  weekStatValue: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  weekStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 },
  weekStatDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.08)' },
});
