
import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const MacroDisplay = ({ title, protein, carbs, fat, calories, variant = 'green' }) => {
  const total = protein + carbs + fat;
  const proteinPercentage = (protein / total) * 100;
  const carbsPercentage = (carbs / total) * 100;
  const fatPercentage = (fat / total) * 100;

  const variantStyles = {
    green: {
      border: 'border-green-100',
      gradient: 'from-green-500 to-emerald-600'
    },
    blue: {
      border: 'border-blue-100',
      gradient: 'from-blue-500 to-cyan-600'
    }
  };

  const style = variantStyles[variant] || variantStyles.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 border ${style.border}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`bg-gradient-to-br ${style.gradient} p-2 rounded-lg`}>
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>

      {/* Macros Bars */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Proteína</span>
            <span className="text-sm font-bold text-blue-600">{protein.toFixed(1)}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${proteinPercentage}%` }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Carboidrato</span>
            <span className="text-sm font-bold text-orange-600">{carbs.toFixed(1)}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${carbsPercentage}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Gordura</span>
            <span className="text-sm font-bold text-yellow-600">{fat.toFixed(1)}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fatPercentage}%` }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Calories */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Calorias Totais</span>
          <span className="text-xl font-bold text-green-600">{calories} kcal</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MacroDisplay;
