
import React, { useState } from 'react';
import { Link, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PaymentAccessLink = ({ email, token }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!email || !token) return null;

  const accessUrl = `${window.location.origin}/access/${token}?email=${encodeURIComponent(email)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(accessUrl);
    setCopied(true);
    toast({
      title: "Link copiado!",
      description: "O link de acesso foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Link className="w-4 h-4" />
        Link de Acesso Direto
      </div>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          readOnly 
          value={accessUrl} 
          className="flex-1 text-xs bg-white border border-gray-300 rounded px-3 py-2 text-gray-600 font-mono focus:outline-none"
        />
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      
      <p className="text-xs text-gray-500">
        Este link é único e contém uma chave criptografada válida por 30 dias.
      </p>
    </div>
  );
};

export default PaymentAccessLink;
