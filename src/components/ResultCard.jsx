
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const ResultCard = ({ title, highlight, subtitle }) => {
  // Check if highlight contains an arrow or "->" to distinct formatting
  const isConversion = subtitle && subtitle.includes('Equivalente');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-xl p-6 text-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-white opacity-10 rounded-full blur-xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-full">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold tracking-wide">{title}</h3>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-5 border border-white/10">
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-bold tracking-tight text-white mb-2">
              {highlight}
            </div>
            
            {subtitle && (
              <div className="flex items-center gap-2 text-green-100 text-sm font-medium border-t border-white/10 pt-2 mt-1">
                {isConversion && <ArrowRight className="w-4 h-4" />}
                {subtitle}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
