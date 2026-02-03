
export const searchFoods = (query, database) => {
  if (!query) return [];
  
  // Helper to remove accents and normalize string for search
  // e.g., "Maçã" -> "maca", "Açaí" -> "acai"
  const normalize = (str) => {
    if (!str) return '';
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  const normalizedQuery = normalize(query);
  
  // Safety check: ensure database is an array
  if (!Array.isArray(database)) {
    console.error("searchFoods expected an array for database, got:", typeof database);
    return [];
  }

  // Debug log for development
  // console.log(`Searching for "${normalizedQuery}" in database of size ${database.length}`);

  return database.filter(food => {
    // 1. Check Name
    const foodName = normalize(food.name);
    const nameMatch = foodName.includes(normalizedQuery);
    
    // 2. Check Keywords
    const keywordMatch = food.keywords && food.keywords.some(k => {
        return normalize(k).includes(normalizedQuery);
    });
    
    return nameMatch || keywordMatch;
  });
};
