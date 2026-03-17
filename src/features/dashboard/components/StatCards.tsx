"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/config";
import {
  HiOutlineBadgeCheck,
  HiOutlineChat,
  HiOutlineCollection,
  HiOutlineUserAdd,
} from "react-icons/hi";
import { StatCard } from "@/shared/components/cards/StatCard";
import { StatCardSkeleton } from "@/shared/components/skeletons/StatCardSkeleton";

interface Stats {
  properties: number;
  dates: number;
  offers: number;
  leads: number;
}

interface Trends {
  properties: number;
  dates: number;
  offers: number;
  leads: number;
}

const formatTrend = (value: number): string => {
  if (value > 0) return `+${value}`;
  if (value < 0) return `${value}`; // El signo '-' ya viene incluido en números negativos
  return "0";
};

export function StatCards() {
  const [stats, setStats] = useState<Stats>({
    properties: 0,
    dates: 0,
    offers: 0,
    leads: 0,
  });

  const [trends, setTrends] = useState<Trends>({
    properties: 0,
    dates: 0,
    offers: 0,
    leads: 0,
  });

  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [pointsRealtor, setPointsRealtor] = useState<number>(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fechas para filtrar el mes actual
        const now = new Date();
        const firstDayThisMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
        );
        const firstDayLastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );

        // 2. Obtener Puntos del Realtor
        const { data: pointsData } = await supabase
          .from("points")
          .select("value")
          .eq("id", user.id)
          .maybeSingle();
        if (pointsData) setPointsRealtor(pointsData.value);

        // FILTRO DE TOTAL PROPIEDADES
        const { data: allMyProperties } = await supabase
          .from("properties")
          .select(`id, created_at, status`)
          .eq("id_advisor", user.id);

        if (allMyProperties) {
          // Filtrar propiedades de ESTE mes (para el valor principal)
          const thisMonthCount = allMyProperties.filter(
            (p) => new Date(p.created_at) >= firstDayThisMonth,
          ).length;

          // Filtrar propiedades del MES PASADO (para la tendencia)
          const lastMonthCount = allMyProperties.filter((p) => {
            const date = new Date(p.created_at);
            return date >= firstDayLastMonth && date < firstDayThisMonth;
          }).length;

          // Actualizar Estados de Propiedades
          setStats((prev) => ({ ...prev, properties: thisMonthCount }));
          setTrends((prev) => ({
            ...prev,
            properties: thisMonthCount - lastMonthCount,
          }));
        }

        // FILTRO DE TOTAL DE CITAS REALIZADAS
        const { data: allMyDates } = await supabase
          .from("schedule")
          .select(`id, date, status`)
          .eq("id_realtor", user.id)
          .eq("status", "Realizada");
        
        console.log(allMyDates);
        if (allMyDates) {
          // Filtrar citas de ESTE mes (para el valor principal)
          const thisMonthCount = allMyDates.filter(
            (d) => new Date(d.date) >= firstDayThisMonth,
          ).length;

          // Filtrar citas del MES PASADO (para la tendencia)
          const lastMonthCount = allMyDates.filter((d) => {
            const date = new Date(d.date);
            return date >= firstDayLastMonth && date < firstDayThisMonth;
          }).length;

          // Actualizar Estados de Citas
          setStats((prev) => ({ ...prev, dates: thisMonthCount }));
          setTrends((prev) => ({
            ...prev,
            dates: thisMonthCount - lastMonthCount,
          }));
        }

      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [supabase]);

  const statCards = [
    {
      label: "Total Propiedades",
      description: "Nuevas asesorando",
      value: loading ? "..." : stats.properties,
      icon: <HiOutlineCollection />,
      gradient: "from-blue-500 to-blue-600",
      trend: loading ? "0" : formatTrend(trends.properties),
      iconBg: "bg-blue-500 dark:bg-blue-500/10 ",
      iconColor: "text-blue-400 dark:text-blue-400",
      color: "#3b82f6", // blue-500
    },
    {
      label: "Citas Realizadas",
      description: "Encuentro con clientes",
      value: loading ? "..." : stats.dates,
      icon: <HiOutlineChat />,
      gradient: "from-amber-500 to-amber-600",
      trend: loading ? "0" : formatTrend(trends.dates),
      iconBg: "bg-amber-500 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      color: "#f59e0b", // emerald-500
    },
    {
      label: "Ofertas Cerradas",
      description: "Ofertas en proceso",
      value: "5",
      icon: <HiOutlineBadgeCheck />,
      gradient: "from-emeral-500 to-emerald-600",
      trend: "0",
      iconBg: "bg-emerald-500 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      color: "#10b981",
      // amber-500
    },
    {
      label: "Prospectos Nuevos",
      description: "Clientes interesados",
      value: "3",
      icon: <HiOutlineUserAdd />,
      gradient: "from-purple-500 to-purple-600",
      trend: "-1",
      iconBg: "bg-purple-500 dark:bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      color: "#a855f7", // purple-500
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="md:col-span-2 lg:col-span-5 relative bg-gradient-to-br from-secondary dark:from-primary via-primary dark:via-primary/40 to-wine-red dark:to-transparent rounded-2xl p-6 overflow-hidden border-t-1 border-transparent border-t-white/30 shadow-2xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

        <div className="relative z-10 flex items-center justify-center md:justify-start">
          <div className="md:text-start text-center">
            <p className="text-white text-sm font-medium mb-2">
              Puntos acumulados
            </p>
            <p className="text-4xl font-bold text-white">
              {loading ? "..." : pointsRealtor}
            </p>
            <p className="text-white/60 text-sm mt-2">
              Datos Estadísticos de tus ventas
            </p>
          </div>
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-5">
        <h3 className="text-gray-700 dark:text-white">
          Tus Estadísticas este mes:
        </h3>
      </div>
      {statCards.map((stat, index) =>
        loading ? (
          <StatCardSkeleton key={index} />
        ) : (
          <StatCard
            key={index}
            gradient={stat.gradient}
            color={stat.color}
            iconBg={stat.iconBg}
            icon={stat.icon}
            iconColor={stat.iconColor}
            trend={stat.trend}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ),
      )}
    </div>
  );
}
