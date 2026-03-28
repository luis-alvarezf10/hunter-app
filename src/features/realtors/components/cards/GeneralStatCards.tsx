"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/config";
import {
  HiOutlineCheck,
  HiOutlineCollection,
  HiOutlineX,
} from "react-icons/hi";
import { StatCard } from "@/shared/components/cards/StatCard";
import { StatCardSkeleton } from "@/shared/components/skeletons/StatCardSkeleton";
import { Dropdown } from "@/shared/components/inputs/Dropdown";
import { TitleView } from "@/shared/components/text/TitleView";

interface Props {
  realtorId: string;
}

interface Stats {
  properties: number;
  dates: number;
  canceleds: number;
  sales: number;
}

interface Trends {
  properties: number;
  dates: number;
  canceleds: number;
  sales: number;
}

const formatTrend = (value: number): string => {
  if (value > 0) return `+${value}`;
  if (value < 0) return `${value}`;
  return "0";
};

export default function GeneralStatCards({ realtorId }: Props) {
  const [stats, setStats] = useState<Stats>({
    properties: 0,
    dates: 0,
    canceleds: 0,
    sales: 0,
  });

  const [trends, setTrends] = useState<Trends>({
    properties: 0,
    dates: 0,
    canceleds: 0,
    sales: 0,
  });

  const [timeRange, setTimeRange] = useState<string | null>("30");

  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      try {
        const now = new Date();
        const days = timeRange ? parseInt(timeRange) : 30;

        const startDate = new Date();
        startDate.setDate(now.getDate() - days);

        const startOfPreviousPeriod = new Date();
        startOfPreviousPeriod.setDate(now.getDate() - days * 2);

        const { data: allProps } = await supabase
          .from("properties")
          .select("id, created_at")
          .eq("id_advisor", realtorId)
          .gte("created_at", startOfPreviousPeriod.toISOString());

        if (allProps) {
          const currentCount = allProps.filter(
            (p) => new Date(p.created_at) >= startDate,
          ).length;
          const previousCount = allProps.filter((p) => {
            const d = new Date(p.created_at);
            return d >= startOfPreviousPeriod && d < startDate;
          }).length;

          setStats((prev) => ({ ...prev, properties: currentCount }));
          setTrends((prev) => ({
            ...prev,
            properties: currentCount - previousCount,
          }));
        }

        // 2. FETCH DE CITAS (SCHEDULE)
        const { data: allScheduleData } = await supabase
          .from("schedule")
          .select("id, date, status")
          .eq("id_realtor", realtorId)
          .in("status", ["Realizada", "Cancelada"]) // Traemos ambos estados
          .gte("date", startOfPreviousPeriod.toISOString());

        if (allScheduleData) {
          // --- Procesar Realizadas ---
          const doneNow = allScheduleData.filter(
            (d) => d.status === "Realizada" && new Date(d.date) >= startDate,
          ).length;
          const donePrev = allScheduleData.filter(
            (d) =>
              d.status === "Realizada" &&
              new Date(d.date) >= startOfPreviousPeriod &&
              new Date(d.date) < startDate,
          ).length;

          // --- Procesar Canceladas ---
          const canceledNow = allScheduleData.filter(
            (d) => d.status === "Cancelada" && new Date(d.date) >= startDate,
          ).length;
          const canceledPrev = allScheduleData.filter(
            (d) =>
              d.status === "Cancelada" &&
              new Date(d.date) >= startOfPreviousPeriod &&
              new Date(d.date) < startDate,
          ).length;

          setStats((prev) => ({
            ...prev,
            dates: doneNow,
            canceleds: canceledNow,
          }));

          setTrends((prev) => ({
            ...prev,
            dates: doneNow - donePrev,
            canceleds: canceledNow - canceledPrev,
          }));
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (realtorId) loadStats();
  }, [realtorId, timeRange, supabase]);

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
      icon: <HiOutlineCheck />,
      gradient: "from-emerald-500 to-emerald-600",
      trend: loading ? "0" : formatTrend(trends.dates),
      iconBg: "bg-emerald-500 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      color: "#10b981",
    },
    {
      label: "Citas Canceladas",
      description: "Canceladas por cliente",
      value: loading ? "..." : stats.canceleds,
      icon: <HiOutlineX />,
      gradient: "from-orange-300 to-orange-600",
      trend: loading ? "0" : formatTrend(trends.canceleds),
      iconBg: "bg-red-500 dark:bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400",
      color: "#fb2c36", //
    },
  ];

  return (
    <div className="space-y-6">
      <TitleView title="Estadísticas generales"/>
      <Dropdown
        options={[
          { label: "Últimos 7 días", value: "7" },
          { label: "Últimos 15 días", value: "15" },
          { label: "Últimos 30 días", value: "30" },
          { label: "Últimos 90 días", value: "90" },
        ]}
        value={timeRange}
        onChange={(val) => setTimeRange(val)}
        placeholder="Rango de Tiempo"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
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
    </div>
  );
}
