
import { getFoodSuggestions } from '@/data/foodDatabase';
import { validateFoodIntegrity } from '@/utils/nutritionUtils';

/**
 * Calculates recipe requirements based on FTP factors.
 * Ensures data integrity before calculation.
 */
export const calculateRecipe = (foodName, targetWeight, method) => {
  const weight = parseFloat(targetWeight);
  if (!weight || weight <= 0) {
    return { error: "Peso inválido" };
  }

  const suggestions = getFoodSuggestions(foodName);
  if (!suggestions || suggestions.length === 0) {
    return { error: "Alimento não encontrado" };
  }

  const food = suggestions[0];

  // 1. Validate Integrity
  const validation = validateFoodIntegrity(food, 'cooked');
  if (!validation.isValid) {
    return { error: `Dados incompletos para '${food.name}': falta ${validation.errors.join(', ')}` };
  }

  // 2. Validate Method Existence
  if (!food.ftp || !food.ftp.methods || !food.ftp.methods[method]) {
    return { error: `Método '${method}' não disponível para este alimento.` };
  }

  const methodData = food.ftp.methods[method];
  const { rendimento, indice_coccao } = methodData;

  // 3. Calculation
  // Raw Weight = Cooked Weight / Yield (Rendimento)
  const rawWeight = weight / rendimento;

  return {
    foodName: food.name,
    targetCookedWeight: weight,
    rawWeight: rawWeight,
    cookedWeight: weight, // Same as target
    method: method,
    rendimento: rendimento,
    indice_coccao: indice_coccao,
    // Provide macros for raw weight
    macrosRaw: {
      protein: (food.variants.raw.protein_100g * rawWeight) / 100,
      carb: (food.variants.raw.carb_100g * rawWeight) / 100,
      fat: (food.variants.raw.fat_100g * rawWeight) / 100,
      kcal: (food.variants.raw.kcal_100g * rawWeight) / 100,
    }
  };
};
