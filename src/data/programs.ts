import { TrainingProgram, ProgramWeek, TemplateExercise } from '../context/DataContext';

// Helper to create exercises
const exercise = (name: string, muscle: string, sets: number, reps: number): TemplateExercise => ({
  id: `${name}-${muscle}`.toLowerCase().replace(/\s+/g, '-'),
  name,
  muscle,
  targetSets: sets,
  targetReps: reps,
});

// Push/Pull/Legs Program - 6 days/week
const pplWeek: ProgramWeek = {
  weekNumber: 1,
  workouts: [
    {
      dayOfWeek: 0, // Monday
      name: 'Push A',
      exercises: [
        exercise('Bench Press', 'Chest', 4, 8),
        exercise('Overhead Press', 'Shoulders', 3, 10),
        exercise('Incline Dumbbell Press', 'Chest', 3, 10),
        exercise('Lateral Raise', 'Shoulders', 3, 15),
        exercise('Tricep Pushdown', 'Triceps', 3, 12),
        exercise('Overhead Extension', 'Triceps', 3, 12),
      ],
    },
    {
      dayOfWeek: 1, // Tuesday
      name: 'Pull A',
      exercises: [
        exercise('Deadlift', 'Back', 4, 5),
        exercise('Barbell Row', 'Back', 4, 8),
        exercise('Lat Pulldown', 'Back', 3, 10),
        exercise('Face Pull', 'Back', 3, 15),
        exercise('Barbell Curl', 'Biceps', 3, 10),
        exercise('Hammer Curl', 'Biceps', 3, 12),
      ],
    },
    {
      dayOfWeek: 2, // Wednesday
      name: 'Legs A',
      exercises: [
        exercise('Squat', 'Quadriceps', 4, 6),
        exercise('Romanian Deadlift', 'Hamstrings', 3, 10),
        exercise('Leg Press', 'Quadriceps', 3, 12),
        exercise('Leg Curl', 'Hamstrings', 3, 12),
        exercise('Standing Calf Raise', 'Calves', 4, 15),
      ],
    },
    {
      dayOfWeek: 3, // Thursday
      name: 'Push B',
      exercises: [
        exercise('Overhead Press', 'Shoulders', 4, 6),
        exercise('Incline Bench Press', 'Chest', 3, 10),
        exercise('Dumbbell Press', 'Chest', 3, 12),
        exercise('Rear Delt Fly', 'Shoulders', 3, 15),
        exercise('Skull Crusher', 'Triceps', 3, 10),
        exercise('Tricep Dips', 'Triceps', 2, 12),
      ],
    },
    {
      dayOfWeek: 4, // Friday
      name: 'Pull B',
      exercises: [
        exercise('Barbell Row', 'Back', 4, 6),
        exercise('Pull-Up', 'Back', 3, 8),
        exercise('Seated Cable Row', 'Back', 3, 12),
        exercise('Shrugs', 'Shoulders', 3, 12),
        exercise('Preacher Curl', 'Biceps', 3, 10),
        exercise('Concentration Curl', 'Biceps', 2, 12),
      ],
    },
    {
      dayOfWeek: 5, // Saturday
      name: 'Legs B',
      exercises: [
        exercise('Front Squat', 'Quadriceps', 4, 8),
        exercise('Hip Thrust', 'Glutes', 3, 12),
        exercise('Lunges', 'Quadriceps', 3, 10),
        exercise('Leg Extension', 'Quadriceps', 3, 15),
        exercise('Seated Calf Raise', 'Calves', 4, 15),
      ],
    },
    {
      dayOfWeek: 6, // Sunday
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
  ],
};

// Upper/Lower Program - 4 days/week
const upperLowerWeek: ProgramWeek = {
  weekNumber: 1,
  workouts: [
    {
      dayOfWeek: 0, // Monday
      name: 'Upper A',
      exercises: [
        exercise('Bench Press', 'Chest', 4, 6),
        exercise('Barbell Row', 'Back', 4, 6),
        exercise('Overhead Press', 'Shoulders', 3, 10),
        exercise('Lat Pulldown', 'Back', 3, 10),
        exercise('Dumbbell Curl', 'Biceps', 2, 12),
        exercise('Tricep Pushdown', 'Triceps', 2, 12),
      ],
    },
    {
      dayOfWeek: 1, // Tuesday
      name: 'Lower A',
      exercises: [
        exercise('Squat', 'Quadriceps', 4, 5),
        exercise('Romanian Deadlift', 'Hamstrings', 3, 8),
        exercise('Leg Press', 'Quadriceps', 3, 10),
        exercise('Leg Curl', 'Hamstrings', 3, 12),
        exercise('Standing Calf Raise', 'Calves', 4, 12),
      ],
    },
    {
      dayOfWeek: 2,
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
    {
      dayOfWeek: 3, // Thursday
      name: 'Upper B',
      exercises: [
        exercise('Overhead Press', 'Shoulders', 4, 6),
        exercise('Pull-Up', 'Back', 4, 8),
        exercise('Incline Dumbbell Press', 'Chest', 3, 10),
        exercise('Seated Cable Row', 'Back', 3, 10),
        exercise('Hammer Curl', 'Biceps', 2, 12),
        exercise('Overhead Extension', 'Triceps', 2, 12),
      ],
    },
    {
      dayOfWeek: 4, // Friday
      name: 'Lower B',
      exercises: [
        exercise('Deadlift', 'Back', 4, 5),
        exercise('Front Squat', 'Quadriceps', 3, 8),
        exercise('Hip Thrust', 'Glutes', 3, 12),
        exercise('Leg Extension', 'Quadriceps', 3, 12),
        exercise('Seated Calf Raise', 'Calves', 4, 15),
      ],
    },
    {
      dayOfWeek: 5,
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
    {
      dayOfWeek: 6,
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
  ],
};

// Full Body Program - 3 days/week
const fullBodyWeek: ProgramWeek = {
  weekNumber: 1,
  workouts: [
    {
      dayOfWeek: 0, // Monday
      name: 'Full Body A',
      exercises: [
        exercise('Squat', 'Quadriceps', 3, 8),
        exercise('Bench Press', 'Chest', 3, 8),
        exercise('Barbell Row', 'Back', 3, 8),
        exercise('Overhead Press', 'Shoulders', 2, 10),
        exercise('Barbell Curl', 'Biceps', 2, 12),
        exercise('Tricep Pushdown', 'Triceps', 2, 12),
      ],
    },
    {
      dayOfWeek: 1,
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
    {
      dayOfWeek: 2, // Wednesday
      name: 'Full Body B',
      exercises: [
        exercise('Deadlift', 'Back', 3, 5),
        exercise('Incline Dumbbell Press', 'Chest', 3, 10),
        exercise('Lat Pulldown', 'Back', 3, 10),
        exercise('Lateral Raise', 'Shoulders', 3, 15),
        exercise('Leg Curl', 'Hamstrings', 2, 12),
        exercise('Plank', 'Core', 3, 60),
      ],
    },
    {
      dayOfWeek: 3,
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
    {
      dayOfWeek: 4, // Friday
      name: 'Full Body C',
      exercises: [
        exercise('Front Squat', 'Quadriceps', 3, 8),
        exercise('Dumbbell Press', 'Chest', 3, 10),
        exercise('Pull-Up', 'Back', 3, 8),
        exercise('Romanian Deadlift', 'Hamstrings', 3, 10),
        exercise('Face Pull', 'Back', 2, 15),
        exercise('Standing Calf Raise', 'Calves', 3, 15),
      ],
    },
    {
      dayOfWeek: 5,
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
    {
      dayOfWeek: 6,
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
  ],
};

// Beginner Strength Program - 3 days/week
const beginnerWeek: ProgramWeek = {
  weekNumber: 1,
  workouts: [
    {
      dayOfWeek: 0, // Monday
      name: 'Workout A',
      exercises: [
        exercise('Squat', 'Quadriceps', 3, 5),
        exercise('Bench Press', 'Chest', 3, 5),
        exercise('Barbell Row', 'Back', 3, 5),
      ],
    },
    {
      dayOfWeek: 1,
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
    {
      dayOfWeek: 2, // Wednesday
      name: 'Workout B',
      exercises: [
        exercise('Squat', 'Quadriceps', 3, 5),
        exercise('Overhead Press', 'Shoulders', 3, 5),
        exercise('Deadlift', 'Back', 1, 5),
      ],
    },
    {
      dayOfWeek: 3,
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
    {
      dayOfWeek: 4, // Friday
      name: 'Workout A',
      exercises: [
        exercise('Squat', 'Quadriceps', 3, 5),
        exercise('Bench Press', 'Chest', 3, 5),
        exercise('Barbell Row', 'Back', 3, 5),
      ],
    },
    {
      dayOfWeek: 5,
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
    {
      dayOfWeek: 6,
      name: 'Rest Day',
      isRestDay: true,
      exercises: [],
    },
  ],
};

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'ppl-6day',
    name: 'Push/Pull/Legs',
    description: 'A 6-day split that trains each muscle group twice per week. Great for intermediate to advanced lifters looking to maximize hypertrophy.',
    durationWeeks: 8,
    level: 'intermediate',
    goal: 'hypertrophy',
    daysPerWeek: 6,
    weeks: Array.from({ length: 8 }, (_, i) => ({ ...pplWeek, weekNumber: i + 1 })),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'upper-lower-4day',
    name: 'Upper/Lower Split',
    description: 'A balanced 4-day split that hits each muscle group twice per week with ample recovery time between sessions.',
    durationWeeks: 8,
    level: 'intermediate',
    goal: 'strength',
    daysPerWeek: 4,
    weeks: Array.from({ length: 8 }, (_, i) => ({ ...upperLowerWeek, weekNumber: i + 1 })),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'full-body-3day',
    name: 'Full Body Program',
    description: 'Train your entire body 3 times per week. Perfect for those with limited time who still want great results.',
    durationWeeks: 8,
    level: 'intermediate',
    goal: 'general',
    daysPerWeek: 3,
    weeks: Array.from({ length: 8 }, (_, i) => ({ ...fullBodyWeek, weekNumber: i + 1 })),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'beginner-strength',
    name: 'Beginner Strength',
    description: 'A simple 3-day program focusing on the main compound lifts. Perfect for beginners learning proper form and building a strength foundation.',
    durationWeeks: 12,
    level: 'beginner',
    goal: 'strength',
    daysPerWeek: 3,
    weeks: Array.from({ length: 12 }, (_, i) => ({ ...beginnerWeek, weekNumber: i + 1 })),
    createdAt: new Date().toISOString(),
  },
];

export const getProgramById = (id: string): TrainingProgram | undefined => {
  return TRAINING_PROGRAMS.find(p => p.id === id);
};

export const getProgramsByLevel = (level: TrainingProgram['level']): TrainingProgram[] => {
  return TRAINING_PROGRAMS.filter(p => p.level === level);
};

export const getProgramsByGoal = (goal: TrainingProgram['goal']): TrainingProgram[] => {
  return TRAINING_PROGRAMS.filter(p => p.goal === goal);
};
