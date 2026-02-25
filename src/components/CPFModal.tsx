import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CPFModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cpf: string) => void;
}

export default function CPFModal({ isOpen, onClose, onSave }: CPFModalProps) {
  const [cpf, setCpf] = useState('');

  const isValidCPF = (rawCpf: string) => {
    const digits = rawCpf.replace(/\D/g, '');
    if (digits.length !== 11) return false;

    // Reject CPFs with all digits equal (ex: 00000000000).
    if (/^(\d)\1{10}$/.test(digits)) return false;

    const numbers = digits.split('').map(Number);

    const calculateDigit = (sliceLength: number) => {
      const sum = numbers
        .slice(0, sliceLength)
        .reduce((acc, num, index) => acc + num * (sliceLength + 1 - index), 0);
      const rest = (sum * 10) % 11;
      return rest === 10 ? 0 : rest;
    };

    const firstDigit = calculateDigit(9);
    const secondDigit = calculateDigit(10);

    return firstDigit === numbers[9] && secondDigit === numbers[10];
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setCpf(value);
    }
  };

  const handleConfirm = () => {
    if (isValid) {
      onSave(cpf);
      onClose();
    }
  };

  if (!isOpen) return null;

  const isComplete = cpf.length === 11;
  const isValid = isComplete && isValidCPF(cpf);
  const showInvalidMessage = isComplete && !isValid;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[400] flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full bg-white rounded-t-[12px] px-4 pt-4 pb-10 z-[410]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-6" /> {/* Spacer */}
            <h2 className="text-[16px] font-bold text-[#222222]">Adicionar CPF</h2>
            <button onClick={onClose} className="p-1">
              <X className="w-6 h-6 text-[#222222]" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4">
            <p className="text-[12px] text-[#888888] uppercase font-medium">
              O CPF será usado para emitir faturas
            </p>
            
            <div className="bg-[#F5F5F5] rounded-[4px] px-4 py-3.5">
              <input
                type="text"
                placeholder="Insira o número de CPF de 11 dígitos"
                value={formatCpf(cpf)}
                onChange={handleCpfChange}
                maxLength={14}
                className="w-full bg-transparent text-[14px] text-[#222222] placeholder:text-[#CCCCCC] outline-none"
              />
            </div>
            {showInvalidMessage && (
              <p className="text-[12px] text-[#FF2D55]">CPF inválido. Confira os números e tente novamente.</p>
            )}

            <button
              disabled={!isValid}
              onClick={handleConfirm}
              className={`w-full bg-[#FF2D55] text-white py-3.5 rounded-full text-[15px] font-bold mt-4 transition-opacity ${!isValid ? 'opacity-50' : 'opacity-100'}`}
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
