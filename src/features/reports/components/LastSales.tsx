"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/config";
import { Card } from "@/shared/components/cards/card";
import { TitleCard } from "@/shared/components/text/TitleCard";
import { HiOutlineBadgeCheck, HiOutlineTrendingUp } from "react-icons/hi";

interface SaleRecord {
  id: string;
  percentage: number;
  created_at: string;
  sales: {
    price: number;
    id_property: string;
    // Si la tabla properties tiene 'title' o 'name', puedes traerlo así:
    // properties: { title: string } 
  } | null;
}

export default function LastSales() {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const formatNumber = (val: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(val);

  useEffect(() => {
    async function fetchSales() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Consultamos details_sale para filtrar por el realtor actual
        const { data, error } = await supabase
          .from("details_sale")
          .select(`
            id,
            percentage,
            created_at,
            sales (
              price,
              id_property
            )
          `)
          .eq("id_realtor", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (data) setSales(data as any);
      } catch (error) {
        console.error("Error loading sales:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, [supabase]);

  return (
    <Card className="p-6 h-full">
      <TitleCard title="Últimas ventas realizadas" />

      <div className="mt-6 space-y-4">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-14 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
          ))
        ) : sales.length > 0 ? (
          sales.map((item) => {
            const saleInfo = Array.isArray(item.sales) ? item.sales[0] : item.sales;
            const totalSalePrice = saleInfo?.price || 0;
            const myCommission = totalSalePrice * (item.percentage / 100);

            return (
              <div 
                key={item.id}
                className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <HiOutlineBadgeCheck className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID Propiedad: {saleInfo?.id_property?.split('-')[0] || '---'}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Comisión: {item.percentage}%
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-emerald-600 dark:text-emerald-400">
                    <HiOutlineTrendingUp className="text-xs" />
                    <p className="text-sm font-bold">
                      $ {formatNumber(myCommission)}
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Venta total: $ {formatNumber(totalSalePrice)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500 text-sm">No has registrado ventas todavía.</p>
          </div>
        )}
      </div>
    </Card>
  );
}