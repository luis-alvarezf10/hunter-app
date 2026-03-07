"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/config";
import { TitleCard } from "@/shared/components/text/TitleCard";
import { Card } from "@/shared/components/cards/card";
import { FilledIcon } from "@/shared/components/icons/FilledIcon";
import {
  HiOutlineBadgeCheck,
  HiOutlineFlag,
  HiOutlineLink,
  HiOutlineStar,
} from "react-icons/hi";
import { PercentageBadge } from "@/shared/components/badges/PercentageBadge";

interface Stats {
  available: number;
  reserved: number;
  sold: number;
  rented: number;
}

export function PropertyStats() {
  const [stats, setStats] = useState<Stats>({
    available: 0,
    reserved: 0,
    sold: 0,
    rented: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.log("No hay usuario autenticado");
          return;
        }
        const { data: properties } = await supabase
          .from("properties")
          .select("status").eq("id_advisor", user.id);

        if (properties) {
          setStats({
            available: properties.filter((p) => p.status === "available")
              .length,
            reserved: properties.filter((p) => p.status === "reserved").length,
            sold: properties.filter((p) => p.status === "saled").length,
            rented: properties.filter((p) => p.status === "rented").length,
          });
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [supabase]);

  const statusData = [
    {
      label: "Disponibles",
      value: stats.available,
      iconBg: "bg-emerald-500 dark:bg-emerald-500/10",
      icon: <HiOutlineBadgeCheck className="w-6 h-6" />,
      gradient: "from-emerald-400 to-emerald-600",
      iconColor: "text-white dark:text-emerald-500",
      color: "#10b981",
    },
    {
      label: "Reservadas",
      value: stats.reserved,
      iconBg: "bg-amber-500 dark:bg-amber-500/10",
      icon: <HiOutlineFlag className="w-6 h-6" />,
      gradient: "from-amber-400 to-amber-600",
      iconColor: "text-white dark:text-amber-500",
      color: "#f59e0b",
    },
    {
      label: "Vendidas",
      value: stats.sold,
      iconBg: "bg-purple-500 dark:bg-purple-500/10",
      icon: <HiOutlineStar className="w-6 h-6" />,
      gradient: "from-purple-400 to-purple-600",
      iconColor: "text-white dark:text-purple-500",
      color: "#a855f7",
    },
    {
      label: "Alquiladas",
      value: stats.rented,
      iconBg: "bg-blue-500 dark:bg-blue-500/10 ",
      icon: <HiOutlineLink className="w-6 h-6" />,
      gradient: "from-cyan-400 to-cyan-600",
      iconColor: "text-white dark:text-blue-500",
      color: "#3b82f6",
    },
  ];

  const maxValue = Math.max(...statusData.map((d) => d.value), 1);

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-6">
      <TitleCard
        title="Propiedades por status"
      />
      <div className="space-y-5">
        {statusData.map((item, index) => {
          const total =
            Number(stats.available) +
            Number(stats.reserved) +
            Number(stats.sold) +
            Number(stats.rented);
          const percentage =
            total > 0 ? Math.round((item.value / total) * 100) : 0;

          return (
            <div key={index} className="group flex gap-3">
              <FilledIcon
                icon={item.icon}
                backgroundColor={item.iconBg}
                iconColor={item.iconColor}
                color={item.color}
              />
              {/* Barra de progreso mejorada */}
              <div className="flex flex-col w-full gap-2">
                {/* Información principal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white">
                      {item.value}
                    </span>
                    <PercentageBadge percentage={percentage} />
                  </div>
                </div>
                {/* Contenedor de la barra */}
                <div className="relative w-full bg-gray-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                  {/* Barra de progreso */}
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }} // Usamos el porcentaje real respecto al total
                  >
                    {/* Brillo animado interno */}
                    <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-t-white/30">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total de Propiedades
          </span>
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {Number(stats.available) +
              Number(stats.reserved) +
              Number(stats.sold) +
              Number(stats.rented)}
          </span>
        </div>
      </div>
    </Card>
  );
}
