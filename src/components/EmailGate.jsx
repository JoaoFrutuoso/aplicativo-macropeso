
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const EmailGate = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  // For MVP, accept any valid email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsValidating(true);

    setTimeout(() => {
      if (validateEmail(email)) {
        localStorage.setItem('macropeso_authenticated', 'true');
        localStorage.setItem('macropeso_user_email', email);
        
        toast({
          title: "Acesso liberado! ✅",
          description: "Bem-vindo ao MacroPeso Calculator",
        });
        
        setTimeout(() => {
          onAuthenticated();
        }, 500);
      } else {
        toast({
          variant: "destructive",
          title: "Email inválido ❌",
          description: "Por favor, insira um email válido",
        });
        setIsValidating(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-green-100">
          {/* Logo/Icon */}
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            className="text-3xl font-bold text-center text-gray-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            MacroPeso Calculator
          </motion.h1>
          
          <motion.p 
            className="text-center text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Insira seu email para acessar a plataforma
          </motion.p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                disabled={isValidating}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isValidating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Validando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Acessar Plataforma
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Footer note */}
          <motion.p 
            className="text-center text-xs text-gray-500 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Seus dados estão protegidos e seguros
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailGate;
