import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiDotsVertical } from "react-icons/hi";

// T representa el tipo de dato de tu fila
interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string; // Para controlar el grid-cols o spans
  hideOnMobile?: boolean;
}

interface Action<T> {
  label: string;
  icon: React.ReactNode;
  onClick: (item: T) => void;
  isDanger?: boolean;
}

interface DataTableProps<T> {
  data: Record<string, T[]>; // Agrupado por fecha/categoría
  columns: Column<T>[];
  actions?: Action<T>[];
  formatGroupHeader?: (group: string) => string;
  getStatusIndicator?: (item: T) => string; // Para la barrita lateral de color
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  actions,
  formatGroupHeader,
  getStatusIndicator,
}: DataTableProps<T>) {
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);

  return (
    <div className="w-full">
      {/* Header Dinámico - MD+ */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-100 dark:bg-white/5 rounded-t-xl border-x border-t border-gray-300 dark:border-white/10 text-xs uppercase font-semibold text-gray-600 dark:text-gray-300">
        {columns.map((col, idx) => (
          <div key={idx} className={col.className}>
            {col.header}
          </div>
        ))}
        {actions && <div className="col-span-2 text-center">Acciones</div>}
      </div>

      <div className="space-y-4 md:space-y-0 md:border md:border-gray-300 md:dark:border-white/10 md:rounded-b-xl overflow-hidden">
        {Object.entries(data).map(([group, items]) => (
          <div key={group}>
            {/* Group Header (Fecha) */}
            <div className="md:hidden sticky top-0 mb-5 z-10 py-2 flex items-center justify-center gap-3 bg-inherit">
              <div className="flex-1 bg-gray-300 dark:bg-white/20 h-0.5 rounded-full" />
              <span className="text-xs font-black uppercase tracking-widest dark:text-secondary">
                {formatGroupHeader ? formatGroupHeader(group) : group}
              </span>
              <div className="flex-1 bg-gray-300 dark:bg-white/20 h-0.5 rounded-full" />
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#1a1a1a] flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 p-6 md:px-6 md:py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors shadow-sm md:shadow-none mb-3 md:mb-0 rounded-2xl md:rounded-none"
              >
                {/* Renderizado de Columnas */}
                {columns.map((col, idx) => {
                  const content =
                    typeof col.accessor === "function"
                      ? col.accessor(item)
                      : (item[col.accessor] as React.ReactNode);

                  return (
                    <div
                      key={idx}
                      className={`${col.className} ${col.hideOnMobile ? "hidden md:block" : ""}`}
                    >
                      {/* Contenedor de celda */}
                      <div className="flex items-center gap-3">
                        {/* Solo mostramos el indicador si es la primera columna Y la función existe */}
                        {idx === 0 && getStatusIndicator && (
                          <div
                            className={`w-2 h-10 rounded-full shrink-0 ${getStatusIndicator(item)}`}
                          />
                        )}

                        {/* EL CONTENIDO: Ahora siempre se muestra, sea la columna que sea */}
                        <div className="flex-1 min-w-0">{content}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Acciones */}
                {actions && (
                  <div className="hidden md:flex col-span-2 items-center justify-center gap-2 pt-3 md:pt-0">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === item.id ? null : item.id)
                        }
                        className="p-2 border border-gray-300 dark:border-white/10 rounded-lg"
                      >
                        <HiDotsVertical className="text-lg" />
                      </button>

                      <AnimatePresence>
                        {openMenuId === item.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 bottom-full md:top-full mb-2 md:mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-xl shadow-xl z-[100]"
                          >
                            {actions.map((action, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  action.onClick(item);
                                  setOpenMenuId(null);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 first:rounded-t-xl last:rounded-b-xl hover:bg-gray-50 dark:hover:bg-white/5 ${action.isDanger ? "text-red-500" : ""}`}
                              >
                                {action.icon}
                                {action.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
