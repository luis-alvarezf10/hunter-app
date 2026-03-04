'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/core/config';
import { HiOutlineBadgeCheck, HiOutlineChat, HiOutlineCollection, HiOutlineUserAdd } from "react-icons/hi";

interface Stats {
  totalProperties: number;
  available: number;
  reserved: number;
  sold: number;
  rented: number;
  totalValue: number;
}

export function StatCards() {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    available: 0,
    reserved: 0,
    sold: 0,
    rented: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      try {
        // Obtener todas las propiedades con precio desde details
        const { data: properties } = await supabase
          .from('properties')
          .select(`
            id,
            status,
            details_properties (price)
          `);

        if (properties) {
          const available = properties.filter(p => p.status === 'available').length;
          const reserved = properties.filter(p => p.status === 'reserved').length;
          const sold = properties.filter(p => p.status === 'saled').length;
          const rented = properties.filter(p => p.status === 'rented').length;

          // Calcular valor total de propiedades disponibles
          const totalValue = properties
            .filter(p => p.status === 'available')
            .reduce((sum, p) => {
              const price = p.details_properties?.[0]?.price || 0;
              return sum + price;
            }, 0);

          setStats({
            totalProperties: properties.length,
            available,
            reserved,
            sold,
            rented,
            totalValue,
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [supabase]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statCards = [
    {
      label: 'Total Propiedades',
      description: 'Nuevas asesorando',
      value: '4',
      icon: <HiOutlineCollection />,
      gradient: 'from-blue-500 to-blue-600',
      trend: '+2',
      iconBg: 'bg-blue-500 dark:bg-blue-500/10 ',
      iconColor: 'text-blue-400',
      color: '#3b82f6', // blue-500
    },
    {
      label: 'Citas Realizadas',
      description: 'Encuentro con clientes',
      value: '10',
      icon: <HiOutlineChat />,
      gradient: 'from-amber-500 to-amber-600',
      trend: '+5',
      iconBg: 'bg-amber-500 dark:bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
      color: '#f59e0b', // emerald-500
    },
    {
      label: 'Ofertas Cerradas',
      description: 'Ofertas en proceso',
      value: '5',
      icon: <HiOutlineBadgeCheck />,
      gradient: 'from-emeral-500 to-emerald-600',
      trend: '+3',
      iconBg: 'bg-emerald-500 dark:bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      color: '#10b981',
      // amber-500
    },
    {
      label: 'Prospectos Nuevos',
      description: 'Clientes interesados',
      value: '3',
      icon: <HiOutlineUserAdd />,
      gradient: 'from-purple-500 to-purple-600',
      trend: '-1',
      iconBg: 'bg-purple-500 dark:bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
      color: '#a855f7', // purple-500
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="md:col-span-2 lg:col-span-5 relative bg-gradient-to-br from-secondary dark:from-primary via-primary dark:via-primary/40 to-wine-red dark:to-transparent rounded-2xl p-6 overflow-hidden border border-transparent border-t-white/30 shadow-2xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

        <div className="relative z-10 flex items-center justify-center md:justify-start">
          <div className="md:text-start text-center">
            <p className="text-white text-sm font-medium mb-2">
              Puntos acumulados
            </p>
            <p className="text-4xl font-bold text-white">
              {loading ? 'Cargando...' : stats.totalValue}
            </p>
            <p className="text-white/60 text-sm mt-2">
              Datos Estadísticos de tus ventas
            </p>
          </div>
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-5"><h3 className="text-gray-700 dark:text-white">Tus Estadísticos este mes:</h3></div>
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="group relative bg-white dark:bg-[#1a1a1a] hover:bg-gradient-to-b hover:dark:from-white/10 hover:dark:to-[#1a1a1a] rounded-2xl p-5 md:p-3 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default dark:border border-transparent border-t-white/30 flex flex-col gap-2"
        >
          {/* Gradient background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 `}></div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px] transition-transform duration-500 ease-in-out origin-center scale-x-0 group-hover:scale-x-100 z-20"
            style={{
              backgroundColor: stat.color,
              boxShadow: `0 -4px 12px ${stat.color}80`
            }}
          />

          <div className="flex items-center justify-between relative z-10">
            <div
              className={`${stat.iconBg} w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 border-b-1 border-transparent group-hover:scale-110 group-hover:border-b-[var(--card-color)]`}
              style={{ '--card-color': stat.color } as React.CSSProperties}
            >
              <span className={`material-symbols-outlined text-2xl text-white dark:${stat.iconColor}`}>
                {stat.icon}
              </span>
            </div>
            <div className={`text-sm font-semibold px-5 py-1/2 rounded-full transition-colors duration-300 ${stat.trend.startsWith('+')
              ? 'bg-[#74f67b] text-[#1a1a1a]'
              : stat.trend.startsWith('-')
                ? 'bg-[#f54942] text-white'
                : 'bg-gray-500/10 text-gray-500'
              }`}>
              {stat.trend}
            </div>
          </div>
          <div className="flex flex-col items-baseline gap-2">
            <span className="text-sm md:text-xs">
              {stat.label}
            </span>
            <div className="flex items-end gap-5">
              <span className="text-3xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </span>
              <span className="text-sm md:text-xs text-gray-400">
                {stat.description}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Valor Total Card - Destacado */}

    </div>
  );
}
