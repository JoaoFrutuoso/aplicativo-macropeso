
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ErrorMessage from '@/components/ErrorMessage';
import SubstitutionMode from '@/components/SubstitutionMode';
import SubstitutionResult from '@/components/SubstitutionResult';
import { calculateSubstitution } from '@/utils/nutritionUtils';

const FoodSubstitution = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async (params) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      const { originalFoodName, originalWeight, substituteFoodName, mode } = params;
      
      const calculation = calculateSubstitution(
        originalFoodName, 
        originalWeight, 
        substituteFoodName, 
        mode
      );

      if (calculation.error) {
        setError(calculation.error);
        toast({
          variant: "destructive",
          title: "Erro na Substituição",
          description: "Dados incompletos ou inválidos detectados.",
        });
      } else {
        setResult(calculation);
        toast({
          title: "Substituição Calculada! ✅",
          description: `Resultado: ${calculation.substitutionWeight.toFixed(0)}g de ${calculation.substituteFood.name}`,
        });
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado ao calcular.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg shadow-lg shadow-green-200">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Substituição Inteligente</h2>
            <p className="text-sm text-gray-600">Equivalência precisa baseada no macro dominante do alimento.</p>
          </div>
        </div>

        <SubstitutionMode onCalculate={handleCalculate} isLoading={isLoading} />

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
            <SubstitutionResult result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodSubstitution;
