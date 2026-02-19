'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/core/config';

interface Stats {
  available: number;
  reserved: number;
  sold: number;
}

export function PropertyStats() {
  const [stats, setStats] = useState<Stats>({
    available: 0,
    reserved: 0,
    sold: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      try {
        const { data: properties } = await supabase
          .from('properties')
          .select('status');

        if (properties) {
          setStats({
            available: properties.filter(p => p.status === 'available').length,
            reserved: properties.filter(p => p.status === 'reserved').length,
            sold: properties.filter(p => p.status === 'sold').length,
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

  const statusData = [
    { 
      label: 'Disponibles', 
      value: stats.available, 
      color: 'bg-emerald-500', 
      icon: 'check_circle',
      gradient: 'from-emerald-400 to-emerald-600',
    },
    { 
      label: 'Reservadas', 
      value: stats.reserved, 
      color: 'bg-amber-500', 
      icon: 'schedule',
      gradient: 'from-amber-400 to-amber-600',
    },
    { 
      label: 'Vendidas', 
      value: stats.sold, 
      color: 'bg-purple-500', 
      icon: 'sell',
      gradient: 'from-purple-400 to-purple-600',
    },
  ];

  const maxValue = Math.max(...statusData.map(d => d.value), 1);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
        Propiedades por Estado
      </h3>
      
      <div className="space-y-5">
        {statusData.map((item, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${item.color} bg-opacity-10 rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                  <span className={`material-symbols-outlined text-xl ${item.color.replace('bg-', 'text-')}`}>
                    {item.icon}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.value}
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {maxValue > 0 ? Math.round((item.value / (stats.available + stats.reserved + stats.sold)) * 100) : 0}%
                </span>
              </div>
            </div>
            
            {/* Barra de progreso mejorada */}
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-700 ease-out shadow-md`}
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Total */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Total de Propiedades
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.available + stats.reserved + stats.sold}
          </span>
        </div>
      </div>
    </div>
  );
}
