
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator } from 'lucide-react';
import MacroPesoCalculator from '@/components/MacroPesoCalculator';
import FoodSubstitution from '@/components/FoodSubstitution';
import RecipeMode from '@/components/RecipeMode';

const MacroPesoApp = ({ isDbValid = true }) => {
  const [activeTab, setActiveTab] = useState('macropeso');

  const tabs = [
    { id: 'macropeso', label: 'Calculadora', emoji: '⚖️' },
    { id: 'substituicao', label: 'Substituição', emoji: '🔁' },
    { id: 'receita', label: 'Modo Receita', emoji: '🍳' }
  ];

  const renderContent = () => {
    if (!isDbValid) return null;

    switch(activeTab) {
      case 'macropeso':
        return <MacroPesoCalculator />;
      case 'substituicao':
        return <FoodSubstitution />;
      case 'receita':
        return <RecipeMode />;
      default:
        return <MacroPesoCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">MacroPeso</h1>
                <p className="text-xs text-gray-500">Calculadora Nutricional</p>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1606858274001-dd10efc5ce7d" 
          alt="Nutrition Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-emerald-900/80 flex items-center justify-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Cálculos Nutricionais Precisos
          </motion.h2>
        </div>
      </div>

      {/* Tab Navigation - Touch Friendly */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-gray-50/95 backdrop-blur rounded-2xl shadow-xl p-3 grid grid-cols-3 w-full gap-3 border border-gray-100">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col items-center justify-center gap-2
                  px-2 py-3 min-h-[48px] rounded-xl text-sm font-semibold whitespace-normal text-center
                  transition-all duration-200 cursor-pointer select-none
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transform scale-[1.02]' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }
                `}
              >
                <span className="text-xl leading-none" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>
                  {tab.emoji}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-green-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Valores baseados na Tabela Brasileira de Composição de Alimentos (TACO).
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            © 2026 MacroPeso Calculator - Todos os direitos reservados
          </p>
          <p className="text-center text-xs text-gray-400 mt-4">
            📱 Otimizado para celular. Adicione à tela inicial para usar como aplicativo.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MacroPesoApp;
