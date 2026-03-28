"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/config";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesCommissionChart({ realtorId }: { realtorId: string }) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const fetchSalesData = async () => {
      try {
        const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();

        const { data, error } = await supabase
          .from("details_sale")
          .select(`
            percentage,
            created_at,
            sales!inner ( price )
          `)
          .eq("id_realtor", realtorId)
          .gte("created_at", yearStart);

        if (data) {
          const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
          const grouped = months.map(name => ({ name, ventas: 0, comisiones: 0 }));

          data.forEach((item: any) => {
            const dateObj = new Date(item.created_at);
            const monthIndex = dateObj.getUTCMonth();
            
            const salePrice = item.sales?.price || 0;
            const commission = (salePrice * (item.percentage || 0)) / 100;

            if (monthIndex >= 0 && monthIndex < 12) {
              grouped[monthIndex].ventas += salePrice;
              grouped[monthIndex].comisiones += commission;
            }
          });

          setChartData(grouped);
        }
      } catch (e) {
        console.error("Error en gráfica:", e);
      } finally {
        setLoading(false);
      }
    };

    if (realtorId) fetchSalesData();
  }, [realtorId, supabase]);
if (!mounted) return null;
  if (loading) return <div className="h-96 w-full animate-pulse bg-gray-100 dark:bg-white/5 rounded-2xl" />;

  return (
    <div className="w-full bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Flujo de Ventas</h3>
      </div>
      {/* Forzamos un alto real aquí */}
      <div className="min-h-[300px] w-full flex items-center justify-center">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                {/* <linearGradient id="colorComisiones" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient> */}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888815" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888', fontSize: 12 }} 
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'solid 1px', borderRadius: '12px', color: '#ffffff7e' }}
                formatter={(value: any) => [` ${Number(value).toLocaleString()} pts`]}
              />
              <Area 
                type="monotone" 
                dataKey="ventas" 
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorVentas)" 
                animationDuration={1000}
              />
              {/* <Area 
                type="monotone" 
                dataKey="comisiones" 
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorComisiones)" 
                animationDuration={1200}
              /> */}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-gray-500">No hay datos de ventas para este año</div>
        )}
      </div>
    </div>
  );
}