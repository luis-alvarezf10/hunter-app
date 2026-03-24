import { watch } from 'fs';
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { HiEye, HiOutlineLink, HiOutlineMail } from 'react-icons/hi';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  iconVariant?: "watch" | 'copylink' | 'email' | 'whatsapp';
  text?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass" | "blue" | "green";
  isLoading?: boolean;
}
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  iconVariant,
  variant = "primary",
  className = "",
  isLoading = false,
  text,
  ...props
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-secondary to-wine-red text-white shadow-md hover:opacity-90",
    secondary: "bg-gray-300/50 dark:bg-gray-300/20  text-gray-700 dark:text-gray-300 hover:bg-gray-300/70 dark:hover:bg-gray-300/30",
    outline: "border border-gray-300/50 bg-transparent hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/10 cursor-pointer",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
    danger: "bg-red-500 text-white hover:bg-red-600",
    glass: "backdrop-blur-sm bg-white/30 dark:bg-black/20 border border-white/20 hover:bg-white/50 dark:hover:bg-black/30",
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    green: "bg-green-500 text-white hover:bg-green-600"
  };

    const iconVariants = { 
      watch: <HiEye className="w-6 h-6" />,
      copylink: <HiOutlineLink className="w-6 h-6" />,
      email: <HiOutlineMail className="w-6 h-6" />,
      whatsapp: <FaWhatsapp className="text-2xl" />
    };

  return (
    <button
      onClick={onClick}
      // Cambié p-2 por px-3 para que cuando haya texto no se vea muy pegado a los bordes
      className={`p-2 sm:px-4 py-2 rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${variants[variant]} ${className}`}
      {...props}
    >
      {/* El icono siempre se ve */}
      {icon}
      {iconVariant && !isLoading && (
        <span className="">
          {iconVariants[iconVariant]}
        </span>
      )}

      {/* El texto se esconde en móvil (hidden) y aparece en desktop (sm:block) */}
      {text && (
        <span className="hidden sm:block whitespace-nowrap">
          {text}
        </span>
      )}
    </button>
  );
};