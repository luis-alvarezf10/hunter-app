"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/core/config";
import { Card } from "@/shared/components/cards/card";
import { TitleCard } from "@/shared/components/text/TitleCard";
import { PercentageBadge } from "@/shared/components/badges/PercentageBadge";

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
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.log("No hay usuario autenticado");
          return;
        }
        const { data: types } = await supabase
          .from("type_properties")
          .select("id, value, color");
        const { data: propCounts } = await supabase
          .from("properties")
          .select("id_type")
          .eq("id_advisor", user.id);

        if (types && propCounts) {
          const total = propCounts.length;
          const counts = propCounts.reduce((acc: any, curr) => {
            acc[curr.id_type] = (acc[curr.id_type] || 0) + 1;
            return acc;
          }, {});

          const chartData = types
            .map((type) => ({
              label: type.value,
              value: counts[type.id] || 0,
              color: type.color || "#6b7280",
              percentage: total > 0 ? (counts[type.id] / total) * 100 : 0,
            }))
            .filter((item) => item.value > 0)
            .sort((a, b) => b.value - a.value);

          setTypeData(chartData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
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
        <svg
          viewBox="0 0 200 200"
          className="w-full max-w-[240px] overflow-visible transform -rotate-90"
        >
          {data.map((item, index) => {
            const strokeLength = (item.percentage / 100) * circumference;
            const gap = data.length > 1 ? 4 : 0;
            const dashArray = `${Math.max(0, strokeLength - gap)} ${circumference}`;
            const dashOffset = -currentOffset;

            currentOffset += strokeLength;

            // Ahora el estado depende de algo externo o simplemente se queda estático
            const isHovered = activeIndex === index;
            const isAnyHovered = activeIndex !== null;

            const strokeColor =
              isAnyHovered && !isHovered ? "#e2e8f0" : item.color;

            return (
              <circle
                key={index}
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke={strokeColor}
                // Mantenemos una transición suave por si cambias el activeIndex desde fuera
                strokeWidth={isHovered ? "24" : "18"}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-500"
                style={{
                  filter: isHovered
                    ? `drop-shadow(0 0 12px ${item.color}66)`
                    : "none",
                  opacity: 1,
                }}
              />
            );
          })}
        </svg>

        {/* El centro del círculo se mantiene igual */}
        <div className="absolute flex flex-col gap-1 items-center justify-center pointer-events-none">
          <span className="text-3xl font-semibold leading-none">
            {activeIndex !== null ? data[activeIndex].value : totalValue}
          </span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
            {activeIndex !== null ? data[activeIndex].label : "Total"}
          </span>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <Card className="flex items-center justify-center min-h-[350px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
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
            zIndex: 0,
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
            transform: activeIndex === index ? "scaleX(1)" : "scaleX(0)",
          }}
        />
      ))}

      {/* Contenido envuelto en un z-index para que no lo tape el gradiente */}
      <div className="relative z-10">
        <TitleCard title="Propiedades por tipo" />
        <div className="flex flex-col lg:flex-row items-center gap-12 mt-8">
          {renderPieChart(typeData)}

          <div className="flex flex-col gap-2 w-full">
            {typeData.map((item, index) => {
              const isHovered = activeIndex === index;
              const isAnyHovered = activeIndex !== null;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`
                    relative overflow-hidden flex items-center justify-between px-4 py-2 rounded-2xl transition-all duration-300 cursor-pointer border-l-1 border-t
                    ${
                      isHovered
                        ? "bg-gradient-to-b from-white to-transparent dark:from-[#333333] dark:to-transparent scale-105 shadow-md "
                        : "border-transparent"
                    }
                    ${isAnyHovered && !isHovered ? "opacity-40 grayscale" : "opacity-100"}
                  `}
                  style={{
                    // Usamos style para el color dinámico, así nunca falla
                    borderLeftColor: isHovered ? item.color : "transparent",
                    borderTopColor: isHovered
                      ? "rgba(255,255,255,0.3)"
                      : "transparent",
                  }}
                >
                  <div
                    className={`absolute left-0 w-24 inset-y-0 transition-opacity duration-500 pointer-events-none ${isHovered ? "opacity-20" : "opacity-0"}`}
                    style={{
                      background: `linear-gradient(to right, ${item.color}, transparent)`,
                    }}
                  />
                  <div className="flex items-center gap-4">
                    <div
                      className="w-2 h-2 rounded-full shadow-sm transition-colors duration-500"
                      style={{
                        backgroundColor:
                          isAnyHovered && !isHovered ? "#cbd5e1" : item.color,
                      }}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.value}
                    </span>
                    <PercentageBadge percentage={Math.round(item.percentage)}/>
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
