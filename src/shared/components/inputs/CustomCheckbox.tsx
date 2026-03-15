import React from "react";
import { HiOutlineCheck } from "react-icons/hi";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const CustomCheckbox = ({
  label,
  id,
  disabled,
  ...props
}: CheckboxProps) => {
  return (
    <div className="flex items-center group cursor-pointer">
      <div className="relative flex items-center">
        <input
          {...props}
          id={id}
          type="checkbox"
          disabled={disabled}
          className={`
            peer appearance-none w-5 h-5 rounded-md border-2 
            transition-all duration-200 cursor-pointer
            border-slate-300 dark:border-gray-600
            checked:bg-wine-red checked:border-wine-red
            focus:ring-2 focus:ring-primary/20 focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        <HiOutlineCheck className="absolute top-0.5 left-0.5 pointer-events-none hidden peer-checked:block text-white " />
      </div>

      <label
        htmlFor={id}
        className={`
          ml-3 text-sm font-medium select-none cursor-pointer
          text-slate-600 dark:text-slate-400
          group-hover:text-slate-900 dark:group-hover:text-white
          transition-colors duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {label}
      </label>
    </div>
  );
};
