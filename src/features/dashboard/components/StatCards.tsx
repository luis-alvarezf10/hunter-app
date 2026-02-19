'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/core/config';

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
      value: loading ? '...' : stats.totalProperties.toString(),
      icon: 'home',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Disponibles',
      value: loading ? '...' : stats.available.toString(),
      icon: 'check_circle',
      gradient: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Reservadas',
      value: loading ? '...' : stats.reserved.toString(),
      icon: 'schedule',
      gradient: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Vendidas',
      value: loading ? '...' : stats.sold.toString(),
      icon: 'sell',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Alquiladas',
      value: loading ? '...' : stats.rented.toString(),
      icon: 'key',
      gradient: 'from-cyan-500 to-cyan-600',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="group relative bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-6 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          {/* Gradient background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {stat.label}
              </span>
              <div className={`p-3 ${stat.iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <span className={`material-symbols-outlined text-2xl ${stat.iconColor}`}>
                  {stat.icon}
                </span>
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      {/* Valor Total Card - Destacado */}
      <div className="md:col-span-2 lg:col-span-5 relative bg-gradient-to-br from-[#6b1e2e] to-[#8b2e3e] rounded-xl p-6 overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-semibold mb-2">
              Valor Total en Inventario
            </p>
            <p className="text-4xl font-bold text-white">
              {loading ? 'Cargando...' : formatCurrency(stats.totalValue)}
            </p>
            <p className="text-white/60 text-sm mt-2">
              Propiedades disponibles para la venta
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
            <span className="material-symbols-outlined text-5xl text-white">
              account_balance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
