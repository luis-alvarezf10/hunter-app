'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/core/config';

interface TypeData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

export function PropertyCharts() {
  const [typeData, setTypeData] = useState<TypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      try {
        // Obtener tipos de propiedades con sus colores
        const { data: types } = await supabase
          .from('type_properties')
          .select('id, value, color');

        // Obtener todas las propiedades
        const { data: properties } = await supabase
          .from('properties')
          .select('id_type');

        if (types && properties) {
          const total = properties.length;
          
          const chartData = types.map(type => {
            const count = properties.filter(p => p.id_type === type.id).length;
            return {
              label: type.value,
              value: count,
              color: type.color || '#6b7280',
              percentage: total > 0 ? Math.round((count / total) * 100) : 0,
            };
          }).filter(item => item.value > 0); // Solo mostrar tipos con propiedades

          setTypeData(chartData);
        }
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [supabase]);

  // Función para crear el path del segmento de la torta
  const createPieSlice = (startAngle: number, endAngle: number) => {
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
  };

  const renderPieChart = (data: TypeData[]) => {
    if (data.length === 0) return null;
    
    let currentAngle = -90; // Empezar desde arriba

    return (
      <svg viewBox="0 0 200 200" className="w-full max-w-[220px] mx-auto drop-shadow-lg">
        {data.map((item, index) => {
          const sliceAngle = (item.percentage / 100) * 360;
          const path = createPieSlice(currentAngle, currentAngle + sliceAngle);
          currentAngle += sliceAngle;

          return (
            <g key={index}>
              <path
                d={path}
                fill={item.color}
                className="hover:opacity-80 transition-all duration-300 cursor-pointer hover:scale-105"
                style={{ 
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                  transformOrigin: '100px 100px',
                }}
              >
                <title>{`${item.label}: ${item.value} (${item.percentage}%)`}</title>
              </path>
            </g>
          );
        })}
        {/* Círculo blanco en el centro para efecto donut */}
        <circle cx="100" cy="100" r="55" fill="white" className="dark:fill-[#1a1a1a]" />
        
        {/* Texto en el centro */}
        <text
          x="100"
          y="95"
          textAnchor="middle"
          className="text-2xl font-bold fill-gray-900 dark:fill-white"
        >
          {data.reduce((sum, item) => sum + item.value, 0)}
        </text>
        <text
          x="100"
          y="110"
          textAnchor="middle"
          className="text-xs fill-gray-500 dark:fill-gray-400"
        >
          Total
        </text>
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-full w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">
        Propiedades por Tipo
      </h3>
      
      {typeData.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay propiedades registradas
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {renderPieChart(typeData)}
          
          {/* Leyenda mejorada */}
          <div className="mt-8 space-y-3 w-full">
            {typeData.map((item, index) => (
              <div 
                key={index} 
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full shadow-md group-hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
