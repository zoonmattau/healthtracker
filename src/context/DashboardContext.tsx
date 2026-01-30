import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type QuickAction = 'food' | 'workout' | 'water' | 'weight' | 'sleep' | 'supplements';
export type DashboardSection = 'calories' | 'macros' | 'actions' | 'todayWorkout' | 'streak';
export type UserFocus = 'nutrition' | 'training' | 'hybrid';

interface DashboardConfig {
  userFocus: UserFocus;
  quickActions: QuickAction[];
  visibleSections: DashboardSection[];
  sectionOrder: DashboardSection[];
}

const DEFAULT_CONFIG: DashboardConfig = {
  userFocus: 'hybrid',
  quickActions: ['food', 'workout', 'water'],
  visibleSections: ['calories', 'macros', 'actions', 'todayWorkout', 'streak'],
  sectionOrder: ['calories', 'macros', 'actions', 'todayWorkout', 'streak'],
};

const NUTRITION_FOCUSED: DashboardConfig = {
  userFocus: 'nutrition',
  quickActions: ['food', 'water', 'weight'],
  visibleSections: ['calories', 'macros', 'actions', 'streak'],
  sectionOrder: ['calories', 'macros', 'actions', 'streak'],
};

const TRAINING_FOCUSED: DashboardConfig = {
  userFocus: 'training',
  quickActions: ['workout', 'weight', 'supplements'],
  visibleSections: ['todayWorkout', 'actions', 'streak', 'calories'],
  sectionOrder: ['todayWorkout', 'actions', 'streak', 'calories'],
};

interface DashboardContextType {
  config: DashboardConfig;
  updateQuickActions: (actions: QuickAction[]) => Promise<void>;
  updateVisibleSections: (sections: DashboardSection[]) => Promise<void>;
  updateSectionOrder: (sections: DashboardSection[]) => Promise<void>;
  setUserFocus: (focus: UserFocus) => Promise<void>;
  resetToDefault: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const STORAGE_KEY = '@uprep_dashboard_config';

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DashboardConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setConfig(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading dashboard config:', error);
    }
  };

  const saveConfig = async (newConfig: DashboardConfig) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch (error) {
      console.error('Error saving dashboard config:', error);
    }
  };

  const updateQuickActions = async (actions: QuickAction[]) => {
    await saveConfig({ ...config, quickActions: actions });
  };

  const updateVisibleSections = async (sections: DashboardSection[]) => {
    await saveConfig({ ...config, visibleSections: sections });
  };

  const updateSectionOrder = async (sections: DashboardSection[]) => {
    await saveConfig({ ...config, sectionOrder: sections });
  };

  const setUserFocus = async (focus: UserFocus) => {
    let newConfig: DashboardConfig;
    switch (focus) {
      case 'nutrition':
        newConfig = NUTRITION_FOCUSED;
        break;
      case 'training':
        newConfig = TRAINING_FOCUSED;
        break;
      default:
        newConfig = { ...DEFAULT_CONFIG, userFocus: 'hybrid' };
    }
    await saveConfig(newConfig);
  };

  const resetToDefault = async () => {
    await saveConfig(DEFAULT_CONFIG);
  };

  return (
    <DashboardContext.Provider
      value={{
        config,
        updateQuickActions,
        updateVisibleSections,
        updateSectionOrder,
        setUserFocus,
        resetToDefault,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

// Helper to get action details
export const ACTION_DETAILS: Record<QuickAction, { icon: string; label: string; route: string }> = {
  food: { icon: 'restaurant', label: 'Log Food', route: '/log/food' },
  workout: { icon: 'barbell', label: 'Workout', route: '/log/workout' },
  water: { icon: 'water', label: 'Water', route: '/log/water' },
  weight: { icon: 'scale', label: 'Weight', route: '/log/weight' },
  sleep: { icon: 'moon', label: 'Sleep', route: '/log/sleep' },
  supplements: { icon: 'medical', label: 'Supps', route: '/log/supplements' },
};
