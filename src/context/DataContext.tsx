import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============ TYPES ============

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
}

export interface DailyNutrition {
  date: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  foods: FoodEntry[];
}

export interface WaterEntry {
  date: string;
  amount: number; // in ml
  goal: number;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number; // in kg
  timestamp: string;
}

export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string; // HH:MM
  wakeTime: string; // HH:MM
  duration: number; // in hours
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  timestamp: string;
}

export interface SupplementLog {
  date: string;
  taken: string[]; // array of supplement ids
}

export interface ExerciseSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscle: string;
  sets: ExerciseSet[];
}

export interface WorkoutEntry {
  id: string;
  date: string;
  name: string;
  duration: number; // in seconds
  exercises: WorkoutExercise[];
  totalVolume: number; // kg
  totalSets: number;
  timestamp: string;
}

export interface PersonalRecord {
  exercise: string;
  weight: number;
  reps: number;
  date: string;
}

export interface UserGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number; // ml
  weight: number; // target weight kg
  workoutsPerWeek: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export interface TemplateExercise {
  id: string;
  name: string;
  muscle: string;
  targetSets: number;
  targetReps: number;
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: TemplateExercise[];
  estimatedDuration: number; // minutes
  createdAt: string;
  lastUsed?: string;
  timesUsed: number;
}

export interface ProgramWorkout {
  dayOfWeek: number; // 0 = Monday, 6 = Sunday
  name: string;
  exercises: TemplateExercise[];
  isRestDay?: boolean;
}

export interface ProgramWeek {
  weekNumber: number;
  workouts: ProgramWorkout[];
  notes?: string;
}

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'general';
  daysPerWeek: number;
  weeks: ProgramWeek[];
  createdAt: string;
}

export interface ActiveProgram {
  programId: string;
  programName: string;
  startDate: string;
  currentWeek: number;
  completedWorkouts: string[]; // Array of "week-day" strings
}

// ============ CONTEXT ============

interface DataContextType {
  // Nutrition
  todayNutrition: DailyNutrition;
  addFoodEntry: (food: Omit<FoodEntry, 'id' | 'timestamp'>) => Promise<void>;
  removeFoodEntry: (id: string) => Promise<void>;

  // Water
  todayWater: WaterEntry;
  addWater: (amount: number) => Promise<void>;
  setWaterGoal: (goal: number) => Promise<void>;

  // Weight
  weightHistory: WeightEntry[];
  latestWeight: WeightEntry | null;
  addWeight: (weight: number) => Promise<void>;

  // Sleep
  todaySleep: SleepEntry | null;
  sleepHistory: SleepEntry[];
  addSleep: (bedtime: string, wakeTime: string, quality: SleepEntry['quality']) => Promise<void>;

  // Supplements
  todaySupplements: string[];
  toggleSupplement: (supplementId: string) => Promise<void>;

  // Workouts
  workoutHistory: WorkoutEntry[];
  todayWorkout: WorkoutEntry | null;
  saveWorkout: (workout: Omit<WorkoutEntry, 'id' | 'timestamp'>) => Promise<void>;
  personalRecords: PersonalRecord[];

  // Templates
  workoutTemplates: WorkoutTemplate[];
  saveTemplate: (template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'timesUsed'>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  useTemplate: (id: string) => Promise<WorkoutTemplate | null>;

  // Programs
  activeProgram: ActiveProgram | null;
  startProgram: (program: TrainingProgram) => Promise<void>;
  completeWorkout: (week: number, day: number) => Promise<void>;
  endProgram: () => Promise<void>;
  getProgramProgress: () => { completedWorkouts: number; totalWorkouts: number; percentComplete: number };

  // Goals
  goals: UserGoals;
  updateGoals: (goals: Partial<UserGoals>) => Promise<void>;

  // Streak
  streak: StreakData;

  // Loading
  isLoading: boolean;

  // Reset
  clearAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ============ STORAGE KEYS ============

const KEYS = {
  NUTRITION: '@uprep_nutrition_',
  WATER: '@uprep_water_',
  WEIGHT: '@uprep_weight_history',
  SLEEP: '@uprep_sleep_',
  SUPPLEMENTS: '@uprep_supplements_',
  WORKOUTS: '@uprep_workouts',
  TEMPLATES: '@uprep_templates',
  ACTIVE_PROGRAM: '@uprep_active_program',
  GOALS: '@uprep_goals',
  STREAK: '@uprep_streak',
};

// ============ HELPERS ============

const getToday = () => new Date().toISOString().split('T')[0];

const generateId = () => Math.random().toString(36).substring(2, 9);

const calculateSleepDuration = (bedtime: string, wakeTime: string): number => {
  const [bedH, bedM] = bedtime.split(':').map(Number);
  const [wakeH, wakeM] = wakeTime.split(':').map(Number);

  let bedMinutes = bedH * 60 + bedM;
  let wakeMinutes = wakeH * 60 + wakeM;

  // Handle overnight sleep
  if (wakeMinutes < bedMinutes) {
    wakeMinutes += 24 * 60;
  }

  return (wakeMinutes - bedMinutes) / 60;
};

// ============ DEFAULT VALUES ============

const DEFAULT_GOALS: UserGoals = {
  calories: 2400,
  protein: 180,
  carbs: 250,
  fat: 80,
  water: 3000,
  weight: 75,
  workoutsPerWeek: 4,
};

const getDefaultNutrition = (date: string, goals: UserGoals): DailyNutrition => ({
  date,
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  calorieGoal: goals.calories,
  proteinGoal: goals.protein,
  carbsGoal: goals.carbs,
  fatGoal: goals.fat,
  foods: [],
});

const getDefaultWater = (date: string, goals: UserGoals): WaterEntry => ({
  date,
  amount: 0,
  goal: goals.water,
});

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
};

// ============ PROVIDER ============

export function DataProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS);
  const [todayNutrition, setTodayNutrition] = useState<DailyNutrition>(getDefaultNutrition(getToday(), DEFAULT_GOALS));
  const [todayWater, setTodayWater] = useState<WaterEntry>(getDefaultWater(getToday(), DEFAULT_GOALS));
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>([]);
  const [todaySupplements, setTodaySupplements] = useState<string[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutEntry[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null);
  const [streak, setStreak] = useState<StreakData>(DEFAULT_STREAK);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const today = getToday();

      // Load goals
      const storedGoals = await AsyncStorage.getItem(KEYS.GOALS);
      const parsedGoals = storedGoals ? JSON.parse(storedGoals) : DEFAULT_GOALS;
      setGoals(parsedGoals);

      // Load today's nutrition
      const storedNutrition = await AsyncStorage.getItem(KEYS.NUTRITION + today);
      if (storedNutrition) {
        setTodayNutrition(JSON.parse(storedNutrition));
      } else {
        setTodayNutrition(getDefaultNutrition(today, parsedGoals));
      }

      // Load today's water
      const storedWater = await AsyncStorage.getItem(KEYS.WATER + today);
      if (storedWater) {
        setTodayWater(JSON.parse(storedWater));
      } else {
        setTodayWater(getDefaultWater(today, parsedGoals));
      }

      // Load weight history
      const storedWeight = await AsyncStorage.getItem(KEYS.WEIGHT);
      if (storedWeight) {
        setWeightHistory(JSON.parse(storedWeight));
      }

      // Load sleep history (last 30 days)
      const sleepEntries: SleepEntry[] = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const stored = await AsyncStorage.getItem(KEYS.SLEEP + dateStr);
        if (stored) {
          sleepEntries.push(JSON.parse(stored));
        }
      }
      setSleepHistory(sleepEntries);

      // Load today's supplements
      const storedSupps = await AsyncStorage.getItem(KEYS.SUPPLEMENTS + today);
      if (storedSupps) {
        setTodaySupplements(JSON.parse(storedSupps));
      }

      // Load workout history
      const storedWorkouts = await AsyncStorage.getItem(KEYS.WORKOUTS);
      if (storedWorkouts) {
        setWorkoutHistory(JSON.parse(storedWorkouts));
      }

      // Load workout templates
      const storedTemplates = await AsyncStorage.getItem(KEYS.TEMPLATES);
      if (storedTemplates) {
        setWorkoutTemplates(JSON.parse(storedTemplates));
      }

      // Load active program
      const storedProgram = await AsyncStorage.getItem(KEYS.ACTIVE_PROGRAM);
      if (storedProgram) {
        setActiveProgram(JSON.parse(storedProgram));
      }

      // Load streak
      const storedStreak = await AsyncStorage.getItem(KEYS.STREAK);
      if (storedStreak) {
        const parsedStreak = JSON.parse(storedStreak);
        // Check if streak should be reset (missed a day)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (parsedStreak.lastActiveDate !== today && parsedStreak.lastActiveDate !== yesterdayStr) {
          // Streak broken
          setStreak({ ...parsedStreak, currentStreak: 0 });
        } else {
          setStreak(parsedStreak);
        }
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update streak when user logs activity
  const updateStreak = useCallback(async () => {
    const today = getToday();

    if (streak.lastActiveDate === today) return; // Already logged today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak: StreakData;

    if (streak.lastActiveDate === yesterdayStr || streak.currentStreak === 0) {
      // Continuing streak or starting fresh
      newStreak = {
        currentStreak: streak.currentStreak + 1,
        longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
        lastActiveDate: today,
      };
    } else {
      // Streak was broken, start at 1
      newStreak = {
        currentStreak: 1,
        longestStreak: streak.longestStreak,
        lastActiveDate: today,
      };
    }

    setStreak(newStreak);
    await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(newStreak));
  }, [streak]);

  // ============ NUTRITION ============

  const addFoodEntry = async (food: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const today = getToday();
    const newEntry: FoodEntry = {
      ...food,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };

    const updated: DailyNutrition = {
      ...todayNutrition,
      date: today,
      calories: todayNutrition.calories + food.calories,
      protein: todayNutrition.protein + food.protein,
      carbs: todayNutrition.carbs + food.carbs,
      fat: todayNutrition.fat + food.fat,
      foods: [...todayNutrition.foods, newEntry],
    };

    setTodayNutrition(updated);
    await AsyncStorage.setItem(KEYS.NUTRITION + today, JSON.stringify(updated));
    await updateStreak();
  };

  const removeFoodEntry = async (id: string) => {
    const today = getToday();
    const entry = todayNutrition.foods.find(f => f.id === id);
    if (!entry) return;

    const updated: DailyNutrition = {
      ...todayNutrition,
      calories: todayNutrition.calories - entry.calories,
      protein: todayNutrition.protein - entry.protein,
      carbs: todayNutrition.carbs - entry.carbs,
      fat: todayNutrition.fat - entry.fat,
      foods: todayNutrition.foods.filter(f => f.id !== id),
    };

    setTodayNutrition(updated);
    await AsyncStorage.setItem(KEYS.NUTRITION + today, JSON.stringify(updated));
  };

  // ============ WATER ============

  const addWater = async (amount: number) => {
    const today = getToday();
    const updated: WaterEntry = {
      ...todayWater,
      date: today,
      amount: todayWater.amount + amount,
    };

    setTodayWater(updated);
    await AsyncStorage.setItem(KEYS.WATER + today, JSON.stringify(updated));
    await updateStreak();
  };

  const setWaterGoal = async (goal: number) => {
    const today = getToday();
    const updated: WaterEntry = { ...todayWater, goal };
    setTodayWater(updated);
    await AsyncStorage.setItem(KEYS.WATER + today, JSON.stringify(updated));
  };

  // ============ WEIGHT ============

  const addWeight = async (weight: number) => {
    const newEntry: WeightEntry = {
      id: generateId(),
      date: getToday(),
      weight,
      timestamp: new Date().toISOString(),
    };

    // Remove any existing entry for today
    const filtered = weightHistory.filter(w => w.date !== getToday());
    const updated = [newEntry, ...filtered].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setWeightHistory(updated);
    await AsyncStorage.setItem(KEYS.WEIGHT, JSON.stringify(updated));
    await updateStreak();
  };

  // ============ SLEEP ============

  const addSleep = async (bedtime: string, wakeTime: string, quality: SleepEntry['quality']) => {
    const today = getToday();
    const duration = calculateSleepDuration(bedtime, wakeTime);

    const newEntry: SleepEntry = {
      id: generateId(),
      date: today,
      bedtime,
      wakeTime,
      duration,
      quality,
      timestamp: new Date().toISOString(),
    };

    // Update sleep history
    const filtered = sleepHistory.filter(s => s.date !== today);
    const updated = [newEntry, ...filtered];

    setSleepHistory(updated);
    await AsyncStorage.setItem(KEYS.SLEEP + today, JSON.stringify(newEntry));
    await updateStreak();
  };

  // ============ SUPPLEMENTS ============

  const toggleSupplement = async (supplementId: string) => {
    const today = getToday();
    let updated: string[];

    if (todaySupplements.includes(supplementId)) {
      updated = todaySupplements.filter(s => s !== supplementId);
    } else {
      updated = [...todaySupplements, supplementId];
    }

    setTodaySupplements(updated);
    await AsyncStorage.setItem(KEYS.SUPPLEMENTS + today, JSON.stringify(updated));

    if (updated.length > 0) {
      await updateStreak();
    }
  };

  // ============ WORKOUTS ============

  const saveWorkout = async (workout: Omit<WorkoutEntry, 'id' | 'timestamp'>) => {
    const newEntry: WorkoutEntry = {
      ...workout,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };

    const updated = [newEntry, ...workoutHistory];
    setWorkoutHistory(updated);
    await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(updated));
    await updateStreak();
  };

  // ============ TEMPLATES ============

  const saveTemplate = async (template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'timesUsed'>) => {
    const newTemplate: WorkoutTemplate = {
      ...template,
      id: generateId(),
      createdAt: new Date().toISOString(),
      timesUsed: 0,
    };

    const updated = [...workoutTemplates, newTemplate];
    setWorkoutTemplates(updated);
    await AsyncStorage.setItem(KEYS.TEMPLATES, JSON.stringify(updated));
  };

  const deleteTemplate = async (id: string) => {
    const updated = workoutTemplates.filter(t => t.id !== id);
    setWorkoutTemplates(updated);
    await AsyncStorage.setItem(KEYS.TEMPLATES, JSON.stringify(updated));
  };

  const useTemplate = async (id: string): Promise<WorkoutTemplate | null> => {
    const template = workoutTemplates.find(t => t.id === id);
    if (!template) return null;

    // Update usage stats
    const updated = workoutTemplates.map(t =>
      t.id === id
        ? { ...t, lastUsed: new Date().toISOString(), timesUsed: t.timesUsed + 1 }
        : t
    );
    setWorkoutTemplates(updated);
    await AsyncStorage.setItem(KEYS.TEMPLATES, JSON.stringify(updated));

    return template;
  };

  // ============ PROGRAMS ============

  const startProgram = async (program: TrainingProgram) => {
    const newActiveProgram: ActiveProgram = {
      programId: program.id,
      programName: program.name,
      startDate: new Date().toISOString().split('T')[0],
      currentWeek: 1,
      completedWorkouts: [],
    };

    setActiveProgram(newActiveProgram);
    await AsyncStorage.setItem(KEYS.ACTIVE_PROGRAM, JSON.stringify(newActiveProgram));
  };

  const completeWorkout = async (week: number, day: number) => {
    if (!activeProgram) return;

    const workoutKey = `${week}-${day}`;
    if (activeProgram.completedWorkouts.includes(workoutKey)) return;

    const updated: ActiveProgram = {
      ...activeProgram,
      completedWorkouts: [...activeProgram.completedWorkouts, workoutKey],
      currentWeek: Math.max(activeProgram.currentWeek, week),
    };

    setActiveProgram(updated);
    await AsyncStorage.setItem(KEYS.ACTIVE_PROGRAM, JSON.stringify(updated));
  };

  const endProgram = async () => {
    setActiveProgram(null);
    await AsyncStorage.removeItem(KEYS.ACTIVE_PROGRAM);
  };

  const getProgramProgress = () => {
    if (!activeProgram) {
      return { completedWorkouts: 0, totalWorkouts: 0, percentComplete: 0 };
    }

    // This is a simplified version - in reality we'd need the program data
    const completedWorkouts = activeProgram.completedWorkouts.length;
    // Estimate based on typical 4-day program for 8 weeks
    const totalWorkouts = 32;
    const percentComplete = Math.round((completedWorkouts / totalWorkouts) * 100);

    return { completedWorkouts, totalWorkouts, percentComplete };
  };

  // ============ GOALS ============

  const updateGoals = async (newGoals: Partial<UserGoals>) => {
    const updated = { ...goals, ...newGoals };
    setGoals(updated);
    await AsyncStorage.setItem(KEYS.GOALS, JSON.stringify(updated));

    // Update today's nutrition goals
    setTodayNutrition(prev => ({
      ...prev,
      calorieGoal: updated.calories,
      proteinGoal: updated.protein,
      carbsGoal: updated.carbs,
      fatGoal: updated.fat,
    }));

    // Update water goal
    setTodayWater(prev => ({ ...prev, goal: updated.water }));
  };

  // ============ CLEAR DATA ============

  const clearAllData = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const uprepKeys = keys.filter(k => k.startsWith('@uprep_'));
    await AsyncStorage.multiRemove(uprepKeys);

    // Reset to defaults
    setGoals(DEFAULT_GOALS);
    setTodayNutrition(getDefaultNutrition(getToday(), DEFAULT_GOALS));
    setTodayWater(getDefaultWater(getToday(), DEFAULT_GOALS));
    setWeightHistory([]);
    setSleepHistory([]);
    setTodaySupplements([]);
    setWorkoutHistory([]);
    setWorkoutTemplates([]);
    setActiveProgram(null);
    setStreak(DEFAULT_STREAK);
  };

  // ============ COMPUTED VALUES ============

  const latestWeight = weightHistory.length > 0 ? weightHistory[0] : null;

  const todaySleep = sleepHistory.find(s => s.date === getToday()) || null;

  const todayWorkout = workoutHistory.find(w => w.date === getToday()) || null;

  // Calculate personal records from workout history
  const personalRecords: PersonalRecord[] = React.useMemo(() => {
    const records: Record<string, PersonalRecord> = {};

    workoutHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.completed && set.weight > 0) {
            const key = exercise.name;
            if (!records[key] || set.weight > records[key].weight) {
              records[key] = {
                exercise: exercise.name,
                weight: set.weight,
                reps: set.reps,
                date: workout.date,
              };
            }
          }
        });
      });
    });

    return Object.values(records).sort((a, b) => b.weight - a.weight);
  }, [workoutHistory]);

  return (
    <DataContext.Provider
      value={{
        todayNutrition,
        addFoodEntry,
        removeFoodEntry,
        todayWater,
        addWater,
        setWaterGoal,
        weightHistory,
        latestWeight,
        addWeight,
        todaySleep,
        sleepHistory,
        addSleep,
        todaySupplements,
        toggleSupplement,
        workoutHistory,
        todayWorkout,
        saveWorkout,
        personalRecords,
        workoutTemplates,
        saveTemplate,
        deleteTemplate,
        useTemplate,
        activeProgram,
        startProgram,
        completeWorkout,
        endProgram,
        getProgramProgress,
        goals,
        updateGoals,
        streak,
        isLoading,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
