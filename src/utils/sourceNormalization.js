
/**
 * Normalizes the data source string based on specific business rules.
 * 
 * Rules:
 * - If source contains "TACO" (case-insensitive) → "TACO 4ª edição"
 * - If source is unknown/empty/null → "missing_taco"
 * - Otherwise → "rotulo_padrao_nacional"
 * 
 * @param {string} source - The source string to normalize
 * @returns {string} The normalized source string
 */
export const normalizeSource = (source) => {
  if (!source) return "missing_taco";
  
  const lowerSource = String(source).toLowerCase();
  
  if (lowerSource.includes("taco")) {
    return "TACO 4ª edição";
  }
  
  return "rotulo_padrao_nacional";
};
