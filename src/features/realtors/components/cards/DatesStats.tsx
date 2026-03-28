"use client";

import { useEffect, useState, useMemo } from "react"; // Añadimos useMemo
import { createClient } from "@/core/config";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";

export default function DatesStats({ realtorId }: { realtorId: string }) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // Para evitar líos de SSR
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const fetchChartData = async () => {
      try {
        const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();
        const { data, error } = await supabase
          .from("schedule")
          .select("date, status")
          .eq("id_realtor", realtorId)
          .in("status", ["Realizada", "Cancelada"])
          .gte("date", yearStart);

        if (data) {
          const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
          const grouped = months.map(name => ({ name, realizada: 0, cancelada: 0 }));

          data.forEach(item => {
            const dateObj = new Date(item.date);
            const monthIndex = dateObj.getUTCMonth(); 
            const status = item.status?.trim();
            
            if (monthIndex >= 0 && monthIndex < 12) {
              if (status === "Realizada") grouped[monthIndex].realizada++;
              if (status === "Cancelada") grouped[monthIndex].cancelada++;
            }
          });
          setChartData(grouped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (realtorId) fetchChartData();
  }, [realtorId, supabase]);

  // Si no está montado en el cliente, no renderizamos la gráfica
  if (!mounted) return null;

  if (loading) return <div className="h-[350px] w-full animate-pulse bg-gray-100 dark:bg-white/5 rounded-2xl" />;

  return (
    <div className="w-full bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
      <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">
        Rendimiento de Citas este {new Date().getFullYear()}
      </h3>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip 
              cursor={{ fill: '#88888810' }}
              contentStyle={{ backgroundColor: '#1a1a1a', border: 'solid 1px', borderRadius: '8px', color: '#ffffff7e' }}
            />
            <Legend verticalAlign="bottom" align="right" />
            <Bar dataKey="realizada" name="Realizadas" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="cancelada" name="Canceladas" fill="#fb2c36" radius={[6, 6, 0, 0]}  />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}