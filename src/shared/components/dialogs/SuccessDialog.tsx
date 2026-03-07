'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineCheckCircle } from "react-icons/hi";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function SuccessDialog({
  isOpen,
  onClose,
  title,
  message,
}: SuccessDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const dialogContent = (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .overlay-animate { animation: fadeIn 0.2s ease-out; }
        .dialog-animate { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .icon-animate { animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div onClick={onClose} className="overlay-animate absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="group dialog-animate relative bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full mx-4 p-6 border border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300/20 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
          <div className="flex items-center justify-center mb-4">
            <div className="icon-animate size-15 rounded-2xl bg-emerald-500 dark:bg-emerald-500/10 flex items-center justify-center transition-all duration-300 border-b-1 border-t-1 border-transparent group-hover:scale-110 group-hover:dark:border-b-emerald-500 group-hover:dark:border-t-white/10">
              <HiOutlineCheckCircle className="text-white dark:text-emerald-600 text-3xl" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-center text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </div>
    </>
  );

  return createPortal(dialogContent, document.body);
}
