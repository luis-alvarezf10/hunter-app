"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/config";
import { HiOutlineCash, HiOutlineFire } from "react-icons/hi";
import { StatCard } from "@/shared/components/cards/StatCard";
import { StatCardSkeleton } from "@/shared/components/skeletons/StatCardSkeleton";

interface Stats {
  points: number;
  commissions: number;
}

export function StatCards() {
  const [stats, setStats] = useState<Stats>({ points: 0, commissions: 0 });
  const [lastMonthStats, setLastMonthStats] = useState<Stats>({ points: 0, commissions: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(val);

  const calculateTrendPercentage = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const diff = ((current - previous) / previous) * 100;
    return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  useEffect(() => {
    async function loadStats() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const { data: salesData } = await supabase
          .from("details_sale")
          .select(`percentage, created_at, sales ( price )`)
          .eq("id_realtor", user.id);

        if (salesData) {
          // Filtrado Mes Actual
          const thisMonth = salesData.filter(s => new Date(s.created_at) >= firstDayThisMonth);
          const currentPoints = thisMonth.reduce((acc, curr: any) => acc + (curr.sales?.price || 0), 0);
          const currentComms = thisMonth.reduce((acc, curr: any) => 
            acc + ((curr.sales?.price || 0) * ((curr.percentage || 0) / 100)), 0);

          // Filtrado Mes Pasado
          const lastMonth = salesData.filter(s => {
            const d = new Date(s.created_at);
            return d >= firstDayLastMonth && d < firstDayThisMonth;
          });
          const prevPoints = lastMonth.reduce((acc, curr: any) => acc + (curr.sales?.price || 0), 0);
          const prevComms = lastMonth.reduce((acc, curr: any) => 
            acc + ((curr.sales?.price || 0) * ((curr.percentage || 0) / 100)), 0);

          setStats({ points: currentPoints, commissions: currentComms });
          setLastMonthStats({ points: prevPoints, commissions: prevComms });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [supabase]);

  const statCards = [
    {
      label: "Total Puntos",
      description: "Valor vendido",
      value: loading ? "..." : formatCurrency(stats.points),
      trend: loading ? "0%" : calculateTrendPercentage(stats.points, lastMonthStats.points),
      icon: <HiOutlineFire />,
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-500 dark:bg-orange-500/10",
      iconColor: "text-orange-400 dark:text-orange-400",
      color: "#ff5c00",
    },
    {
      label: "Total Comisiones",
      description: "USD Ganados",
      value: loading ? "..." : formatCurrency(stats.commissions),
      trend: loading ? "0%" : calculateTrendPercentage(stats.commissions, lastMonthStats.commissions),
      icon: <HiOutlineCash />,
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-500 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      color: "#10b981",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-6">
      {statCards.map((stat, i) => (
        loading ? <StatCardSkeleton key={i} /> : <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}