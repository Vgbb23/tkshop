import React, { useState, useEffect } from 'react';
import { ChevronLeft, Copy, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createFruitfyPixCharge } from '../services/fruitfy';

interface PixPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  quantity: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
}

export default function PixPayment({ isOpen, onClose, price, quantity, customer }: PixPaymentProps) {
  const [timeLeft, setTimeLeft] = useState(86399); // 24 hours in seconds
  const [copied, setCopied] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [isLoadingCharge, setIsLoadingCharge] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatPrice = (p: number) => {
    return p.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  useEffect(() => {
    if (!isOpen) return;

    const hasMissingData = !customer.name || !customer.email || !customer.phone || !customer.cpf;
    if (hasMissingData) {
      setErrorMessage('Preencha nome, e-mail, telefone e CPF para gerar o PIX.');
      setPixCode('');
      return;
    }

    setErrorMessage(null);
    setIsLoadingCharge(true);
    setPixCode('');

    createFruitfyPixCharge({
      customer,
      valueInCents: Math.round(price * 100),
      quantity,
    })
      .then((result) => {
        setPixCode(result.pixCode);
        setGeneratedAt(new Date());
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Não foi possível gerar a cobrança PIX.';
        setErrorMessage(message);
      })
      .finally(() => {
        setIsLoadingCharge(false);
      });
  }, [isOpen, customer, price, quantity]);

  const handleCopy = () => {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const baseDate = generatedAt || new Date();
  const deadline = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000);
  const formattedDeadline = deadline.toLocaleString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[500] bg-white flex flex-col font-sans w-full h-full overflow-hidden"
      >
        {/* Top Gradient Background */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#FFF0F5] via-[#F0F8FF] to-transparent opacity-60 pointer-events-none" />

        {/* Header */}
        <header className="relative z-10 px-4 py-3 flex items-center justify-between shrink-0">
          <button onClick={onClose} className="p-1">
            <ChevronLeft className="w-6 h-6 text-[#222222]" />
          </button>
          <h1 className="text-[16px] font-bold text-[#222222]">Código do pagamento</h1>
          <div className="w-8" />
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 pt-6">
          {/* Status Section */}
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <h2 className="text-[22px] font-bold text-[#222222] leading-tight">
                Aguardando o pagamento
              </h2>
              <p className="text-[22px] font-bold text-[#222222]">
                R$ {formatPrice(price * quantity)}
              </p>
              
              <div className="flex items-center gap-2 mt-4">
                <span className="text-[13px] text-[#888888]">Vence em</span>
                <div className="bg-[#FF2D55] text-white text-[12px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 fill-white text-[#FF2D55]" />
                  {formatTime(timeLeft)}
                </div>
              </div>
              <p className="text-[12px] text-[#888888] mt-1">
                Prazo {formattedDeadline}
              </p>
            </div>
            
            <div className="w-12 h-12 bg-[#FF9500] rounded-full flex items-center justify-center shadow-sm">
              <Clock className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Pix Card */}
          <div className="bg-white rounded-[12px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] mb-6 border border-gray-50">
            <div className="flex items-center gap-2 mb-8">
              <img src="https://i.ibb.co/Rpv6M6B6/pix.png" className="h-5" alt="Pix" />
              <span className="text-[15px] font-bold text-[#222222]">PIX</span>
            </div>
            
            <div className="text-[18px] font-bold text-[#222222] break-all mb-8 tracking-tight">
              {isLoadingCharge && 'Gerando código PIX...'}
              {!isLoadingCharge && errorMessage && 'Erro ao gerar PIX'}
              {!isLoadingCharge && !errorMessage && (pixCode || 'Código PIX não disponível')}
            </div>

            {errorMessage && (
              <p className="text-[12px] text-[#FF2D55] mb-4">{errorMessage}</p>
            )}

            <button 
              onClick={handleCopy}
              disabled={!pixCode || isLoadingCharge}
              className={`w-full py-3.5 rounded-[6px] flex items-center justify-center gap-2 text-[15px] font-bold transition-all ${!pixCode || isLoadingCharge ? 'bg-gray-300 text-gray-500' : 'bg-[#FF2D55] text-white active:scale-[0.98]'}`}
            >
              <Copy className="w-5 h-5" />
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>

          {/* Instructions */}
          <p className="text-[12px] text-[#222222] leading-tight mb-10">
            Para acessar esta página no app, abra <span className="font-bold">Loja &gt; Pedidos &gt; Sem pagamento &gt; Visualizar o código</span>
          </p>

          <div className="space-y-4">
            <h3 className="text-[18px] font-bold text-[#222222]">Como fazer pagamentos com PIX?</h3>
            <p className="text-[13px] text-[#222222] leading-relaxed">
              Copie o código de pagamento acima, selecione Pix no seu app de internet ou de banco e cole o código.
            </p>
          </div>
        </main>

        {/* Footer */}
        <div className="px-4 py-6 shrink-0">
          <button 
            onClick={onClose}
            className="w-full bg-[#F5F5F5] text-[#222222] py-3 rounded-[4px] text-[15px] font-bold active:scale-[0.98] transition-transform"
          >
            Ver pedido
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
