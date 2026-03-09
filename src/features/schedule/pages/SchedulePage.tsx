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
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("Current user:", user);

      if (!user) {
        console.log("No user found");
        return;
      }

      // First, get schedules without the join
      const { data: schedulesData, error: schedulesError } = await supabase
        .from("schedule")
        .select("*")
        .eq("id_advisdor", user.id)
        .order("date", { ascending: true });

      if (schedulesError) {
        console.error("Supabase error:", schedulesError);
        throw schedulesError;
      }

      console.log("Raw schedules from Supabase:", schedulesData);

      // Then, get properties for each schedule
      const transformedData = await Promise.all(
        (schedulesData || []).map(async (schedule) => {
          if (schedule.id_property) {
            const { data: propertyData } = await supabase
              .from("properties")
              .select("name, address")
              .eq("id", schedule.id_property)
              .single();

            return {
              ...schedule,
              property: propertyData || undefined,
            };
          }
          return schedule;
        }),
      );

      console.log("Schedules loaded:", transformedData);
      console.log("Total schedules:", transformedData.length);
      setSchedules(transformedData);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoadSpin/>
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
