
import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Scale, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecipeResult = ({ result, onReset }) => {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-8 bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Scale className="w-5 h-5" />
          Resultado da Ficha Técnica
        </h3>
        <p className="text-indigo-100 text-sm">Cálculo de rendimento para compra</p>
      </div>

      <div className="p-6">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200 bg-white">
              {/* Food Name */}
              <tr className="bg-gray-50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-gray-400" /> Alimento
                </td>
                <td className="whitespace-normal px-3 py-4 text-sm font-bold text-gray-900 text-right">
                  {result.foodName}
                </td>
              </tr>
              
              {/* Method */}
              <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500">
                  Preparo Selecionado
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-indigo-600 text-right capitalize">
                  {result.preparo}
                </td>
              </tr>

              {/* Cooked Weight */}
              <tr className="bg-gray-50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500">
                  Peso Pronto Desejado
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-900 text-right">
                  {result.cookedWeight.toFixed(0)}g
                </td>
              </tr>

              {/* Yield Data */}
              <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500">
                  Rendimento Médio
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 text-right">
                  {(result.rendimento * 100).toFixed(0)}%
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500">
                  Índice de Cocção
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 text-right">
                  {result.indice_coccao.toFixed(2)}
                </td>
              </tr>

              {/* Result */}
              <tr className="bg-indigo-50 border-t-2 border-indigo-100">
                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-lg font-bold text-indigo-900">
                  Peso Cru Necessário
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-2xl font-bold text-indigo-700 text-right">
                  {result.rawWeight.toFixed(0)}g
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <RotateCcw className="w-4 h-4" />
            Calcular Novamente
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeResult;
