
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Droplet, Wheat, Beef, RefreshCw } from 'lucide-react';

const MacroItem = ({ icon: Icon, label, value, unit = 'g', isDominant }) => (
  <div className={`flex items-center justify-between p-2 rounded ${isDominant ? 'bg-green-50 border border-green-200' : ''}`}>
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${isDominant ? 'text-green-600' : 'text-gray-400'}`} />
      <span className={`text-sm ${isDominant ? 'font-bold text-green-800' : 'text-gray-600'}`}>{label}</span>
    </div>
    <div className="flex items-center gap-1">
      <span className={`text-sm font-mono ${isDominant ? 'font-bold text-green-900' : 'text-gray-900'}`}>
        {value.toFixed(1)}
      </span>
      <span className="text-xs text-gray-500">{unit}</span>
      {isDominant && <Check className="w-3 h-3 text-green-600 ml-1" />}
    </div>
  </div>
);

const ResultCard = ({ title, weight, foodName, macros, dominantKey, colorClass }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-xl shadow-lg border-t-4 overflow-hidden ${colorClass}`}
    >
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{title}</h4>
        <h3 className="text-lg font-bold text-gray-900 leading-tight">{foodName}</h3>
        <div className="mt-2 inline-block px-3 py-1 bg-gray-900 text-white text-sm font-bold rounded-lg shadow-sm">
          {parseFloat(weight).toFixed(0)}g
        </div>
      </div>
      
      <div className="p-4 space-y-1">
        <MacroItem 
          icon={Beef} 
          label="Proteína" 
          value={macros.protein} 
          isDominant={dominantKey === 'protein'} 
        />
        <MacroItem 
          icon={Wheat} 
          label="Carboidrato" 
          value={macros.carb} 
          isDominant={dominantKey === 'carb'} 
        />
        <MacroItem 
          icon={Droplet} 
          label="Gordura" 
          value={macros.fat} 
          isDominant={dominantKey === 'fat'} 
        />
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Energia</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{macros.kcal.toFixed(0)} <span className="text-xs font-normal text-gray-500">kcal</span></span>
        </div>
      </div>
    </motion.div>
  );
};

const SubstitutionResult = ({ result }) => {
  if (!result) return null;

  const { originalFood, substituteFood, substitutionWeight, dominantMacro, mode } = result;

  return (
    <div className="space-y-6 mt-8">
      <div className="grid md:grid-cols-2 gap-6 relative">
        {/* Connection Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg border border-gray-100">
          <div className="bg-gray-100 rounded-full p-2">
            <RefreshCw className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        <ResultCard
          title="Alimento Original"
          foodName={originalFood.name}
          weight={result.originalWeight}
          macros={originalFood}
          dominantKey={dominantMacro.key}
          colorClass="border-blue-500"
        />

        <ResultCard
          title="Substituto Calculado"
          foodName={substituteFood.name}
          weight={substitutionWeight}
          macros={substituteFood}
          dominantKey={dominantMacro.key}
          colorClass="border-green-500"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
      >
        <p className="text-green-800 font-medium flex items-center justify-center gap-2">
          <Check className="w-5 h-5" />
          Macro dominante alinhado: <span className="font-bold">{dominantMacro.valueSubstitute.toFixed(1)}g de {dominantMacro.label}</span>
        </p>
        <p className="text-xs text-green-600 mt-1">
          Cálculo realizado considerando ambos os alimentos no estado <strong>{mode === 'cooked' ? 'PRONTO PARA CONSUMO' : 'CRU'}</strong>.
        </p>
      </motion.div>
    </div>
  );
};

export default SubstitutionResult;
