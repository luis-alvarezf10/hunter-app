"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/core/config/supabase";
import { useRouter } from "next/navigation";
import { TitleView } from "@/shared/components/text/TitleView";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import ViewToggle from "@/shared/components/buttons/ViewToggleButton";
import { LoadSpin } from "@/shared/components/spins/LoadSpin";
import GridView from "../views/GridView";
import { SearchBar } from "@/shared/components/inputs/SearchBar";

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
  const [searchTerm, setSearchTerm] = useState("");

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
  const filteredRealtors = realtors.filter((realtor) => {
  const search = searchTerm.toLowerCase();
  
  // Buscamos en nombre, apellido, nickname o cédula
  return (
    realtor.name.toLowerCase().includes(search) ||
    realtor.lastname.toLowerCase().includes(search) ||
    realtor.nickname.toLowerCase().includes(search) ||
    realtor.national_id?.toLowerCase().includes(search)
  );
});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoadSpin />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TitleView
            title="Agentes"
            subtitle="Visualiza los datos y estadísticas de todos los agentes inmobiliarios registrados."
          />
        <ActionButton
          className="w-full md:w-auto justify-center" 
          onClick={() => router.push("/realtors/add")}
          iconVariant="add"
        >
          Crear Agente
        </ActionButton>
      </div>
      <div className="flex gap-3 items-center justify-between">
        <div className="w-full md:w-1/2">
          <SearchBar
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            placeholder="Buscar por nombre, apodo o cedula"
          />
        </div>
        <div className="hidden md:block ">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>
      {viewMode === "grid" ? (
        <GridView items={filteredRealtors} onRefresh={fetchRealtors} />
      ) : (
        <div>chao</div>
      )}
    </div>
  );
}
