'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/core/config';
import { Card } from '@/shared/components/cards/card';
import { TitleCard } from '@/shared/components/text/TitleCard';

interface TypeData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

export function PropertyCharts() {
  const [typeData, setTypeData] = useState<TypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: types } = await supabase.from('type_properties').select('id, value, color');
        const { data: propCounts } = await supabase.from('properties').select('id_type');

        if (types && propCounts) {
          const total = propCounts.length;
          const counts = propCounts.reduce((acc: any, curr) => {
            acc[curr.id_type] = (acc[curr.id_type] || 0) + 1;
            return acc;
          }, {});

          const chartData = types
            .map(type => ({
              label: type.value,
              value: counts[type.id] || 0,
              color: type.color || '#6b7280',
              percentage: total > 0 ? (counts[type.id] / total) * 100 : 0,
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);

          setTypeData(chartData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supabase]);

  const renderPieChart = (data: TypeData[]) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0;
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full max-w-[240px] overflow-visible transform -rotate-90">
          {data.map((item, index) => {
            const strokeLength = (item.percentage / 100) * circumference;
            const gap = data.length > 1 ? 4 : 0; 
            const dashArray = `${Math.max(0, strokeLength - gap)} ${circumference}`;
            const dashOffset = -currentOffset;
            
            currentOffset += strokeLength;
            const isHovered = activeIndex === index;
            const isAnyHovered = activeIndex !== null;

            // DETERMINAMOS EL COLOR: Si hay alguien en hover y no soy yo, me pongo gris
            const strokeColor = isAnyHovered && !isHovered 
              ? '#e2e8f0' // Gris suave (puedes usar '#334155' para un gris oscuro en dark mode)
              : item.color;

            return (
              <circle
                key={index}
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke={strokeColor}
                strokeWidth={isHovered ? "24" : "18"}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-500 cursor-pointer"
                style={{ 
                  filter: isHovered ? `drop-shadow(0 0 12px ${item.color}66)` : 'none',
                  // Eliminamos la opacidad para que el cambio de color a gris sea el protagonista
                  opacity: 1 
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              />
            );
          })}
        </svg>

        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">
            {activeIndex !== null ? data[activeIndex].value : totalValue}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
            {activeIndex !== null ? data[activeIndex].label : 'Total'}
          </span>
        </div>
      </div>
    );
  };

  if (loading) return (
    <Card className="flex items-center justify-center min-h-[350px]">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </Card>
  );

  return (
    <Card className="h-full relative overflow-hidden transition-all duration-500">
      {/* 1. EL GRADIENTE DE FONDO DE LA CARTA PRINCIPAL */}
      {typeData.map((item, index) => (
        <div
          key={`bg-grad-${index}`}
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in-out"
          style={{
            background: `radial-gradient(circle at top right, ${item.color}15, transparent 40%), 
                         radial-gradient(circle at bottom left, ${item.color}10, transparent 40%)`,
            opacity: activeIndex === index ? 1 : 0,
            zIndex: 0
          }}
        />
      ))}

      {/* 2. LA LÍNEA BRILLANTE EN LA BASE DE LA CARTA PRINCIPAL */}
      {typeData.map((item, index) => (
        <div
          key={`line-base-${index}`}
          className="absolute bottom-0 left-0 right-0 h-[4px] transition-all duration-500 ease-in-out origin-center z-20"
          style={{
            backgroundColor: item.color,
            boxShadow: `0 -4px 20px ${item.color}80`,
            opacity: activeIndex === index ? 1 : 0,
            transform: activeIndex === index ? 'scaleX(1)' : 'scaleX(0)',
          }}
        />
      ))}

      {/* Contenido envuelto en un z-index para que no lo tape el gradiente */}
      <div className="relative z-10">
        <TitleCard title="Propiedades por tipo" />
        
        <div className="flex flex-col lg:flex-row items-center gap-12 mt-8">
          {renderPieChart(typeData)}
          
          <div className="flex flex-col gap-3 w-full">
            {typeData.map((item, index) => {
              const isHovered = activeIndex === index;
              const isAnyHovered = activeIndex !== null;

              return (
                <div 
                  key={index} 
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 cursor-pointer
                    ${isHovered ? 'bg-white/60 dark:bg-slate-800/60 translate-x-3 shadow-sm backdrop-blur-sm' : ''}
                    ${isAnyHovered && !isHovered ? 'opacity-40 grayscale' : 'opacity-100'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-700 shadow-sm transition-colors duration-500" 
                      style={{ backgroundColor: isAnyHovered && !isHovered ? '#cbd5e1' : item.color }} 
                    />
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-black text-slate-900 dark:text-white">{item.value}</span>
                    <span className="text-[11px] bg-white dark:bg-slate-700 px-2 py-1 rounded-lg font-black text-slate-500 shadow-sm border border-slate-100 dark:border-none">
                      {Math.round(item.percentage)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}