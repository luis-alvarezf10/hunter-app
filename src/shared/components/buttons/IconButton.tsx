import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  text?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" ;
}
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = "primary",
  className = "",
  text,
  ...props
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-secondary to-wine-red text-white shadow-md hover:opacity-90",
    secondary: "bg-gray-500/10 text-gray-700 dark:text-gray-300 hover:bg-gray-500/20",
    outline: "border border-gray-300/50 bg-transparent hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/10 cursor-pointer",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      // Cambié p-2 por px-3 para que cuando haya texto no se vea muy pegado a los bordes
      className={`p-2 sm:px-4 py-2 rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {/* El icono siempre se ve */}
      {icon}

      {/* El texto se esconde en móvil (hidden) y aparece en desktop (sm:block) */}
      {text && (
        <span className="hidden sm:block whitespace-nowrap">
          {text}
        </span>
      )}
    </button>
  );
};