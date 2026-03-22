"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/core/config/supabase";
import { useRouter } from "next/navigation";
import { TitleView } from "@/shared/components/text/TitleView";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import ViewToggle from "@/shared/components/buttons/ViewToggleButton";
import { LoadSpin } from "@/shared/components/spins/LoadSpin";
import { Card } from "@/shared/components/cards/card";

interface realtorItem {
  id: string;
  national_id: string | null;
  name: string;
  lastname: string;
  nickname: string;
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
          realtor:stakeholders (
            national_id,
            name,
            lastname,
            nickname
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
            national_id: infoPersonal?.national_id || "Sin ID",
            name: infoPersonal?.name || "Sin nombre",
            lastname: infoPersonal?.lastname || "",
            nickname: infoPersonal?.nickname || "",
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
          {/* Contenedor del Toggle: crece en móvil pero se ajusta en escritorio */}
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
        <div>
          {realtors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {realtors.map((realtor) => (
                <Card
                  key={realtor.id}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {realtor.name} {realtor.lastname}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {realtor.nickname}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Cédula:</span>{" "}
                        {realtor.national_id}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Empresa:</span>{" "}
                        {realtor.company?.name || "No asignada"}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Registrado:</span>{" "}
                        {new Date(realtor.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No hay agentes disponibles.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>chao</div>
      )}
    </div>
  );
}
