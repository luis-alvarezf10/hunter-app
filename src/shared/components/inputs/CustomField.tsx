import React, { useState } from 'react';
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineCalendar, HiOutlineDocumentText } from 'react-icons/hi';

// Extendemos para que soporte tanto Input como Textarea
interface CustomFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  isTextArea?: boolean; // Nueva prop para descripciones largas
}

export const CustomField = ({
  label,
  error,
  icon,
  rightElement,
  type,
  className = "",
  isTextArea = false,
  ...props
}: CustomFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const isDateField = type === 'date';
  
  const inputType = isPasswordField 
    ? (showPassword ? 'text' : 'password') 
    : type;

  // Icono automático para fechas o descripciones si no se pasa uno
  const autoIcon = isDateField ? <HiOutlineCalendar size={20} /> : (isTextArea ? <HiOutlineDocumentText size={20} /> : icon);

  // Estilos base compartidos
  const sharedClasses = `
    w-full px-5 py-3 rounded-2xl border transition-all duration-300 outline-none
    text-base md:text-sm
    min-w-0 flex-shrink appearance-none
    ${autoIcon ? 'pl-12' : 'pl-5'}
    ${(rightElement || isPasswordField) ? 'pr-12' : 'pr-5'}
    ${error 
      ? 'border-red-500 bg-red-50/50 dark:bg-red-500/5' 
      : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/5 shadow-sm'
    }
    dark:text-white text-gray-800 placeholder:text-gray-400
  `;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label className="text-xs font-semibold tracking-widest text-gray-900 dark:text-gray-300 ml-2">
        {label}
      </label>

      <div className="relative group">
        {autoIcon && (
          <div className="absolute left-4 top-[18px] text-gray-400 group-focus-within:text-secondary transition-colors">
            {autoIcon}
          </div>
        )}

        {isTextArea ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={4}
            className={`${sharedClasses} resize-none min-h-[120px]`}
          />
        ) : (
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            type={inputType}
            className={`${sharedClasses} ${isDateField ? 'cursor-pointer' : ''}`}
          />
        )}

        <div className="absolute right-4 top-[18px] flex items-center">
          {isPasswordField ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-secondary transition-colors"
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