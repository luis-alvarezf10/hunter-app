"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/core/config/supabase";
import { useRouter } from "next/navigation";
import { ScheduleCalendar, ScheduleList } from "../components";
import { TitleView } from "@/shared/components/text/TitleView";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { HiOutlinePlusCircle } from "react-icons/hi";
import ViewToggle from "@/shared/components/buttons/ToggleButtons";
import { LoadSpin } from "@/shared/components/spins/LoadSpin";
import { div } from "framer-motion/client";

interface ScheduleItem {
  id: string;
  id_advisor: string;
  id_property: string;
  description: string;
  client_name: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
  property?: {
    name: string;
    address: string;
  };
}

export default function SchedulePage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "list">("calendar");

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 1. Definimos la consulta.
      // Usamos 'id_advisdor' porque así está en tu tabla.
      const { data: fetchedData, error: fetchError } = await supabase
        .from("schedule")
        .select(
          `
        *,
        property:properties (
          title, 
          address
        )
      `,
        )
        .eq("id_advisdor", user.id)
        .order("date", { ascending: true });

      if (fetchError) throw fetchError;

      // 2. Transformamos los datos con tipado explícito para evitar el error de 'any'
      const transformedData: ScheduleItem[] = (fetchedData || []).map(
        (item: any) => {
          return {
            id: item.id,
            id_advisor: item.id_advisdor, // Mapeamos el typo de la DB al campo de tu interfaz
            id_property: item.id_property,
            description: item.description,
            client_name: item.client_name,
            date: item.date,
            time: item.time,
            status: item.status,
            created_at: item.created_at,
            property: item.property
              ? {
                  name: item.property.title, // Aquí title de la DB pasa a ser name en tu UI
                  address: item.property.address,
                }
              : undefined,
          };
        },
      );

      setSchedules(transformedData);
    } catch (err) {
      console.error("Error fetching schedules:", err);
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
          title="Agenda"
          subtitle="Gestiona tus citas de este mes aquí"
        />

        {/* Contenedor de acciones: ocupa todo el ancho en móvil */}
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto md:justify-end">
          {/* Contenedor del Toggle: crece en móvil pero se ajusta en escritorio */}
          <div className="w-full md:w-auto">
            <ViewToggle
              activeMode={view === "calendar" ? "Calendario" : "Lista"}
              firstButton="Calendario"
              onClickFirst={() => setView("calendar")}
              secondButton="Lista"
              onClickSecond={() => setView("list")}
            />
          </div>

          <ActionButton
            className="w-full md:w-auto justify-center" // Centramos el contenido del botón en móvil
            onClick={() => router.push("/schedule/add")}
            iconVariant="add"
          >
            Nueva cita
          </ActionButton>
        </div>
      </div>
      {view === "calendar" ? (
        <ScheduleCalendar schedules={schedules} onRefresh={fetchSchedules} />
      ) : (
        <ScheduleList schedules={schedules} onRefresh={fetchSchedules} />
      )}
    </div>
  );
}
