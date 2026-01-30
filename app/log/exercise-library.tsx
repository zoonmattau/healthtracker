import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import {
  EXERCISES,
  Exercise,
  MuscleGroup,
  MUSCLE_LABELS,
  MUSCLE_ICONS,
  getAllMuscleGroups,
  getExercisesByMuscle,
  searchExercises,
} from '../../src/data/exercises';
import { useExerciseSelection } from '../../src/context/ExerciseSelectionContext';

export default function ExerciseLibrary() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { setPendingExercise } = useExerciseSelection();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);

  const muscleGroups = getAllMuscleGroups();

  const filteredExercises = useMemo(() => {
    if (searchQuery.trim()) {
      return searchExercises(searchQuery);
    }
    if (selectedMuscle) {
      return getExercisesByMuscle(selectedMuscle);
    }
    return EXERCISES;
  }, [searchQuery, selectedMuscle]);

  const handleExerciseSelect = (exercise: Exercise) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // If we're in add mode (from workout-active), set the exercise and go back
    if (params.mode === 'add') {
      setPendingExercise(exercise);
      router.back();
    } else {
      // Just browsing - could show exercise details in the future
      router.back();
    }
  };

  const handleMuscleSelect = (muscle: MuscleGroup) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedMuscle === muscle) {
      setSelectedMuscle(null);
    } else {
      setSelectedMuscle(muscle);
    }
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => handleExerciseSelect(item)}
    >
      <View style={styles.exerciseIcon}>
        <Text style={styles.exerciseIconText}>{MUSCLE_ICONS[item.muscle]}</Text>
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseMeta}>
          {MUSCLE_LABELS[item.muscle]} · {item.category}
        </Text>
      </View>
      <Ionicons name="add-circle" size={28} color={colors.accent.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Exercise Library</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.text.tertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Muscle Group Filter */}
      {!searchQuery && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {muscleGroups.map((muscle) => (
            <TouchableOpacity
              key={muscle}
              style={[
                styles.filterChip,
                selectedMuscle === muscle && styles.filterChipActive,
              ]}
              onPress={() => handleMuscleSelect(muscle)}
            >
              <Text style={styles.filterChipIcon}>{MUSCLE_ICONS[muscle]}</Text>
              <Text
                style={[
                  styles.filterChipText,
                  selectedMuscle === muscle && styles.filterChipTextActive,
                ]}
              >
                {MUSCLE_LABELS[muscle]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
        </Text>
        {selectedMuscle && !searchQuery && (
          <TouchableOpacity onPress={() => setSelectedMuscle(null)}>
            <Text style={styles.clearFilter}>Clear filter</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No exercises found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        }
      />

      {/* Create Custom Exercise */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add" size={20} color={colors.accent.primary} />
          <Text style={styles.createButtonText}>Create Custom Exercise</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  filterScroll: {
    maxHeight: 50,
    marginBottom: spacing.md,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  filterChipActive: {
    backgroundColor: colors.accent.primary,
  },
  filterChipIcon: {
    fontSize: 16,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  resultsCount: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  clearFilter: {
    fontSize: fontSize.sm,
    color: colors.accent.primary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  exerciseIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  exerciseIconText: {
    fontSize: 20,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  exerciseMeta: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderStyle: 'dashed',
  },
  createButtonText: {
    fontSize: fontSize.md,
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
  },
});
