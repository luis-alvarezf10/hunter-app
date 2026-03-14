import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

interface CustomFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const CustomField = ({
  label,
  error,
  icon: Icon,
  rightElement,
  type, // Extraemos el type para manejarlo internamente
  className = "",
  ...props
}: CustomFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determinamos si es un campo de password para mostrar el ojo
  const isPasswordField = type === 'password';
  
  // El tipo final del input cambia según el estado
  const inputType = isPasswordField 
    ? (showPassword ? 'text' : 'password') 
    : type;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 ml-1">
        {label}
      </label>

      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {Icon}
          </div>
        )}

        <input
          {...props}
          type={inputType}
          className={`
            w-full py-4 px-4 rounded-2xl border transition-all duration-300 outline-none
            text-base md:text-sm
            ${Icon ? 'pl-12' : 'pl-5'}
            ${(rightElement || isPasswordField) ? 'pr-12' : 'pr-5'}
            ${error 
              ? 'border-red-500 bg-red-50/50 dark:bg-red-500/5' 
              : 'bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm hover:shadow-xl dark:border-1 border-gray-200 dark:border-white/10 p-2 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-wine-red/10'
            }
            dark:text-white text-gray-800 placeholder:text-gray-400
          `}
        />

        {/* Lógica para mostrar el botón del ojo o el rightElement */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
          {isPasswordField ? (
            <button
              type="button" // Importante: para que no haga submit al formulario
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-secondary transition-colors focus:outline-none"
            >
              {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
            </button>
          ) : (
            rightElement
          )}
        </div>
      </div>

      {error && (
        <span className="text-[11px] text-red-500 font-medium ml-2 animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
};