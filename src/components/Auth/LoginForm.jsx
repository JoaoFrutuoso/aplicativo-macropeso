
import React, { useState } from 'react';
import { LogIn, Loader2, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { validateEmail, getFriendlyErrorMessage } from '@/utils/authValidation';

const LoginForm = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { signIn } = useAuth();

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
      await signIn(email);
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
        <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-6 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Verifique seu e-mail</h3>
        <p className="text-gray-600 mb-6 max-w-xs mx-auto">
          Enviamos um link de acesso mágico para <span className="font-semibold text-gray-900">{email}</span>.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Clique no link recebido para entrar automaticamente.
        </p>
        <Button 
          variant="outline"
          onClick={() => setIsEmailSent(false)}
          className="text-gray-600"
        >
          Tentar outro e-mail
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
          <LogIn className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Bem-vindo de volta!</h2>
        <p className="text-sm text-gray-500 mt-1">Digite seu e-mail para receber um link de acesso.</p>
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando Link...
            </>
          ) : (
            'Enviar Link de Acesso'
          )}
        </Button>

        <div className="text-center mt-4 pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">Não tem conta? </span>
          <button
            type="button"
            onClick={onToggleMode}
            className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline"
            disabled={isLoading}
          >
            Cadastre-se
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
