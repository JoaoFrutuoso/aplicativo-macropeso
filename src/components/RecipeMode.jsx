
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChefHat, Flame, Waves, UtensilsCrossed, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import FoodSearchInput from '@/components/FoodSearchInput';
import ErrorMessage from '@/components/ErrorMessage';
import RecipeResult from '@/components/RecipeResult';
import { calculateRecipe } from '@/utils/calculateRecipe';
import { validateFoodIntegrity } from '@/utils/nutritionUtils';
import { foodDatabase } from '@/data/foodDatabase';
import { chickenDatabase } from '@/data/fruitsDatabase';

const RecipeMode = () => {
  const [foodName, setFoodName] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [weight, setWeight] = useState('');
  const [cookingMethod, setCookingMethod] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableMethods, setAvailableMethods] = useState([]);
  
  const { toast } = useToast();

  const methods = [
    { id: 'cozido', label: 'Cozido', emoji: '🍲', icon: Waves },
    { id: 'grelhado', label: 'Grelhado', emoji: '🔥', icon: Flame },
    { id: 'assado', label: 'Assado', emoji: '🍗', icon: ChefHat },
    { id: 'vapor', label: 'Vapor', emoji: '♨️', icon: Waves },
    { id: 'frito', label: 'Frito', emoji: '🍳', icon: UtensilsCrossed }
  ];

  // Combine food databases for the recipe mode
  const allFoodsDatabase = useMemo(() => {
    return [...foodDatabase, ...chickenDatabase];
  }, []);

  const handleFoodSelect = (food) => {
    if (food) {
        setSelectedFood(food);
        setFoodName(food.name);
        
        const val = validateFoodIntegrity(food, 'cooked');
        if (!val.isValid) {
          setValidationError(val.errors);
        } else {
          setValidationError(null);
        }

        if (food.ftp && food.ftp.methods) {
          const keys = Object.keys(food.ftp.methods);
          setAvailableMethods(keys);
          
          if (cookingMethod && !keys.includes(cookingMethod)) {
            setCookingMethod('');
          }
        } else {
          setAvailableMethods([]);
        }
    } else {
        setSelectedFood(null);
        setFoodName('');
        setAvailableMethods([]);
        setCookingMethod('');
        setValidationError(null);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const calculation = calculateRecipe(foodName, weight, cookingMethod, allFoodsDatabase);

      if (calculation.error) {
        setError(calculation.error);
        toast({
          variant: "destructive",
          title: "Erro no Cálculo",
          description: calculation.error,
        });
      } else {
        setResult(calculation);
        toast({
          title: "Cálculo Realizado! 🍳",
          description: `Necessário ${calculation.rawWeight.toFixed(0)}g cru para obter ${calculation.cookedWeight}g pronto.`,
        });
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setWeight('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-lg shadow-lg shadow-indigo-200">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Modo Receita (FTP)</h2>
            <p className="text-sm text-gray-600">Calcule o peso cru para obter o peso pronto desejado</p>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">1. Selecione o Alimento</label>
            <FoodSearchInput
              value={foodName}
              onChange={setFoodName}
              onSelect={handleFoodSelect}
              placeholder="Ex: Frango Peito, Patinho, Arroz..."
              mode="recipe"
              customDatabase={allFoodsDatabase}
            />
            {validationError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">
                  <span className="font-bold">❌ Dados incompletos:</span> falta {validationError.join(', ')}
                </p>
              </div>
            )}
             <p className="text-xs text-gray-400 mt-1.5 ml-1 italic">
              * Queijos não possuem rendimento de cocção. Use o modo Substituição.
            </p>
          </div>

          <div className="space-y-4">
             <label className="block text-sm font-medium text-gray-700">2. Escolha o Método de Preparo</label>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
               {methods.map((method) => {
                 const isAvailable = availableMethods.includes(method.id);
                 const isSelected = cookingMethod === method.id;

                 return (
                   <button
                     key={method.id}
                     type="button"
                     disabled={!isAvailable}
                     onClick={() => setCookingMethod(method.id)}
                     className={`
                       group flex items-center justify-center px-4 py-3 rounded-full border transition-all duration-200 shadow-sm whitespace-nowrap
                       ${!isAvailable 
                          ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-60' 
                          : isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md transform scale-[1.02]'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md'
                       }
                     `}
                     style={{ gap: '0.5rem', lineHeight: 'normal' }}
                   >
                     <span className="text-xl inline-block transform transition-transform group-hover:scale-110">
                       {method.emoji}
                     </span>
                     <span className="text-sm font-semibold">{method.label}</span>
                   </button>
                 );
               })}
             </div>
             {foodName && !validationError && availableMethods.length === 0 && (
               <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                 ⚠️ Este alimento não possui dados de ficha técnica cadastrados.
               </p>
             )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">3. Informe o Peso Pronto Desejado</label>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 150"
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 font-mono text-lg"
                min="1"
                step="0.1"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">g</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !foodName || !cookingMethod || !weight || !!validationError}
            className="w-full py-6 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Calculando...
              </div>
            ) : (
              <div className="flex items-center">
                <Calculator className="w-6 h-6 mr-2" />
                Calcular Peso Cru
              </div>
            )}
          </Button>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ErrorMessage message={error} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative"
          >
            <RecipeResult result={result} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeMode;
