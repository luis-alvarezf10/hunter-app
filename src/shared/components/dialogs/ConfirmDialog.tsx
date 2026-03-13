"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineExclamation } from "react-icons/hi";
import { ActionButton } from "../buttons/ActionButton";
import { BaseDialog } from "./BaseDialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "bg-red-600 hover:bg-red-700",
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

        .dialog-animate {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .icon-animate {
          animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          onClick={onClose}
          className="overlay-animate absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Dialog */}
        <BaseDialog className="group max-w-md">
          <div
            className={`absolute inset-0 bg-gradient-to-br  
          from-gray-200 to-gray-300/20 
          opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
          ></div>
          {/* Icon with bounce animation */}
          <div className="flex items-center justify-center mb-4">
            <div className="transition-all duration-300 icon-animate size-15 rounded-2xl bg-red-500 dark:bg-red-500/10 flex items-center justify-center rounded-2xl transition-all duration-300 border-b-1 border-t-1 border-transparent group-hover:scale-110 group-hover:dark:border-b-red-500 group-hover:dark:border-t-white/10">
              <HiOutlineExclamation className="text-white dark:text-red-600 text-3xl" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>

          <div className="flex flex-col-reverse md:flex-row gap-3">
            <ActionButton
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              {cancelText}
            </ActionButton>

            <ActionButton
              onClick={() => {
                onConfirm();
                onClose();
              }}
              variant="danger"
              className={`flex-1 ${confirmColor}`}
            >
              {confirmText}
            </ActionButton>
          </div>
        </BaseDialog>
      </div>
    </>
  );

  return createPortal(dialogContent, document.body);
}
