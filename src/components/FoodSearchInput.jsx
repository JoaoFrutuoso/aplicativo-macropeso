
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Beef, Leaf, Wheat, Utensils, AlertCircle } from 'lucide-react';
import { searchFoods } from '@/utils/searchFoods';
import { foodDatabase } from '@/data/foodDatabase';
import { normalizeSource } from '@/utils/sourceNormalization';

const FoodSearchInput = ({ value, onChange, onSelect, label, placeholder, mode, filterResults, customDatabase }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cheeseMessage, setCheeseMessage] = useState(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debugging: Log when customDatabase changes or is initially passed
  useEffect(() => {
    if (customDatabase) {
      console.log(`FoodSearchInput initialized with customDatabase containing ${customDatabase.length} items.`);
    }
  }, [customDatabase]);

  useEffect(() => {
    if (!value) {
       setSuggestions([]);
       setShowSuggestions(false);
       setCheeseMessage(null);
    }
  }, [value]);

  const processResults = (query) => {
    // CRITICAL: Prefer customDatabase if provided, otherwise fallback to default foodDatabase
    // If customDatabase is passed, we STRICTLY use it.
    const dataToSearch = customDatabase || foodDatabase;
    
    console.log(`Processing search for: "${query}" in DB size: ${dataToSearch.length}`);

    // 1. Get raw search results using enhanced logic
    let results = searchFoods(query, dataToSearch);
      
    // 2. Filter out cheeses/incompatible items if needed (Mode specific logic)
    if (mode === 'calculator' || mode === 'recipe') {
      const hasCheese = results.some(item => item.isCheeseOnly);
      // Explicitly filter out items restricted in current mode
      results = results.filter(item => {
        if (mode === 'calculator' && item.modeRestrictions?.calculator === false) return false;
        if (mode === 'recipe' && item.modeRestrictions?.recipe === false) return false;
        return !item.isCheeseOnly; // Legacy check
      });
      
      if (hasCheese && results.length === 0) {
         if (mode === 'calculator') {
           setCheeseMessage("Este item não possui conversão para cálculo. Use o modo Substituição.");
         } else if (mode === 'recipe') {
           setCheeseMessage("Este item não possui rendimento culinário. Use o modo Substituição.");
         }
      }
    } else if (mode === 'substitution') {
        // Filter for valid substitution items
        results = results.filter(item => item.modeRestrictions?.substitution !== false);
    }

    // 3. Apply external filters (e.g., Substitution Rules)
    if (filterResults) {
      results = filterResults(results);
    }
    
    console.log(`Found ${results.length} results.`);
    return results;
  };

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    onChange(newVal);
    setCheeseMessage(null);
    
    if (newVal.length >= 2) {
      const results = processResults(newVal);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectSuggestion = (foodObject) => {
    const normalizedFood = { ...foodObject, source: normalizeSource(foodObject.source) };
    console.log("Selected food:", normalizedFood.name);
    onChange(normalizedFood.name); 
    if (onSelect) onSelect(normalizedFood);
    setShowSuggestions(false);
    setCheeseMessage(null);
  };

  const clearInput = () => {
    onChange('');
    if (onSelect) onSelect(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setCheeseMessage(null);
    inputRef.current?.focus();
  };

  const getCategoryIcon = (category) => {
    if (!category) return <Utensils className="w-3 h-3" />;
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('fruta')) return <Leaf className="w-3 h-3 text-orange-500" />;
    if (lowerCat.includes('carne') || lowerCat.includes('frango') || lowerCat.includes('suíno') || lowerCat.includes('peixe') || lowerCat.includes('fruto do mar')) return <Beef className="w-3 h-3" />;
    if (lowerCat.includes('legum') || lowerCat.includes('vegetal') || lowerCat.includes('oleaginosa')) return <Leaf className="w-3 h-3" />;
    if (lowerCat.includes('cereal') || lowerCat.includes('grao') || lowerCat.includes('pão') || lowerCat.includes('massa')) return <Wheat className="w-3 h-3" />;
    return <Utensils className="w-3 h-3" />;
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (value && value.length >= 2) {
               const results = processResults(value);
               setSuggestions(results);
               setShowSuggestions(results.length > 0);
            }
          }}
          placeholder={placeholder || "Buscar alimento..."}
          className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {cheeseMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-amber-600 flex items-center gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-100"
        >
          <AlertCircle className="w-4 h-4" />
          {cheeseMessage}
        </motion.div>
      )}

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0 group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium group-hover:text-green-700 transition-colors">
                    {suggestion.name}
                  </span>
                  {suggestion.hasConversion && (
                    <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                      TACO
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-gray-400">
                    {getCategoryIcon(suggestion.category)}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                     {suggestion.category || suggestion.type}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodSearchInput;
