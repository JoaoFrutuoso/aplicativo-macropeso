
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import MacroPesoApp from '@/components/MacroPesoApp';
import ScrollToTop from '@/components/ScrollToTop';
import { Toaster } from '@/components/ui/toaster';
import { validateFoodDatabase } from '@/utils/validateFoodDatabase';

const App = () => {
  const [dbValidation, setDbValidation] = useState({ isValid: true, errors: [], summary: { total: 0, valid: 0, invalid: 0 } });
  const [showValidationSuccess, setShowValidationSuccess] = useState(false);

  useEffect(() => {
    const validation = validateFoodDatabase();
    setDbValidation(validation);
    
    if (!validation.isValid) {
      console.error('⛔ FATAL DATABASE ERROR:', validation.errors);
    } else {
      setShowValidationSuccess(true);
      setTimeout(() => setShowValidationSuccess(false), 5000);
    }
  }, []);

  if (!dbValidation.isValid) {
     return (
        <div className="fixed inset-0 z-50 bg-gray-900/95 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 border-l-8 border-red-600 m-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <ShieldAlert className="w-10 h-10 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Violação de Integridade de Dados</h1>
                <p className="text-red-600 font-medium">O sistema foi bloqueado por segurança nutricional.</p>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 max-h-60 overflow-y-auto mb-6">
               <ul className="list-disc pl-5 space-y-1">
                  {dbValidation.errors.map((err, idx) => (
                    <li key={idx} className="text-sm text-red-700 font-mono">{err}</li>
                  ))}
               </ul>
            </div>
          </div>
        </div>
     );
  }

  return (
    <>
      <Helmet>
        <title>MacroPeso Calculator - Calculadora Nutricional Profissional</title>
      </Helmet>

      {showValidationSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right fade-in duration-500">
           <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-bold text-sm">Integridade de Dados Verificada</p>
                <p className="text-xs text-green-700">{dbValidation.summary.total} itens validados.</p>
              </div>
           </div>
        </div>
      )}

      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MacroPesoApp isDbValid={dbValidation.isValid} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
};

export default App;
