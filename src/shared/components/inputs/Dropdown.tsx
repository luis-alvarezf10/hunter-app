import { useState, useRef, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar",
  className = "",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative" >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex gap-1 bg-white dark:bg-[#1a1a1a] rounded-2xl transition-all shadow-sm hover:shadow-lg transition-all duration-300  dark:border-y-1 border-y-white/30 p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-b hover:dark:from-white/10 hover:dark:to-[#1a1a1a] transition-colors outline-none focus:ring-1 focus:ring-primary/80 flex items-center gap-2 min-w-[160px] justify-between cursor-pointer ${className}`}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <HiChevronDown
          className={`text-lg transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 bg-white/90 dark:bg-[#1a1a1a]/90 dark:border-1 border-white/30 rounded-2xl shadow-lg z-50 min-w-[200px] backdrop-blur-md overflow-y-auto p-1 flex flex-col gap-1"
          >
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="rounded-2xl w-full px-4 py-2 text-sm text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              {placeholder}
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-center text-sm transition-colors rounded-2xl ${
                  value === option.value
                    ? "bg-gradient-to-r from-secondary to-wine-red text-white font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer"
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
