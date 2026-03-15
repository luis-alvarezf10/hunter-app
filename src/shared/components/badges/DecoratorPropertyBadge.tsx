import React from 'react';

// 1. Tipamos los estados permitidos para mayor seguridad
type PropertyStatus = 'available' | 'unavailable' | 'pending' | 'reserved';

interface StatusPropertyProp {
  // Permitimos string para que sea flexible, pero lo tratamos como PropertyStatus
  status: PropertyStatus | string;
}

const statusVariants: Record<string, string> = {
  available: 'Disponible',
  unavailable: 'No disponible',
  pending: 'En espera',
  reserved: 'Reservada'
};

const statusColor: Record<string, string> = {
  available: "bg-emerald-500 shadow-md shadow-emerald-500/20",
  unavailable: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  reserved: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
};

export const DecoratorPropertyBadge: React.FC<StatusPropertyProp> = ({ status }) => {
  const normalizedStatus = status.toLowerCase();
  const label = statusVariants[normalizedStatus] || status;
  const colorClass = statusColor[normalizedStatus] || "bg-gray-500/10 text-gray-500";

  return (
    <div className={`w-2 h-10 rounded-full ${colorClass} transition-colors duration-300`}/>
  );
};