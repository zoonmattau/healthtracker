import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { useData, FoodEntry } from '../../src/context/DataContext';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snacks' },
];

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

const COMMON_FOODS: FoodItem[] = [
  { id: '1', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { id: '2', name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup' },
  { id: '3', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium' },
  { id: '4', name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '170g' },
  { id: '5', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '28g' },
  { id: '6', name: 'Eggs (2 large)', calories: 156, protein: 12, carbs: 1.2, fat: 10, serving: '2 eggs' },
  { id: '7', name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, serving: '1 cup cooked' },
  { id: '8', name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100g' },
  { id: '9', name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '1 cup' },
  { id: '10', name: 'Sweet Potato', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, serving: '1 medium' },
];

export default function LogFood() {
  const router = useRouter();
  const { todayNutrition, addFoodEntry, removeFoodEntry } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servings, setServings] = useState('1');

  const handleFoodPress = (food: FoodItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFood(food);
    setServings('1');
    setShowAddModal(true);
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;

    const servingMultiplier = parseFloat(servings) || 1;

    await addFoodEntry({
      name: selectedFood.name,
      calories: Math.round(selectedFood.calories * servingMultiplier),
      protein: Math.round(selectedFood.protein * servingMultiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbs * servingMultiplier * 10) / 10,
      fat: Math.round(selectedFood.fat * servingMultiplier * 10) / 10,
      meal: selectedMeal,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowAddModal(false);
    setSelectedFood(null);
  };

  const handleRemoveFood = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await removeFoodEntry(id);
  };

  // Filter foods by search
  const filteredFoods = COMMON_FOODS.filter(
    f => f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get foods logged for selected meal
  const mealFoods = todayNutrition.foods.filter(f => f.meal === selectedMeal);

  // Calculate today's totals
  const remaining = todayNutrition.calorieGoal - todayNutrition.calories;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Log Food</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Today's Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{todayNutrition.calories}</Text>
          <Text style={styles.summaryLabel}>Eaten</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, remaining < 0 && styles.overLimit]}>
            {remaining}
          </Text>
          <Text style={styles.summaryLabel}>Remaining</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{todayNutrition.calorieGoal}</Text>
          <Text style={styles.summaryLabel}>Goal</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.barcodeButton}>
            <Ionicons name="barcode-outline" size={24} color={colors.accent.primary} />
          </TouchableOpacity>
        </View>

        {/* Meal Type Selector */}
        <View style={styles.mealSelector}>
          {MEAL_TYPES.map((meal) => (
            <TouchableOpacity
              key={meal.id}
              style={[styles.mealChip, selectedMeal === meal.id && styles.mealChipActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedMeal(meal.id);
              }}
            >
              <Text style={[styles.mealChipText, selectedMeal === meal.id && styles.mealChipTextActive]}>
                {meal.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logged Foods for Selected Meal */}
        {mealFoods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {MEAL_TYPES.find(m => m.id === selectedMeal)?.label} - Logged
            </Text>
            {mealFoods.map((food) => (
              <View key={food.id} style={styles.loggedFoodItem}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodMacros}>
                    P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                  </Text>
                </View>
                <Text style={styles.foodCalories}>{food.calories} cal</Text>
                <TouchableOpacity
                  style={styles.removeFoodButton}
                  onPress={() => handleRemoveFood(food.id)}
                >
                  <Ionicons name="close" size={20} color={colors.error.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="camera" size={24} color={colors.accent.primary} />
            </View>
            <Text style={styles.quickActionText}>Scan Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="mic" size={24} color={colors.accent.primary} />
            </View>
            <Text style={styles.quickActionText}>Voice Log</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="create" size={24} color={colors.accent.primary} />
            </View>
            <Text style={styles.quickActionText}>Custom</Text>
          </TouchableOpacity>
        </View>

        {/* Food List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'Common Foods'}
          </Text>
          {filteredFoods.map((food) => (
            <Pressable
              key={food.id}
              style={({ pressed }) => [styles.foodItem, pressed && { opacity: 0.7 }]}
              onPress={() => handleFoodPress(food)}
            >
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodServing}>{food.serving}</Text>
              </View>
              <View style={styles.foodNutrition}>
                <Text style={styles.foodCalories}>{food.calories} cal</Text>
                <Text style={styles.foodMacros}>
                  P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addFoodButton}
                onPress={() => handleFoodPress(food)}
              >
                <Ionicons name="add" size={24} color={colors.accent.primary} />
              </TouchableOpacity>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Add Food Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Food</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedFood && (
              <>
                <Text style={styles.modalFoodName}>{selectedFood.name}</Text>
                <Text style={styles.modalServing}>Serving: {selectedFood.serving}</Text>

                <View style={styles.servingsRow}>
                  <Text style={styles.servingsLabel}>Number of servings:</Text>
                  <View style={styles.servingsInput}>
                    <TouchableOpacity
                      style={styles.servingsButton}
                      onPress={() => setServings(s => String(Math.max(0.5, parseFloat(s) - 0.5)))}
                    >
                      <Ionicons name="remove" size={20} color={colors.text.primary} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.servingsValue}
                      value={servings}
                      onChangeText={setServings}
                      keyboardType="decimal-pad"
                    />
                    <TouchableOpacity
                      style={styles.servingsButton}
                      onPress={() => setServings(s => String(parseFloat(s) + 0.5))}
                    >
                      <Ionicons name="add" size={20} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.modalNutrition}>
                  <View style={styles.modalNutritionItem}>
                    <Text style={styles.modalNutritionValue}>
                      {Math.round(selectedFood.calories * (parseFloat(servings) || 1))}
                    </Text>
                    <Text style={styles.modalNutritionLabel}>Calories</Text>
                  </View>
                  <View style={styles.modalNutritionItem}>
                    <Text style={styles.modalNutritionValue}>
                      {Math.round(selectedFood.protein * (parseFloat(servings) || 1) * 10) / 10}g
                    </Text>
                    <Text style={styles.modalNutritionLabel}>Protein</Text>
                  </View>
                  <View style={styles.modalNutritionItem}>
                    <Text style={styles.modalNutritionValue}>
                      {Math.round(selectedFood.carbs * (parseFloat(servings) || 1) * 10) / 10}g
                    </Text>
                    <Text style={styles.modalNutritionLabel}>Carbs</Text>
                  </View>
                  <View style={styles.modalNutritionItem}>
                    <Text style={styles.modalNutritionValue}>
                      {Math.round(selectedFood.fat * (parseFloat(servings) || 1) * 10) / 10}g
                    </Text>
                    <Text style={styles.modalNutritionLabel}>Fat</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.modalAddButton} onPress={handleAddFood}>
                  <Text style={styles.modalAddButtonText}>
                    Add to {MEAL_TYPES.find(m => m.id === selectedMeal)?.label}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  overLimit: {
    color: colors.error.primary,
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  barcodeButton: {
    padding: spacing.sm,
  },
  mealSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  mealChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  mealChipActive: {
    backgroundColor: colors.accent.primary,
  },
  mealChipText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  mealChipTextActive: {
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  loggedFoodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success.muted,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.success.primary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  foodServing: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  foodNutrition: {
    alignItems: 'flex-end',
    marginRight: spacing.md,
  },
  foodCalories: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  foodMacros: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  addFoodButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeFoodButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.error.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  modalFoodName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  modalServing: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  servingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  servingsLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  servingsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
  },
  servingsButton: {
    padding: spacing.md,
  },
  servingsValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    width: 60,
    textAlign: 'center',
  },
  modalNutrition: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  modalNutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  modalNutritionValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  modalNutritionLabel: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  modalAddButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalAddButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
});
