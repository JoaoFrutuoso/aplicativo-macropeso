
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Flame, Scale, Activity, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import FoodSearchInput from '@/components/FoodSearchInput';
import ResultCard from '@/components/ResultCard';
import ErrorMessage from '@/components/ErrorMessage';
import { calculateCookingWeight, getCookingMethodDescription } from '@/utils/nutritionUtils';

const CookingPrep = () => {
  const [foodName, setFoodName] = useState('');
  const [desiredWeight, setDesiredWeight] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const weight = parseFloat(desiredWeight);

    if (!weight || weight <= 0) {
      setError('Por favor, insira um peso válido');
      return;
    }

    const calculation = calculateCookingWeight(weight, foodName);

    if (calculation.error) {
      setError(calculation.error);
      toast({
        variant: "destructive",
        title: "Erro no Cálculo",
        description: calculation.error,
      });
      return;
    }

    setResult(calculation);

    toast({
      title: "Cálculo Realizado! ✅",
      description: `Use ~${calculation.peso_cru?.toFixed(0)}g de alimento cru`,
    });
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
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ficha Técnica de Preparo</h2>
            <p className="text-sm text-gray-600">Calcule o peso cru necessário com base na tabela TACO</p>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="space-y-6">
          <FoodSearchInput
            value={foodName}
            onChange={setFoodName}
            label="Alimento (Versão Cozida/Pronta)"
            placeholder="Ex: Arroz branco cozido"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso Desejado Pronto (gramas)
            </label>
            <input
              type="number"
              value={desiredWeight}
              onChange={(e) => setDesiredWeight(e.target.value)}
              placeholder="Ex: 200"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              min="1"
              step="1"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <Flame className="w-5 h-5 mr-2" />
            Calcular Peso Cru
          </Button>
        </form>

        {error && <ErrorMessage message={error} />}
      </motion.div>

      {result && (
        <>
          <ResultCard
            title="Resultado do Cálculo"
            highlight={
              <div className="flex flex-col gap-1">
                <span>Peso Cru Necessário:</span>
                <span className="text-4xl font-extrabold">{result.peso_cru?.toFixed(0)}g</span>
              </div>
            }
            subtitle={
              result.isFtpCalculation
                ? `Para obter ${result.inputWeight}g de ${result.foodName}`
                : `Baseado na preservação de ${result.macroName}`
            }
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
          >
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Detalhes da Conversão</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow icon={FileText} label="Alimento" value={result.foodName} />
                <DetailRow 
                  icon={Flame} 
                  label="Método de Preparo" 
                  value={result.method ? result.method.charAt(0).toUpperCase() + result.method.slice(1) : 'Cozido (Padrão)'} 
                />
                <DetailRow icon={Scale} label="Peso Pronto Desejado" value={`${result.inputWeight}g`} />
                
                {result.isFtpCalculation && (
                  <>
                    <DetailRow 
                      icon={Activity} 
                      label="Rendimento (Yield)" 
                      value={`${(result.rendimento * 100).toFixed(0)}% (${result.rendimento})`} 
                    />
                    <DetailRow 
                      icon={Activity} 
                      label="Índice de Cocção" 
                      value={result.indice_coccao?.toFixed(2)} 
                    />
                  </>
                )}
                
                <div className="md:col-span-2 bg-green-50 p-4 rounded-lg mt-2 border border-green-100">
                  <div className="flex items-center justify-between">
                     <span className="font-semibold text-green-900">Peso Cru Necessário</span>
                     <span className="font-bold text-2xl text-green-700">{result.peso_cru?.toFixed(0)}g</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
               <h4 className="text-sm font-semibold text-gray-700 mb-3">Estimativa Nutricional (Cru)</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                 <MacroBadge label="Proteína" value={result.proteina_cru} unit="g" />
                 <MacroBadge label="Carboidrato" value={result.carb_cru} unit="g" />
                 <MacroBadge label="Gordura" value={result.gordura_cru} unit="g" />
                 <MacroBadge label="Calorias" value={result.kcal_cru} unit="kcal" isCalorie />
               </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500 italic">
                {result.isFtpCalculation 
                  ? "Cálculo baseado em Ficha Técnica de Preparo (FTP) padronizada." 
                  : getCookingMethodDescription()}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-gray-500" />
      <span className="text-gray-600 text-sm">{label}</span>
    </div>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

const MacroBadge = ({ label, value, unit, isCalorie }) => (
  <div className={`p-2 rounded text-center ${isCalorie ? 'bg-orange-50 text-orange-800' : 'bg-gray-100 text-gray-700'}`}>
    <div className="text-xs opacity-75">{label}</div>
    <div className="font-bold">
      {value ? value.toFixed(1) : '0.0'}{unit}
    </div>
  </div>
);

export default CookingPrep;
