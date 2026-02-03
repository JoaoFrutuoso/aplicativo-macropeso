
/**
 * Utility function to remove accents/diacritics from a string and convert to lowercase.
 * Converts characters like 'á', 'é', 'ñ', 'ç' to 'a', 'e', 'n', 'c' and uppercased to lowercased.
 * Example: "Ovó" -> "ovo"
 * 
 * @param {string} str - The string to normalize
 * @returns {string} - The normalized string (lowercase, no accents)
 */
export const removeAccents = (str) => {
  if (!str) return '';
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

export default removeAccents;
