
import { foodDatabase } from '@/data/foodDatabase';

/**
 * STRICT VALIDATION UTILITIES
 * Enforces comprehensive integrity checks on the food database.
 */

export const validateFoodDatabase = () => {
  const errors = [];
  const invalidItems = [];
  const validItems = [];
  const warnings = [];
  let totalItems = 0;

  foodDatabase.forEach((food) => {
    totalItems++;
    const itemErrors = [];

    // 1. Mandatory Fields (ALL items)
    if (!food.id) itemErrors.push("Missing 'id'");
    if (!food.name) itemErrors.push("Missing 'name'");
    if (!food.category) itemErrors.push("Missing 'category'");
    if (!Array.isArray(food.keywords)) itemErrors.push("'keywords' must be an array");
    if (!food.taco_raw_item || typeof food.taco_raw_item !== 'string') itemErrors.push("Missing or invalid 'taco_raw_item'");
    
    // STRICT SOURCE CHECK
    // Modified 2026-02-01: Allow "rotulo_padrao_nacional" for supplements and "missing_taco" for incomplete items
    const validSources = ["TACO 4ª edição", "rotulo_padrao_nacional", "missing_taco"];
    if (!validSources.includes(food.source)) {
      itemErrors.push(`Invalid source: '${food.source}'. Must be one of: ${validSources.join(", ")}.`);
    }

    if (food.source === "missing_taco") {
      // Validate restrictions for missing_taco items
      if (food.modeRestrictions?.calculator || food.modeRestrictions?.substitution || food.modeRestrictions?.recipe) {
        warnings.push(`Warning: ${food.name} (missing_taco) should be blocked from calculations.`);
      }
      // Skip nutrition validation for missing_taco items
    } else {
      // 2. Conditional Fields (If FTP/Conversion exists)
      if (food.ftp && food.ftp.methods && Object.keys(food.ftp.methods).length > 0) {
        if (!food.taco_cooked_item) itemErrors.push("Missing 'taco_cooked_item' for item with cooking methods");
        
        // Validate Raw Data
        if (!food.variants?.raw) {
          itemErrors.push("Missing 'variants.raw' object");
        } else {
          const raw = food.variants.raw;
          if (raw.protein_100g == null || raw.protein_100g < 0) itemErrors.push("Invalid/Missing raw protein");
          if (raw.carb_100g == null || raw.carb_100g < 0) itemErrors.push("Invalid/Missing raw carb");
          if (raw.fat_100g == null || raw.fat_100g < 0) itemErrors.push("Invalid/Missing raw fat");
          if (raw.kcal_100g == null || raw.kcal_100g < 0) itemErrors.push("Invalid/Missing raw kcal");
        }

        // Validate Cooked Data
        if (!food.variants?.cooked) {
          itemErrors.push("Missing 'variants.cooked' object");
        } else {
          const cooked = food.variants.cooked;
          if (cooked.protein_100g == null || cooked.protein_100g < 0) itemErrors.push("Invalid/Missing cooked protein");
          if (cooked.carb_100g == null || cooked.carb_100g < 0) itemErrors.push("Invalid/Missing cooked carb");
          if (cooked.fat_100g == null || cooked.fat_100g < 0) itemErrors.push("Invalid/Missing cooked fat");
          if (cooked.kcal_100g == null || cooked.kcal_100g < 0) itemErrors.push("Invalid/Missing cooked kcal");
        }
      }
    }

    if (itemErrors.length > 0) {
      invalidItems.push({ id: food.id, name: food.name, errors: itemErrors });
      errors.push(...itemErrors.map(e => `${food.name}: ${e}`));
    } else {
      validItems.push(food);
    }
  });

  return {
    isValid: invalidItems.length === 0,
    validItems,
    invalidItems,
    summary: {
      total: totalItems,
      valid: validItems.length,
      invalid: invalidItems.length
    },
    errors, 
    warnings 
  };
};

export default validateFoodDatabase;
