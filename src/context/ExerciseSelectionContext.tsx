import { createContext, useContext, useState, ReactNode } from 'react';
import { Exercise } from '../data/exercises';

interface ExerciseSelectionContextType {
  pendingExercise: Exercise | null;
  setPendingExercise: (exercise: Exercise | null) => void;
}

const ExerciseSelectionContext = createContext<ExerciseSelectionContextType | undefined>(undefined);

export function ExerciseSelectionProvider({ children }: { children: ReactNode }) {
  const [pendingExercise, setPendingExercise] = useState<Exercise | null>(null);

  return (
    <ExerciseSelectionContext.Provider value={{ pendingExercise, setPendingExercise }}>
      {children}
    </ExerciseSelectionContext.Provider>
  );
}

export function useExerciseSelection() {
  const context = useContext(ExerciseSelectionContext);
  if (!context) {
    throw new Error('useExerciseSelection must be used within ExerciseSelectionProvider');
  }
  return context;
}
