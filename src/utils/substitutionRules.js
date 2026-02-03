
/**
 * Utility rules for food substitution logic.
 * Enforces nutritional or category-based constraints for substitutions.
 */

export const filterSubstitutionsByCategory = (selectedFood, substitutionResults) => {
  if (!selectedFood || !substitutionResults) return substitutionResults;

  const foodName = selectedFood.name.toLowerCase();

  // RULE 1: Whole Egg -> Cheese ONLY
  // Specifically target "Ovo de Galinha (Inteiro)" and its variants if needed.
  if (selectedFood.category === 'Ovos' && (foodName.includes('inteiro') || foodName === 'ovo de galinha')) {
    console.log("Regra de substituição ativada: Ovo inteiro pode ser substituído apenas por Queijos");
    return substitutionResults.filter(item => item.category === 'Queijos');
  }

  // RULE 2: Egg Whites -> High Protein Foods
  if (selectedFood.category === 'Ovos' && (foodName.includes('clara'))) {
    console.log("Regra de substituição ativada: Claras podem ser substituídas apenas por fontes de proteína");
    // Filter for items where protein is the dominant macro OR category implies protein (Carnes, Frango, Peixes, Queijos)
    return substitutionResults.filter(item => 
      item.dominantMacro === 'protein' || 
      ['Carnes', 'Frango', 'Peixes', 'Suínos', 'Queijos', 'Ovos', 'Frutos do mar'].includes(item.category)
    );
  }

  // General Category Filter fallback (optional, if you want stricter rules generally)
  // For now, only applying the specific Requested Rules.

  return substitutionResults;
};
