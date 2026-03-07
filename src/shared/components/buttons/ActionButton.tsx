import { ButtonHTMLAttributes, ReactNode } from "react";
import { HiOutlineFolderAdd, HiOutlinePlusCircle, HiOutlineRefresh } from "react-icons/hi";

// Definimos los tipos de las props para tener autocompletado
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  iconVariant?: 'add' | 'edit' | 'delete' | 'view' | 'save' | 'cancel' | 'reset';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const ActionButton = ({
  className = "",
  variant = 'primary',
  iconVariant,
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  
  // 1. Estilos base
  const baseStyles = "flex gap-4 inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 hover:scale-102 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  // 2. Diccionario de variantes (Clases de Tailwind)
  const variants = {
    primary: "bg-gradient-to-r from-secondary to-wine-red text-white hover:bg-primary shadow-md",
    secondary: "bg-gray-500/10",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-red-500/50",
  };

  const iconVariants = { 
    add: <HiOutlinePlusCircle className="w-5 h-5" />,
    edit: <HiOutlineFolderAdd className="w-5 h-5" />,
    delete: <HiOutlineFolderAdd className="w-5 h-5" />,
    view: <HiOutlineFolderAdd className="w-5 h-5" />,
    save: <HiOutlineFolderAdd className="w-5 h-5" />,
    cancel: <HiOutlineFolderAdd className="w-5 h-5" />,
    reset: <HiOutlineRefresh className="w-5 h-5"/>
  };

  // 3. Diccionario de tamaños
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  // Combinamos todas las clases en un solo string
  // Usamos .trim() para evitar espacios extra al principio o final
  const combinedClasses = `
    ${baseStyles} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      className={combinedClasses}
      disabled={isLoading || disabled}
      {...props}
    >
      {/* Spinner de carga opcional */}
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {/* Icono izquierdo */}
      {iconVariant && !isLoading && (
        <span className="mr-2">
          {iconVariants[iconVariant]}
        </span>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};