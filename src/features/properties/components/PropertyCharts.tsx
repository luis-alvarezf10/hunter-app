"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/core/config";
import { Card } from "@/shared/components/cards/card";
import { TitleCard } from "@/shared/components/text/TitleCard";
import { PercentageBadge } from "@/shared/components/badges/PercentageBadge";
import { LoadSpin } from "@/shared/components/spins/LoadSpin";
import { PieChart, Pie, Cell, Sector } from "recharts";

export function PropertyCharts({ id }: { id: string }) {
  const [typeData, setTypeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      if (!id) return;
      try {
        const { data: types } = await supabase
          .from("type_properties")
          .select("id, value, color");
        const { data: propCounts } = await supabase
          .from("properties")
          .select("id_type")
          .eq("id_advisor", id);

        if (types && propCounts) {
          const total = propCounts.length;
          const counts = propCounts.reduce((acc: any, curr) => {
            acc[curr.id_type] = (acc[curr.id_type] || 0) + 1;
            return acc;
          }, {});

          const chartData = types
            .map((type) => ({
              name: type.value,
              value: counts[type.id] || 0,
              color: type.color || "#6b7280",
              percentage: total > 0 ? (counts[type.id] / total) * 100 : 0,
            }))
            .filter((item) => item.value > 0)
            .sort((a, b) => b.value - a.value);

          setTypeData(chartData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supabase, id]);

  const totalValue = useMemo(
    () => typeData.reduce((sum, item) => sum + item.value, 0),
    [typeData],
  );

  if (!mounted) return null;
  if (loading)
    return (
      <Card className="flex items-center justify-center min-h-[350px]">
        <LoadSpin />
      </Card>
    );

  return (
    <Card
      className="h-full relative overflow-hidden p-5 md:p-8"
      showHoverEffect
    >
      <div className="relative z-10">
        <TitleCard title="Propiedades por tipo" />

        <div className="flex flex-col lg:flex-row items-center gap-12 mt-8">
          <div
            className="flex-shrink-0 flex items-center justify-center bg-transparent"
            style={{
              width: "240px",
              height: "240px",
              minWidth: "240px",
              minHeight: "240px",
            }}
          >
            {typeData.length > 0 && (
              <div className="relative">
                <PieChart width={240} height={240}>
                  <Pie
                    data={typeData}
                    cx={120}
                    cy={120}
                    innerRadius={70}
                    outerRadius={90}
                    dataKey="value"
                    stroke="none"
                    paddingAngle={8}
                    cornerRadius={40}
                    isAnimationActive={false} // Desactivamos para que la transición CSS sea la reina
                  >
                    {typeData.map((entry, index) => {
                      const isHovered = activeIndex === index;
                      const isAnyHovered = activeIndex !== undefined;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            !isAnyHovered || isHovered ? entry.color : "#f1f5f9"
                          }
                          style={{
                            transform: isHovered ? "scale(1.1)" : "scale(1)",
                            transformOrigin: "center",
                            transition:
                              "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            filter: isHovered
                              ? `drop-shadow(0px 8px 16px ${entry.color}40)`
                              : "none",
                            outline: "none",
                          }}
                        />
                      );
                    })}
                  </Pie>
                </PieChart>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-4xl font-bold transition-all duration-500 ${activeIndex !== undefined ? "scale-110" : ""}`}
                  >
                    {activeIndex !== undefined
                      ? typeData[activeIndex].value
                      : totalValue}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {activeIndex !== undefined
                      ? typeData[activeIndex].name
                      : "Total"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            {typeData.map((item, index) => {
              const isHovered = activeIndex === index;
              // Corregimos: Recharts usa undefined cuando no hay hover
              const isAnyHovered = activeIndex !== undefined;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
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
                    borderLeftColor: isHovered ? item.color : "transparent",
                    borderTopColor: isHovered
                      ? "rgba(255,255,255,0.3)"
                      : "transparent",
                  }}
                >
                  <div
                    className={`absolute left-0 w-24 inset-y-0 transition-opacity duration-500 pointer-events-none ${
                      isHovered ? "opacity-20" : "opacity-0"
                    }`}
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
                    {/* ANTES DECÍA item.label, AHORA item.name */}
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.value}
                    </span>
                    <PercentageBadge percentage={Math.round(item.percentage)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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
    </Card>
  );
}
