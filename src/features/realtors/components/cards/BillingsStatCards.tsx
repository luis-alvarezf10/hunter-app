"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/config";
import { HiOutlineCash, HiOutlineFire, HiOutlineOfficeBuilding, HiOutlineReceiptTax } from "react-icons/hi";
import { StatCard } from "@/shared/components/cards/StatCard";
import { StatCardSkeleton } from "@/shared/components/skeletons/StatCardSkeleton";
import { Dropdown } from "@/shared/components/inputs/Dropdown";
import { TitleView } from "@/shared/components/text/TitleView";

interface Props {
  realtorId: string;
}

interface Stats {
  sales: number;
  totalCompany: number;
  totalAgent: number;
}

interface Trends {
  sales: string;
  totalCompany: string;
  totalAgent: string;
}

const formatTrend = (value: number): string => {
  if (value > 0) return `+${value}%`;
  if (value < 0) return `${value}%`;
  return "0%";
};

export default function BillingStatCards({ realtorId }: Props) {
  const [stats, setStats] = useState<Stats>({
    sales: 0,
    totalCompany: 0,
    totalAgent: 0,
  });

  const [trends, setTrends] = useState<Trends>({
    sales: "0%",
    totalCompany: "0%",
    totalAgent: "0%",
  });

  const [timeRange, setTimeRange] = useState<string | null>("30");

  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const calculateTrendPercentage = (
    current: number,
    previous: number,
  ): string => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const diff = ((current - previous) / previous) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  useEffect(() => {
    async function loadStats() {
      try {
        const now = new Date();
        const days = timeRange ? parseInt(timeRange) : 30;

        const startDate = new Date();
        startDate.setDate(now.getDate() - days);

        const startOfPreviousPeriod = new Date();
        startOfPreviousPeriod.setDate(now.getDate() - days * 2);

        // 3. FETCH DE VENTAS (DETAILS_SALE)
        const { data: salesData } = await supabase
          .from("details_sale")
          .select(`percentage, created_at, sales ( price )`)
          .eq("id_realtor", realtorId) // O user.id si es el logueado
          .gte("created_at", startOfPreviousPeriod.toISOString());

        if (salesData) {
          const currentSales = salesData.filter(
            (s) => new Date(s.created_at) >= startDate,
          );
          const currentVolume = currentSales.reduce(
            (acc, curr: any) => acc + (curr.sales?.price || 0),
            0,
          );
          const currentComms = currentSales.reduce(
            (acc, curr: any) =>
              acc + ((curr.sales?.price || 0) * ((curr.percentage/2 || 0) / 100)),
            0,
          );
          const currentCommsAgent = currentSales.reduce(
            (acc, curr: any) =>
              acc + ((curr.sales?.price || 0) * ((curr.percentage/2 || 0) / 100)),
            0,
          );

          const previousSales = salesData.filter((s) => {
            const d = new Date(s.created_at);
            return d >= startOfPreviousPeriod && d < startDate;
          });
          const prevVolume = previousSales.reduce(
            (acc, curr: any) => acc + (curr.sales?.price || 0),
            0,
          );
          const prevComms = previousSales.reduce(
            (acc, curr: any) =>
              acc + ((curr.sales?.price || 0) * ((curr.percentage/2 || 0) / 100)),
            0,
          );
          const prevCommsAgent = previousSales.reduce(
            (acc, curr: any) =>
              acc + ((curr.sales?.price || 0) * ((curr.percentage/2 || 0) / 100)),
            0,
          );

          setStats({ sales: currentVolume
            , totalCompany: currentComms, totalAgent: currentCommsAgent
           });

          // CALCULAMOS EL % AQUÍ
          setTrends({
            sales: calculateTrendPercentage(currentVolume, prevVolume),
            totalCompany: calculateTrendPercentage(currentComms, prevComms),
            totalAgent: calculateTrendPercentage(currentCommsAgent, prevCommsAgent),
          });
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
      label: "Total vendido",
      description: "En ventas",
      value: loading ? "..." : stats.sales,
      icon: <HiOutlineFire />,
      gradient: "from-orange-500 to-orange-600",
      trend: loading ? "0%" : trends.sales,
      iconBg: "bg-orange-500 dark:bg-orange-500/10",
      iconColor: "text-orange-400 dark:text-orange-400",
      color: "#ff5c00",
    },
    {
      label: "Total Comisiones Empresa",
      description: "Puntos Recompensados",
      value: loading ? "..." : stats.totalCompany,
      trend: loading ? "0%" : trends.totalCompany,
      icon: <HiOutlineOfficeBuilding />,
      gradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-500 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      color: "#f59e0b"
    },
    {
      label: "Total Comisiones Agente",
      description: "Puntos Ganados",
      value: loading ? "..." : stats.totalAgent,
      trend: loading ? "0%" : trends.totalAgent,
      icon: <HiOutlineReceiptTax />,
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-500 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      color: "#10b981",
    },
  ];

  return (
    <div className="space-y-6">
      <TitleView title="Caja de cierre" />
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
