"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
// Importamos los iconos necesarios
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineXCircle,
} from "react-icons/hi";
import { BaseDialog } from "./BaseDialog";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: "success" | "warning" | "error";
  message: string;
}

export function SuccessDialog({
  isOpen,
  onClose,
  title,
  type = "success", // Ahora usamos esta prop
  message,
}: SuccessDialogProps) {
  const [mounted, setMounted] = useState(false);

  // 1. Configuración de variantes
  const variants = {
    success: {
      Icon: HiOutlineCheckCircle,
      colorClass: "bg-emerald-500 dark:bg-emerald-500/10",
      iconColor: "text-white dark:text-emerald-500",
      borderHover: "group-hover:dark:border-b-emerald-500",
    },
    warning: {
      Icon: HiOutlineExclamationCircle,
      colorClass: "bg-amber-500 dark:bg-amber-500/10",
      iconColor: "text-white dark:text-amber-500",
      borderHover: "group-hover:dark:border-b-amber-500",
    },
    error: {
      Icon: HiOutlineXCircle,
      colorClass: "bg-rose-500 dark:bg-rose-500/10",
      iconColor: "text-white dark:text-rose-500",
      borderHover: "group-hover:dark:border-b-rose-500",
    },
  };

  // Seleccionamos la variante actual basada en el prop 'type'
  const currentVariant = variants[type] || variants.success;
  const { Icon } = currentVariant;

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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        .overlay-animate {
          animation: fadeIn 0.2s ease-out;
        }
        .icon-animate {
          animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>

      <div className="fixed inset-0 z-[70] flex items-center justify-center">
        <div
          onClick={onClose}
          className="overlay-animate absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <BaseDialog className="group max-w-md">
          <div className="flex items-center justify-center mb-4">
            {/* Aplicamos las clases dinámicas aquí */}
            <div
              className={`icon-animate size-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-b-1 border-t-1 border-transparent group-hover:scale-110 group-hover:dark:border-t-white/10 ${currentVariant.colorClass} ${currentVariant.borderHover}`}
            >
              <Icon className={`text-3xl ${currentVariant.iconColor}`} />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </BaseDialog>
      </div>
    </>
  );

  return createPortal(dialogContent, document.body);
}
