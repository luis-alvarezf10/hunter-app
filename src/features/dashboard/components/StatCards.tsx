"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/config";
import {
  HiMinus,
  HiOutlineBadgeCheck,
  HiOutlineChat,
  HiOutlineCollection,
  HiOutlineTrendingDown,
  HiOutlineTrendingUp,
  HiOutlineUserAdd,
} from "react-icons/hi";
import { StatCard } from "@/shared/components/cards/StatCard";

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

function StatCardSkeleton() {
  return (
    <div className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 md:p-4 overflow-hidden shadow-sm dark:border-t-1 border-t-white/10 flex flex-col gap-4 animate-pulse">
      {/* Fila Superior: Icono y Badge de tendencia */}
      <div className="flex items-center justify-between relative z-10">
        {/* Icono Skeleton */}
        <div className="w-12 h-12 bg-gray-200 dark:bg-white/5 rounded-2xl" />

        {/* Trend Badge Skeleton */}
        <div className="w-14 h-6 bg-gray-200 dark:bg-white/5 rounded-full" />
      </div>

      {/* Fila Inferior: Texto y Números */}
      <div className="flex flex-col gap-2 relative z-10">
        {/* Label Skeleton */}
        <div className="h-3 w-24 bg-gray-200 dark:bg-white/5 rounded" />

        <div className="flex items-baseline gap-2">
          {/* Value (Número grande) Skeleton */}
          <div className="h-8 w-12 bg-gray-200 dark:bg-white/10 rounded-md" />

          {/* Description Skeleton */}
          <div className="h-3 w-20 bg-gray-100 dark:bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}

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
  const [newThisMonth, setNewThisMonth] = useState(0);
  const supabase = createClient();
  const [pointsRealtor, setPointsRealtor] = useState<number>(0);
  const trendProperties = newThisMonth; // Ejemplo: 2
  const trendCitas = 5; // Ejemplo: valor estático o calculado
  const trendOfertas = 0;
  const trendProspectos = -1;

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

        // 3. Obtener Propiedades
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

        // Nota: Aquí podrías añadir lógica similar para 'schedules' (dates) y 'leads'
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
      value: "10",
      icon: <HiOutlineChat />,
      gradient: "from-amber-500 to-amber-600",
      trend: "+5",
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

      {/* Valor Total Card - Destacado */}
    </div>
  );
}
