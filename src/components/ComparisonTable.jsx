
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Beef, Wheat, Droplet, Info } from 'lucide-react';

const ComparisonTable = ({ prontoData, cruData, foodName }) => {
  const dominantMacroKey = prontoData.dominantMacro;

  const macros = [
    { key: 'protein', label: 'Proteína', icon: Beef, color: 'text-rose-500', bg: 'bg-rose-100' },
    { key: 'carb', label: 'Carboidrato', icon: Wheat, color: 'text-amber-500', bg: 'bg-amber-100' },
    { key: 'fat', label: 'Gordura', icon: Droplet, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { key: 'kcal', label: 'Calorias', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100' }
  ];

  const formatValue = (val) => (val ? parseFloat(val).toFixed(2) : '0.00');

  const MacroRow = ({ label, value, unit, isDominant, icon: Icon, iconColor, iconBg, isKcal }) => (
    <div className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-0 ${isDominant ? 'bg-green-50/80 -mx-4 px-4 rounded-lg my-1' : 'px-1'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg shadow-sm ${iconBg} ${iconColor}`}>
           <Icon className="w-4 h-4" />
        </div>
        <span className={`text-sm ${isDominant ? 'font-bold text-gray-800' : 'font-medium text-gray-600'}`}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-base ${isDominant ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
          {value}<span className="text-xs font-normal text-gray-500 ml-0.5">{unit}</span>
        </span>
        {isDominant && (
          <div className="bg-green-100 text-green-600 rounded-full p-1 shadow-sm border border-green-200" title="Macro Mantido">
            <Check className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );

  const ComparisonCard = ({ title, weight, data, type }) => {
    const isPronto = type === 'pronto';
    
    return (
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: isPronto ? 0 : 0.1 }}
        className={`relative overflow-hidden rounded-xl border shadow-lg transition-all duration-300
          ${isPronto 
            ? 'bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200' 
            : 'bg-gradient-to-br from-white via-green-50 to-emerald-50 border-green-200'
          }`}
      >
        {/* Card Header */}
        <div className={`px-6 py-5 border-b backdrop-blur-sm ${isPronto ? 'border-slate-200 bg-slate-50/50' : 'border-green-200 bg-green-50/50'}`}>
          <h3 className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${isPronto ? 'text-slate-500' : 'text-green-600'}`}>
            {title}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span className={`text-3xl font-bold tracking-tight ${isPronto ? 'text-slate-800' : 'text-green-800'}`}>
              {weight}
            </span>
            <span className={`text-sm font-medium truncate ${isPronto ? 'text-slate-500' : 'text-green-600'}`}>
              de {foodName}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 bg-white/60 backdrop-blur-sm">
          <div className="space-y-1">
            {macros.map((macro) => (
              <MacroRow
                key={macro.key}
                label={macro.label}
                value={formatValue(data[macro.key])}
                unit={macro.key === 'kcal' ? 'kcal' : 'g'}
                isDominant={macro.key === dominantMacroKey}
                icon={macro.icon}
                iconColor={macro.color}
                iconBg={macro.bg}
                isKcal={macro.key === 'kcal'}
              />
            ))}
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-2xl opacity-50 pointer-events-none 
          ${isPronto ? 'bg-slate-200' : 'bg-green-200'}`} 
        />
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <ComparisonCard 
          title="PESO PRONTO (ENTRADA)" 
          weight={`${prontoData.weight.toFixed(0)}g`}
          data={prontoData} 
          type="pronto" 
        />
        <ComparisonCard 
          title="PESO CRU (EQUIVALENTE)" 
          weight={`${cruData.weight.toFixed(0)}g`}
          data={cruData} 
          type="cru" 
        />
      </div>
      
      <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <p>
          O macronutriente dominante ({prontoData.dominantMacro}) mantém-se igual em ambas as colunas. 
          As calorias totais podem apresentar leve variação devido a mudanças naturais na concentração de gordura/carboidrato durante o cozimento (Base TACO).
        </p>
      </div>
    </div>
  );
};

export default ComparisonTable;
