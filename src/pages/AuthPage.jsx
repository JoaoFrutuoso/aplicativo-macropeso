import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';
import { Calculator } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col justify-center items-center p-4">
      <Helmet>
        <title>{isLogin ? 'Login' : 'Criar Conta'} | MacroPeso</title>
      </Helmet>
      
      <div className="max-w-md w-full">
        {/* Logo Header */}
        <div className="text-center mb-8">
           <div className="flex justify-center mb-3">
             <div className="bg-gradient-to-br from-green-600 to-teal-600 p-3 rounded-xl shadow-lg transform rotate-3">
               <Calculator className="w-8 h-8 text-white" />
             </div>
           </div>
           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">MacroPeso</h1>
           <p className="text-gray-500 font-medium">Sua calculadora nutricional profissional</p>
        </div>

        <motion.div
          layout
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-8">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <LoginForm onToggleMode={toggleMode} />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <RegisterForm onToggleMode={toggleMode} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-center mt-6 text-xs text-gray-400">
          &copy; 2026 MacroPeso App. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;