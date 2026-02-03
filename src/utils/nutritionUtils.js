
import { getFoodSuggestions } from '@/data/foodDatabase';

// Standardized calculation formulas

export const calculateCaloriesFromMacros = (protein, carb, fat) => {
  const kcal = (protein * 4) + (carb * 4) + (fat * 9);
  return Math.round(kcal * 10) / 10;
};

// Helper to access variant safely
export const getVariantData = (food, mode) => {
  if (!food || !food.variants) return null;
  // Handle cheeses: always return raw data regardless of mode
  if (food.isCheeseOnly) {
    return food.variants.raw;
  }
  // mode is 'cooked' or 'raw'
  return food.variants[mode];
};

export const recalculateMacros = (weight, variantData) => {
  if (!weight || !variantData) return { protein: 0, carb: 0, fat: 0, kcal: 0 };
  
  const protein = (variantData.protein_100g * weight) / 100;
  const carb = (variantData.carb_100g * weight) / 100;
  const fat = (variantData.fat_100g * weight) / 100;
  
  // Always recalculate calories from macros (4-4-9 rule)
  const kcal = calculateCaloriesFromMacros(protein, carb, fat);
  
  return {
    protein,
    carb,
    fat,
    kcal
  };
};

// Helper to find dominant macro dynamically
const findDominantMacro = (variantData) => {
  const { protein_100g, carb_100g, fat_100g } = variantData;
  const max = Math.max(protein_100g, carb_100g, fat_100g);
  
  if (max === protein_100g) return { key: 'protein', label: 'Proteína', value: protein_100g };
  if (max === carb_100g) return { key: 'carb', label: 'Carboidrato', value: carb_100g };
  return { key: 'fat', label: 'Gordura', value: fat_100g };
};

// --- VALIDATION HELPER ---
export const validateFoodIntegrity = (food, mode = 'raw') => {
  if (!food) return { isValid: false, errors: ['Alimento não definido'] };
  
  const errors = [];
  
  // Basic Metadata
  if (!food.taco_raw_item) errors.push('taco_raw_item');
  if (food.source !== "TACO 4ª edição") errors.push('source (deve ser TACO 4ª edição)');
  
  // Raw Data (Always required)
  const raw = food.variants?.raw;
  if (!raw) {
    errors.push('dados nutricionais crus (variants.raw)');
  } else {
    if (raw.protein_100g == null) errors.push('proteína (cru)');
    if (raw.carb_100g == null) errors.push('carboidrato (cru)');
    if (raw.fat_100g == null) errors.push('gordura (cru)');
    if (raw.kcal_100g == null) errors.push('calorias (cru)');
  }

  // Cooked Data (If mode is cooked/pronto)
  if (mode === 'cooked' || mode === 'pronto') {
    // Skip cooked validation for cheese only items as they use raw data
    if (!food.isCheeseOnly) {
      if (!food.taco_cooked_item) errors.push('taco_cooked_item');
      const cooked = food.variants?.cooked;
      if (!cooked) {
        errors.push('dados nutricionais cozidos (variants.cooked)');
      } else {
        if (cooked.protein_100g == null) errors.push('proteína (cozido)');
        if (cooked.carb_100g == null) errors.push('carboidrato (cozido)');
        if (cooked.fat_100g == null) errors.push('gordura (cozido)');
        if (cooked.kcal_100g == null) errors.push('calorias (cozido)');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// --- NEW EXPORTS ---

export const normalizeWeightInput = (input) => {
  if (!input) return 0;
  const str = input.toString().replace(',', '.');
  const val = parseFloat(str);
  return isNaN(val) ? 0 : val;
};

export const validateWeight = (weight) => {
  return typeof weight === 'number' && weight > 0 && weight <= 5000;
};

export const calculateDominantMacro = (macroPer100g, weight) => {
  return (macroPer100g * weight) / 100;
};

export const getCookingMethodDescription = () => {
  return "O cálculo considera que a quantidade do macronutriente principal (ex: proteína no frango, carboidrato no arroz) se mantém constante durante o cozimento, alterando apenas a água.";
};

export const calculateProntoToCru = (food, weightPronto) => {
  if (!food || !weightPronto) return null;
  
  // Validation Check
  const validation = validateFoodIntegrity(food, 'cooked');
  if (!validation.isValid) {
    // Return explicit error object if possible, but existing consumers might expect null
    console.error(`Validation failed for ${food.name}:`, validation.errors);
    return null;
  }

  const cookedVariant = getVariantData(food, 'cooked');
  const rawVariant = getVariantData(food, 'raw');

  if (!cookedVariant || !rawVariant) return null;

  const domMacro = findDominantMacro(cookedVariant);
  const totalMacroGrams = calculateDominantMacro(domMacro.value, weightPronto);
  
  const rawMacroValue = rawVariant[`${domMacro.key}_100g`];
  if (!rawMacroValue || rawMacroValue <= 0) return null;

  const weightCru = (totalMacroGrams / rawMacroValue) * 100;

  const prontoMacros = recalculateMacros(weightPronto, cookedVariant);
  const cruMacros = recalculateMacros(weightCru, rawVariant);

  return {
    foodName: food.name,
    prontoData: {
      weight: weightPronto,
      ...prontoMacros
    },
    cruData: {
      weight: weightCru,
      ...cruMacros
    },
    dominantMacro: domMacro
  };
};

export const calculateCookingWeight = (desiredWeight, foodName) => {
  const suggestions = getFoodSuggestions(foodName);
  if (!suggestions || suggestions.length === 0) {
    return { error: "Alimento não encontrado" };
  }
  
  const food = suggestions[0];
  
  // Validation Check
  const validation = validateFoodIntegrity(food, 'cooked');
  if (!validation.isValid) {
    return { error: `Dados incompletos para este alimento: ${validation.errors.join(', ')}` };
  }
  
  const defaultMethod = 'cozido';
  let ftpResult = null;
  
  if (food.ftp && food.ftp.methods && food.ftp.methods[defaultMethod]) {
    const { rendimento, indice_coccao } = food.ftp.methods[defaultMethod];
    
    const peso_cru = desiredWeight / rendimento;
    
    const rawVariant = getVariantData(food, 'raw');
    const cruMacros = rawVariant ? recalculateMacros(peso_cru, rawVariant) : {};

    ftpResult = {
      peso_cru: peso_cru,
      macroName: food.dominantMacro === 'protein' ? 'Proteína' : food.dominantMacro === 'carb' ? 'Carboidrato' : 'Gordura',
      foodNameCru: `${food.name} (Cru)`,
      foodName: food.name,
      method: defaultMethod,
      rendimento: rendimento,
      indice_coccao: indice_coccao,
      proteina_cru: cruMacros.protein || 0,
      carb_cru: cruMacros.carb || 0,
      gordura_cru: cruMacros.fat || 0,
      kcal_cru: cruMacros.kcal || 0,
      inputWeight: desiredWeight,
      isFtpCalculation: true
    };
    
    return ftpResult;
  }

  const result = calculateProntoToCru(food, desiredWeight);
  
  if (!result) {
     return { error: "Dados insuficientes para conversão (precisa de dados crus e cozidos ou FTP)" };
  }

  return {
    peso_cru: result.cruData.weight,
    macroName: result.dominantMacro.label,
    foodNameCru: `${food.name} (Cru)`,
    foodName: `${food.name} (Cozido)`,
    macroDom_total: calculateDominantMacro(result.dominantMacro.value, desiredWeight),
    proteina_cru: result.cruData.protein,
    carb_cru: result.cruData.carb,
    gordura_cru: result.cruData.fat,
    kcal_cru: result.cruData.kcal,
    inputWeight: desiredWeight,
    isFtpCalculation: false
  };
};

// -------------------------------------

export const calculateSubstitution = (originalFoodName, originalWeight, substituteFoodName, mode = 'cooked') => {
  const weight = parseFloat(originalWeight);
  if (!weight || weight <= 0) return { error: 'Peso inválido' };

  // 1. Fetch Foods
  const originalSuggestions = getFoodSuggestions(originalFoodName);
  const substituteSuggestions = getFoodSuggestions(substituteFoodName);

  if (!originalSuggestions?.length) return { error: `Alimento original '${originalFoodName}' não encontrado.` };
  if (!substituteSuggestions?.length) return { error: `Alimento substituto '${substituteFoodName}' não encontrado.` };

  const originalFood = originalSuggestions[0];
  const substituteFood = substituteSuggestions[0];

  // 2. Data Integrity Validation
  const valOriginal = validateFoodIntegrity(originalFood, mode);
  if (!valOriginal.isValid) return { error: `Alimento Original incompleto: falta ${valOriginal.errors.join(', ')}` };

  const valSub = validateFoodIntegrity(substituteFood, mode);
  if (!valSub.isValid) return { error: `Alimento Substituto incompleto: falta ${valSub.errors.join(', ')}` };

  // 3. Get Variants
  const originalVariant = getVariantData(originalFood, mode);
  const substituteVariant = getVariantData(substituteFood, mode);

  if (!originalVariant) return { error: `Dados para '${originalFood.name}' no modo '${mode}' não disponíveis.` };
  if (!substituteVariant) return { error: `Dados para '${substituteFood.name}' no modo '${mode}' não disponíveis.` };

  const domMacro = findDominantMacro(originalVariant); 
  
  const originalMacroTotalGrams = weight * (domMacro.value / 100);

  const substituteMacroValuePer100 = substituteVariant[`${domMacro.key}_100g`];

  if (substituteMacroValuePer100 <= 0) {
    return { error: `O substituto '${substituteFood.name}' não possui ${domMacro.label} suficiente para realizar esta substituição.` };
  }

  const substitutionWeight = originalMacroTotalGrams / (substituteMacroValuePer100 / 100);

  const originalMacros = recalculateMacros(weight, originalVariant);
  const substituteMacros = recalculateMacros(substitutionWeight, substituteVariant);

  return {
    mode,
    originalFood: {
      name: originalFood.name,
      ...originalMacros
    },
    substituteFood: {
      name: substituteFood.name,
      ...substituteMacros
    },
    originalWeight: weight,
    substitutionWeight: substitutionWeight,
    dominantMacro: {
      key: domMacro.key,
      label: domMacro.label,
      valueOriginal: originalMacroTotalGrams,
      valueSubstitute: substituteMacros[domMacro.key]
    }
  };
};

export const getDominantMacroLabel = (key) => {
  const map = {
    protein: "Proteína",
    carb: "Carboidrato",
    fat: "Gordura"
  };
  return map[key] || key;
};

export { getFoodSuggestions };
