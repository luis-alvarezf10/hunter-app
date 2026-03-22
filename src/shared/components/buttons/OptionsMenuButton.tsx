"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiDotsVertical } from "react-icons/hi";
import { IconButton } from "@/shared/components/buttons/IconButton"; // Ajusta la ruta

interface DropdownAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface DropdownMenuProps {
  actions: DropdownAction[];
  align?: "left" | "right";
  position?: "top" | "bottom";
}

export const OptionsMenuButton = ({ 
  actions, 
  align = "right", 
  position = "bottom" 
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const posClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2"
  };

  const alignClasses = {
    right: "right-0",
    left: "left-0"
  };

  return (
    <div className="relative" ref={menuRef}>
      <IconButton
        icon={<HiDotsVertical className="text-lg w-5 h-5" />}
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: position === "top" ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === "top" ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${alignClasses[align]} ${posClasses[position]} w-48 bg-white/90 dark:bg-[#1a1a1a]/90 border border-white/20 dark:border-white/10 rounded-2xl shadow-xl z-[100] backdrop-blur-md overflow-hidden`}
          >
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3 cursor-pointer
                  ${action.variant === "danger" 
                    ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10"
                  }
                  ${index !== actions.length - 1 ? "border-b border-gray-100 dark:border-white/5" : ""}
                `}
              >
                <span className="text-lg">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};