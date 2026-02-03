
import React, { useState } from 'react';
import { UserPlus, Loader2, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { validateEmail, getFriendlyErrorMessage } from '@/utils/authValidation';

const RegisterForm = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);

    // Validation
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setFormError(emailVal.message);
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email);
      setIsEmailSent(true);
    } catch (error) {
      setFormError(getFriendlyErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="w-full text-center py-6">
        <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-6 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Confirme seu cadastro</h3>
        <p className="text-gray-600 mb-6 max-w-xs mx-auto">
          Enviamos um link de confirmação para <span className="font-semibold text-gray-900">{email}</span>.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Clique no link recebido para ativar sua conta e entrar.
        </p>
        <Button 
          variant="outline"
          onClick={() => setIsEmailSent(false)}
          className="text-gray-600"
        >
          Corrigir e-mail
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
          <UserPlus className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Crie sua conta</h2>
        <p className="text-sm text-gray-500 mt-1">Comece a usar o MacroPeso hoje.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {formError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            'Criar Conta sem Senha'
          )}
        </Button>

        <div className="text-center mt-4 pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">Já tem uma conta? </span>
          <button
            type="button"
            onClick={onToggleMode}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            disabled={isLoading}
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
