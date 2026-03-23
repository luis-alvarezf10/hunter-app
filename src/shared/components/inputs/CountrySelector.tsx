"use client";

import { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiSearch } from "react-icons/hi";
import { COUNTRIES } from "@/core/constants/countries";
import { AnimatePresence, motion } from "framer-motion";

interface CountrySelectorProps {
  value: string;
  onChange: (code: string) => void;
  error?: string;
}

export function CountrySelector({
  value,
  onChange,
  error,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Encontrar el país seleccionado para mostrarlo en el botón
  const selectedCountry = COUNTRIES.find((c) => c.code === value);

  // Filtrar países según la búsqueda
  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Cerrar al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-xs font-semibold tracking-widest text-gray-900 dark:text-gray-300 ml-2">
        País
      </label>

      {/* Botón Principal (Trigger) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-5 py-3 rounded-2xl border transition-all duration-300 outline-none
          text-base md:text-sm
          min-w-0 flex-shrink appearance-none
          ${isOpen ? "border-primary ring-2 ring-primary/20" : "border-gray-200 dark:border-white/10"}
          ${error ? "border-red-500" : ""}
          bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/5 shadow-sm
        `}
      >
        <div className="flex items-center gap-2">
          {selectedCountry ? (
            <>
              <span className="text-xl">{selectedCountry.flag}</span>
              <span className="text-sm font-medium">
                {selectedCountry.name}
              </span>
            </>
          ) : (
            <span className="text-gray-400 text-sm">Selecciona un país</span>
          )}
        </div>
        <HiChevronDown
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Menú Desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-[110] overflow-hidden backdrop-blur-md"
          >
            {/* Buscador dentro del Dropdown */}
            <div className="p-2 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
              <HiSearch className="text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Buscar país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200"
                autoFocus
              />
            </div>

            {/* Lista de Países */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onChange(country.code);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors
                      ${value === country.code ? "bg-primary/10 text-primary font-bold" : "text-gray-700 dark:text-gray-300"}
                    `}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="text-sm">{country.name}</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-500">
                  No se encontraron resultados
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
