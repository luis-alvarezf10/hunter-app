"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/config";
import {
  StatCards,
  SalesChart,
  AppointmentsList,
  SalesTable,
} from "../components";
import { FeedbackDialog } from "../components/dialogs/FeedbackDialog"; // Asegúrate de crearlo

export function DashboardPage() {
  const [nickname, setNickname] = useState("");
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadUserData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Cargar datos del perfil
        const { data: stakeholderData } = await supabase
          .from("stakeholders")
          .select("nickname, name, ui_color")
          .eq("id", user.id)
          .single();

        if (stakeholderData) {
          setNickname(stakeholderData.nickname || stakeholderData.name || "");
        }

        // 2. Buscar citas pasadas sin reporte (Status 'Pendiente')
        // Usamos .lte para incluir citas de hoy que ya pasaron de hora si prefieres
        const { data: scheduleData } = await supabase
          .from("schedule")
          .select(
            `
              *,
              property:properties (
                title,
                address,
                id_type_offer,
                details_properties (
                  bedrooms,
                  bathrooms,
                  area_sqm,
                  price,
                  period,
                  is_furnished,
                  half_bath,
                  lot_size,
                  parking_spots
                )
              )
            `,
          ) // Asegúrate de que los nombres de columnas coincidan exactamente en la tabla 'properties'
          .lt("date", new Date().toISOString().split("T")[0])
          .eq("status", "Pendiente")
          .eq("id_advisdor", user.id);

        if (scheduleData && scheduleData.length > 0) {
          setPendingAppointments(scheduleData);
          setShowFeedback(true);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }

    loadUserData();
  }, [supabase]);

  return (
    <div className="p-8 space-y-8">
      {/* Modal de Feedback (Solo aparece si hay citas pendientes) */}
      {showFeedback && (
        <FeedbackDialog
          appointments={pendingAppointments}
          onComplete={() => setShowFeedback(false)}
        />
      )}

      <h3 className="text-lg lg:text-2xl font-medium text-gray-900 dark:text-white">
        Hola, <span className="text-wine-red font-bold">{nickname}</span>{" "}
        ¡bienvenido de nuevo! 👋
      </h3>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <AppointmentsList />
      </div>

      <SalesTable />
    </div>
  );
}
