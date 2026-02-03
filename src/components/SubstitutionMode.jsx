
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Calculator, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FoodSearchInput from '@/components/FoodSearchInput';
import { filterSubstitutionsByCategory } from '@/utils/substitutionRules';
import { fruitsDatabase, chickenDatabase } from '@/data/fruitsDatabase';
import { foodDatabase } from '@/data/foodDatabase';

const SubstitutionMode = ({ onCalculate, isLoading }) => {
  const [mode, setMode] = useState('cooked'); // 'cooked' | 'raw'
  const [originalFood, setOriginalFood] = useState('');
  const [originalWeight, setOriginalWeight] = useState('');
  const [substituteFood, setSubstituteFood] = useState('');
  
  // New state to track the full object of the selected original food
  const [selectedOriginalFood, setSelectedOriginalFood] = useState(null);

  // Combine databases for unified search
  const allFoodsDatabase = useMemo(() => {
    return [...foodDatabase, ...fruitsDatabase, ...chickenDatabase];
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({
      originalFoodName: originalFood,
      originalWeight,
      substituteFoodName: substituteFood,
      mode
    });
  };

  const handleOriginalSelect = (food) => {
    setSelectedOriginalFood(food);
  };

  // Filter function for the substitute input
  const filterSubstitutes = (results) => {
    return filterSubstitutionsByCategory(selectedOriginalFood, results);
  };

  const isEggRuleActive = selectedOriginalFood?.category === 'Ovos';
  
  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-full inline-flex shadow-inner">
          <button
            type="button"
            onClick={() => setMode('cooked')}
            className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-150 ease-in-out ${
              mode === 'cooked'
                ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                : 'bg-transparent text-gray-600 border border-transparent hover:text-gray-800'
            }`}
          >
            🍽️ Pronto
          </button>
          <button
            type="button"
            onClick={() => setMode('raw')}
            className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-150 ease-in-out ${
              mode === 'raw'
                ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                : 'bg-transparent text-gray-600 border border-transparent hover:text-gray-800'
            }`}
          >
            🥩 Cru
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original Food Column */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className={`w-2 h-8 rounded-full ${mode === 'cooked' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                Alimento Original
              </h3>
            </div>
            
            <FoodSearchInput
              value={originalFood}
              onChange={setOriginalFood}
              onSelect={handleOriginalSelect}
              label="Buscar Alimento, Fruta ou Frango"
              placeholder="Ex: Peito de Frango, Arroz, Banana..."
              mode="substitution"
              customDatabase={allFoodsDatabase}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso ({mode === 'cooked' ? 'Cozido' : 'Cru'}) em gramas
              </label>
              <input
                type="number"
                value={originalWeight}
                onChange={(e) => setOriginalWeight(e.target.value)}
                placeholder="Ex: 100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 font-mono"
                min="1"
                step="0.1"
                required
              />
            </div>
          </div>

          {/* Substitute Food Column */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-8 rounded-full bg-orange-400"></span>
              Alimento Substituto
            </h3>
            
            <FoodSearchInput
              value={substituteFood}
              onChange={setSubstituteFood}
              label="Nome do Alimento"
              placeholder={isEggRuleActive ? "Ex: Queijo Mussarela" : "Ex: Batata, Pera, Sassami..."}
              mode="substitution"
              filterResults={filterSubstitutes}
              customDatabase={allFoodsDatabase} 
            />
            
            {/* Rule Activation Message */}
            <AnimatePresence>
              {isEggRuleActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>Regra ativa: <strong>Ovos</strong> podem ser substituídos apenas por <strong>Queijos</strong>.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mt-2">
              <p className="text-xs text-orange-800 leading-relaxed">
                O sistema calculará automaticamente a quantidade necessária de <strong>{substituteFood || '...'}</strong> para atingir a mesma quantidade do macronutriente principal.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full py-6 text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-[1.01] ${
            mode === 'cooked' 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          {isLoading ? (
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          ) : (
            <Calculator className="w-6 h-6 mr-2" />
          )}
          Calcular Substituição ({mode === 'cooked' ? 'Pronto' : 'Cru'})
        </Button>
      </form>
    </div>
  );
};

export default SubstitutionMode;
