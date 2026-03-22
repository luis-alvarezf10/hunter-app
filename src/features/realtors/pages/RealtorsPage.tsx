"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/core/config/supabase";
import { useRouter } from "next/navigation";
import { TitleView } from "@/shared/components/text/TitleView";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import ViewToggle from "@/shared/components/buttons/ViewToggleButton";
import { LoadSpin } from "@/shared/components/spins/LoadSpin";
import { Card } from "@/shared/components/cards/card";
import GridView from "../views/GridView";

interface realtorItem {
  id: string;
  national_id: string | null;
  name: string;
  lastname: string;
  nickname: string;
  ui_color: string;
  created_at: string;
  company?: {
    name: string;
  };
}

export default function RealtorsPage() {
  const router = useRouter();
  const [realtors, setRealtors] = useState<realtorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchRealtors();
  }, []);

  const fetchRealtors = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      const { data: fetchedData, error: fetchError } = await supabase
        .from("realtors")
        .select(
          `
          id,
          created_at,
          realtor:stakeholders (
            national_id,
            name,
            lastname,
            nickname,
            ui_color
          ),
          company:companies (
            name
          )
          `,
        )
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      // 2. Transformamos los datos con tipado explícito para evitar el error de 'any'
      const transformedData: realtorItem[] = (fetchedData || []).map(
        (item: any) => {
          const infoPersonal = item.realtor;

          return {
            id: item.id,
            created_at: item.created_at,
            national_id: infoPersonal?.national_id || "",
            name: infoPersonal?.name || "Sin nombre",
            lastname: infoPersonal?.lastname || "",
            nickname: infoPersonal?.nickname || "",
            ui_color: infoPersonal?.ui_color || "",
            company: item.company ? { name: item.company.name } : undefined,
          };
        },
      );

      setRealtors(transformedData);
    } catch (err) {
      console.error("Error fetching realtors:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoadSpin />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <TitleView
          title="Agentes"
          subtitle="Visualiza los datos y estadísticas de todos los agentes inmobiliarios."
        />

        {/* Contenedor de acciones: ocupa todo el ancho en móvil */}
        <div className="flex md:gap-2 w-full md:w-auto md:justify-end">
          <div className="w-full md:w-auto">
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          <ActionButton
            className="w-full md:w-auto justify-center" // Centramos el contenido del botón en móvil
            onClick={() => router.push("")}
            iconVariant="add"
          >
            Crear Agente
          </ActionButton>
        </div>
      </div>
      {viewMode === "grid" ? (
          <GridView items={realtors} onRefresh={fetchRealtors}/>
      ) : (
        <div>chao</div>
      )}
    </div>
  );
}
