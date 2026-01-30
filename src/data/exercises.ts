export interface Exercise {
  id: string;
  name: string;
  muscle: MuscleGroup;
  category: ExerciseCategory;
  equipment: Equipment[];
  instructions?: string[];
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'full_body';

export type ExerciseCategory = 'compound' | 'isolation' | 'cardio' | 'stretching';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'resistance_band'
  | 'ez_bar'
  | 'smith_machine'
  | 'trap_bar';

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  core: 'Core',
  quadriceps: 'Quadriceps',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  full_body: 'Full Body',
};

export const MUSCLE_ICONS: Record<MuscleGroup, string> = {
  chest: '🫁',
  back: '🔙',
  shoulders: '🦾',
  biceps: '💪',
  triceps: '💪',
  forearms: '🦵',
  core: '🎯',
  quadriceps: '🦵',
  hamstrings: '🦵',
  glutes: '🍑',
  calves: '🦶',
  full_body: '🏃',
};

export const EXERCISES: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', muscle: 'chest', category: 'compound', equipment: ['barbell'] },
  { id: 'incline-bench-press', name: 'Incline Bench Press', muscle: 'chest', category: 'compound', equipment: ['barbell'] },
  { id: 'decline-bench-press', name: 'Decline Bench Press', muscle: 'chest', category: 'compound', equipment: ['barbell'] },
  { id: 'dumbbell-press', name: 'Dumbbell Press', muscle: 'chest', category: 'compound', equipment: ['dumbbell'] },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', muscle: 'chest', category: 'compound', equipment: ['dumbbell'] },
  { id: 'cable-fly', name: 'Cable Fly', muscle: 'chest', category: 'isolation', equipment: ['cable'] },
  { id: 'pec-deck', name: 'Pec Deck', muscle: 'chest', category: 'isolation', equipment: ['machine'] },
  { id: 'push-up', name: 'Push-Up', muscle: 'chest', category: 'compound', equipment: ['bodyweight'] },
  { id: 'dips', name: 'Dips', muscle: 'chest', category: 'compound', equipment: ['bodyweight'] },

  // Back
  { id: 'deadlift', name: 'Deadlift', muscle: 'back', category: 'compound', equipment: ['barbell'] },
  { id: 'barbell-row', name: 'Barbell Row', muscle: 'back', category: 'compound', equipment: ['barbell'] },
  { id: 'dumbbell-row', name: 'Dumbbell Row', muscle: 'back', category: 'compound', equipment: ['dumbbell'] },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscle: 'back', category: 'compound', equipment: ['cable'] },
  { id: 'pull-up', name: 'Pull-Up', muscle: 'back', category: 'compound', equipment: ['bodyweight'] },
  { id: 'chin-up', name: 'Chin-Up', muscle: 'back', category: 'compound', equipment: ['bodyweight'] },
  { id: 'seated-cable-row', name: 'Seated Cable Row', muscle: 'back', category: 'compound', equipment: ['cable'] },
  { id: 't-bar-row', name: 'T-Bar Row', muscle: 'back', category: 'compound', equipment: ['barbell'] },
  { id: 'face-pull', name: 'Face Pull', muscle: 'back', category: 'isolation', equipment: ['cable'] },

  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', muscle: 'shoulders', category: 'compound', equipment: ['barbell'] },
  { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', muscle: 'shoulders', category: 'compound', equipment: ['dumbbell'] },
  { id: 'arnold-press', name: 'Arnold Press', muscle: 'shoulders', category: 'compound', equipment: ['dumbbell'] },
  { id: 'lateral-raise', name: 'Lateral Raise', muscle: 'shoulders', category: 'isolation', equipment: ['dumbbell'] },
  { id: 'front-raise', name: 'Front Raise', muscle: 'shoulders', category: 'isolation', equipment: ['dumbbell'] },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', muscle: 'shoulders', category: 'isolation', equipment: ['dumbbell', 'cable'] },
  { id: 'upright-row', name: 'Upright Row', muscle: 'shoulders', category: 'compound', equipment: ['barbell', 'dumbbell'] },
  { id: 'shrugs', name: 'Shrugs', muscle: 'shoulders', category: 'isolation', equipment: ['barbell', 'dumbbell'] },

  // Biceps
  { id: 'barbell-curl', name: 'Barbell Curl', muscle: 'biceps', category: 'isolation', equipment: ['barbell'] },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', muscle: 'biceps', category: 'isolation', equipment: ['dumbbell'] },
  { id: 'hammer-curl', name: 'Hammer Curl', muscle: 'biceps', category: 'isolation', equipment: ['dumbbell'] },
  { id: 'preacher-curl', name: 'Preacher Curl', muscle: 'biceps', category: 'isolation', equipment: ['ez_bar', 'dumbbell'] },
  { id: 'incline-curl', name: 'Incline Dumbbell Curl', muscle: 'biceps', category: 'isolation', equipment: ['dumbbell'] },
  { id: 'cable-curl', name: 'Cable Curl', muscle: 'biceps', category: 'isolation', equipment: ['cable'] },
  { id: 'concentration-curl', name: 'Concentration Curl', muscle: 'biceps', category: 'isolation', equipment: ['dumbbell'] },

  // Triceps
  { id: 'close-grip-bench', name: 'Close Grip Bench Press', muscle: 'triceps', category: 'compound', equipment: ['barbell'] },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', muscle: 'triceps', category: 'isolation', equipment: ['cable'] },
  { id: 'overhead-extension', name: 'Overhead Tricep Extension', muscle: 'triceps', category: 'isolation', equipment: ['dumbbell', 'cable'] },
  { id: 'skull-crusher', name: 'Skull Crusher', muscle: 'triceps', category: 'isolation', equipment: ['ez_bar', 'barbell'] },
  { id: 'tricep-dips', name: 'Tricep Dips', muscle: 'triceps', category: 'compound', equipment: ['bodyweight'] },
  { id: 'kickback', name: 'Tricep Kickback', muscle: 'triceps', category: 'isolation', equipment: ['dumbbell'] },

  // Quadriceps
  { id: 'squat', name: 'Squat', muscle: 'quadriceps', category: 'compound', equipment: ['barbell'] },
  { id: 'front-squat', name: 'Front Squat', muscle: 'quadriceps', category: 'compound', equipment: ['barbell'] },
  { id: 'leg-press', name: 'Leg Press', muscle: 'quadriceps', category: 'compound', equipment: ['machine'] },
  { id: 'leg-extension', name: 'Leg Extension', muscle: 'quadriceps', category: 'isolation', equipment: ['machine'] },
  { id: 'lunges', name: 'Lunges', muscle: 'quadriceps', category: 'compound', equipment: ['bodyweight', 'dumbbell', 'barbell'] },
  { id: 'goblet-squat', name: 'Goblet Squat', muscle: 'quadriceps', category: 'compound', equipment: ['dumbbell', 'kettlebell'] },
  { id: 'hack-squat', name: 'Hack Squat', muscle: 'quadriceps', category: 'compound', equipment: ['machine'] },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', muscle: 'quadriceps', category: 'compound', equipment: ['bodyweight', 'dumbbell'] },

  // Hamstrings
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscle: 'hamstrings', category: 'compound', equipment: ['barbell', 'dumbbell'] },
  { id: 'leg-curl', name: 'Leg Curl', muscle: 'hamstrings', category: 'isolation', equipment: ['machine'] },
  { id: 'stiff-leg-deadlift', name: 'Stiff Leg Deadlift', muscle: 'hamstrings', category: 'compound', equipment: ['barbell'] },
  { id: 'good-morning', name: 'Good Morning', muscle: 'hamstrings', category: 'compound', equipment: ['barbell'] },
  { id: 'nordic-curl', name: 'Nordic Curl', muscle: 'hamstrings', category: 'isolation', equipment: ['bodyweight'] },

  // Glutes
  { id: 'hip-thrust', name: 'Hip Thrust', muscle: 'glutes', category: 'compound', equipment: ['barbell', 'bodyweight'] },
  { id: 'glute-bridge', name: 'Glute Bridge', muscle: 'glutes', category: 'isolation', equipment: ['bodyweight', 'barbell'] },
  { id: 'cable-kickback', name: 'Cable Kickback', muscle: 'glutes', category: 'isolation', equipment: ['cable'] },
  { id: 'sumo-deadlift', name: 'Sumo Deadlift', muscle: 'glutes', category: 'compound', equipment: ['barbell'] },

  // Calves
  { id: 'standing-calf-raise', name: 'Standing Calf Raise', muscle: 'calves', category: 'isolation', equipment: ['machine', 'bodyweight'] },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', muscle: 'calves', category: 'isolation', equipment: ['machine'] },
  { id: 'donkey-calf-raise', name: 'Donkey Calf Raise', muscle: 'calves', category: 'isolation', equipment: ['machine'] },

  // Core
  { id: 'plank', name: 'Plank', muscle: 'core', category: 'isolation', equipment: ['bodyweight'] },
  { id: 'crunches', name: 'Crunches', muscle: 'core', category: 'isolation', equipment: ['bodyweight'] },
  { id: 'leg-raise', name: 'Leg Raise', muscle: 'core', category: 'isolation', equipment: ['bodyweight'] },
  { id: 'russian-twist', name: 'Russian Twist', muscle: 'core', category: 'isolation', equipment: ['bodyweight', 'dumbbell'] },
  { id: 'cable-crunch', name: 'Cable Crunch', muscle: 'core', category: 'isolation', equipment: ['cable'] },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', muscle: 'core', category: 'isolation', equipment: ['bodyweight'] },
  { id: 'dead-bug', name: 'Dead Bug', muscle: 'core', category: 'isolation', equipment: ['bodyweight'] },
  { id: 'mountain-climber', name: 'Mountain Climbers', muscle: 'core', category: 'compound', equipment: ['bodyweight'] },
];

export function getExercisesByMuscle(muscle: MuscleGroup): Exercise[] {
  return EXERCISES.filter(e => e.muscle === muscle);
}

export function searchExercises(query: string): Exercise[] {
  const lowerQuery = query.toLowerCase();
  return EXERCISES.filter(
    e =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.muscle.toLowerCase().includes(lowerQuery) ||
      e.equipment.some(eq => eq.toLowerCase().includes(lowerQuery))
  );
}

export function getAllMuscleGroups(): MuscleGroup[] {
  return Object.keys(MUSCLE_LABELS) as MuscleGroup[];
}
