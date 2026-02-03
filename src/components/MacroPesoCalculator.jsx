
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, Info, Scale, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import FoodSearchInput from '@/components/FoodSearchInput';
import ErrorMessage from '@/components/ErrorMessage';
import ComparisonTable from '@/components/ComparisonTable';
import { normalizeSource } from '@/utils/sourceNormalization';
import { foodDatabase } from '@/data/foodDatabase';
import { chickenDatabase } from '@/data/fruitsDatabase';
import { 
  normalizeWeightInput, 
  validateWeight,
  calculateProntoToCru,
  getDominantMacroLabel,
  getVariantData,
  calculateDominantMacro,
  validateFoodIntegrity
} from '@/utils/nutritionUtils';

const MacroPesoCalculator = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [weightInput, setWeightInput] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [previewInfo, setPreviewInfo] = useState(null); 
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const { toast } = useToast();

  // Combine food databases for the calculator
  const allFoodsDatabase = useMemo(() => {
    return [...foodDatabase, ...chickenDatabase];
  }, []);

  useEffect(() => {
    setResult(null);
    setPreviewInfo(null);
    setError('');
    setValidationError(null);

    if (selectedFood) {
      const val = validateFoodIntegrity(selectedFood, 'cooked');
      if (!val.isValid) {
        setValidationError(val.errors);
      }
    }
  }, [selectedFood]);

  useEffect(() => {
    if (!selectedFood || !weightInput || validationError) {
      setPreviewInfo(null);
      return;
    }

    const weight = normalizeWeightInput(weightInput);
    if (!weight) return;

    const variantKey = selectedFood.hasConversion ? 'cooked' : 'raw';
    const variantData = getVariantData(selectedFood, variantKey);
    
    if (!variantData) return;

    const domMacroKey = selectedFood.dominantMacro;
    const macroPer100g = variantData[`${domMacroKey}_100g`];
    const totalDomMacro = calculateDominantMacro(macroPer100g, weight);
    const label = getDominantMacroLabel(domMacroKey);

    setPreviewInfo({
      macroName: label,
      macroValue: totalDomMacro,
      weight: weight
    });

  }, [selectedFood, weightInput, validationError]);

  const handleFoodSelect = (food) => {
    const normalizedFood = food ? { ...food, source: normalizeSource(food.source) } : null;
    setSelectedFood(normalizedFood);
    setSearchTerm(food ? food.name : '');
    setWeightInput('');
  };

  const handleCalculate = async () => {
    setError('');
    
    if (!selectedFood) {
      setError('Por favor, selecione um alimento.');
      return;
    }
    
    if (validationError) {
      setError(`Alimento inválido: ${validationError.join(', ')}`);
      return;
    }

    const weight = normalizeWeightInput(weightInput);
    if (!validateWeight(weight)) {
      setError('Peso inválido. Digite entre 0 e 5000g.');
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      const calculation = calculateProntoToCru(selectedFood, weight);

      if (!calculation) {
        setError('Erro ao calcular. Verifique os dados do alimento.');
        setIsCalculating(false);
        return;
      }

      setResult(calculation);
      setIsCalculating(false);

      toast({
        title: "Cálculo concluído! 🎯",
        description: `Resultado: ${calculation.cruData.weight.toFixed(0)}g no peso cru.`,
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Calculadora MacroPeso</h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
               <Info className="w-3.5 h-3.5 text-green-600" />
               <span>Calculamos o peso cru equivalente mantendo a proteína igual</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Food Selector */}
          <div>
            <FoodSearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              onSelect={handleFoodSelect}
              label="1. Selecione o Alimento"
              placeholder="Digite o nome (ex: Frango, Arroz)..."
              mode="calculator"
              customDatabase={allFoodsDatabase}
            />
            {validationError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">
                  <span className="font-bold">❌ Alimento incompleto:</span> falta {validationError.join(', ')}
                </p>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1.5 ml-1 italic">
              * Alimentos como queijos e processados podem não aparecer aqui. Use o modo Substituição.
            </p>
          </div>

          {/* 2. Weight Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. Digite o Peso PRONTO (g)
            </label>
            <div className="relative">
              <input
                type="number"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="Ex: 200"
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 text-lg"
                autoComplete="off"
                disabled={!!validationError}
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                g
              </span>
            </div>
             <p className="text-xs text-gray-500 mt-1.5 ml-1">
                O peso do alimento já preparado, como você vai comer.
             </p>
            
            {/* Automatic Macro Preview */}
            <div className="min-h-8 mt-2 transition-all duration-300">
              {previewInfo && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-1"
                >
                  <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Contém aprox. <span className="font-bold">{previewInfo.macroValue.toFixed(1)}g</span> de {previewInfo.macroName}
                  </p>
                  
                  {selectedFood && selectedFood.taco_cooked_item && (
                     <p className="text-xs text-gray-500 italic ml-6">
                        Base: TACO — {selectedFood.taco_cooked_item} (por 100g)
                     </p>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* 3. Action Button */}
           <Button
              onClick={handleCalculate}
              disabled={!selectedFood || !weightInput || isCalculating || !!validationError}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
           >
              {isCalculating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  Calcular Peso Cru Equivalente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
           </Button>
          
          {error && <ErrorMessage message={error} />}
        </div>
      </motion.div>

      {/* Results Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col items-center text-center gap-4 shadow-sm relative">
              <h3 className="text-lg font-medium text-blue-900">Resultado da Conversão</h3>
              
              <div className="bg-white px-8 py-4 rounded-xl shadow-sm border border-blue-100 flex flex-col items-center">
                 <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-blue-700">
                      {result.cruData.weight.toFixed(0)}
                    </span>
                    <span className="text-xl text-blue-600 font-medium">g</span>
                 </div>
                 <p className="text-sm text-blue-600 font-bold mt-1 uppercase tracking-wider">
                    Peso Cru Necessário
                 </p>
              </div>
            </div>

            {/* Side by Side Comparison */}
            <ComparisonTable 
              prontoData={result.prontoData}
              cruData={result.cruData}
              foodName={result.foodName}
            />
        </motion.div>
      )}
    </div>
  );
};

export default MacroPesoCalculator;
