"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/config";
import { Card } from "@/shared/components/cards/card";
import { TitleCard } from "@/shared/components/text/TitleCard";
import { HiOutlineUser, HiOutlineTag } from "react-icons/hi";

interface Offer {
  id: number;
  client_name: string;
  price: number;
  status: string;
  created_at: string;
}

export default function LastOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Reutilizamos tu formato de número limpio
  const formatNumber = (val: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(val);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("offers")
          .select("id, client_name, price, status, created_at")
          .eq("id_realtor", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (data) setOffers(data);
      } catch (error) {
        console.error("Error loading offers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, [supabase]);

  // Helper para colores de status
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "aceptada": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "pendiente": return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
      case "rechazada": return "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  return (
    <Card className="p-6 h-full">
      <TitleCard title="Últimas ofertas realizadas" />
      
      <div className="mt-6 space-y-4">
        {loading ? (
          // Skeleton simple
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-gray-100 dark:bg-white/10 animate-pulse rounded-lg" />
          ))
        ) : offers.length > 0 ? (
          offers.map((offer) => (
            <div 
              key={offer.id} 
              className="flex items-center justify-between p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                  <HiOutlineUser className="text-xl" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                    {offer.client_name || "Cliente sin nombre"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(offer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  $ {formatNumber(offer.price)}
                </p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${getStatusColor(offer.status)}`}>
                  {offer.status || "S/D"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-4">No hay ofertas recientes.</p>
        )}
      </div>
    </Card>
  );
}