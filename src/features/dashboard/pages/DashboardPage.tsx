"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/core/context/UserContext";
import { createClient } from "@/core/config";
import {
  StatCards,
  SalesChart,
  AppointmentsList,
  SalesTable,
} from "../components";
import { FeedbackDialog } from "../components/dialogs/FeedbackDialog"; // Asegúrate de crearlo

export function DashboardPage() {
  const { role, nickname, user, loading: userLoading } = useUser();
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadPendingAppointments() {
      console.log("Context State:", { role, nickname, userLoading });
      if (userLoading) return;
      if (role !== "realtor" || !user) {
        console.log("No es realtor o no hay user, saltando búsqueda de citas.");
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // 2. Buscamos citas pasadas sin reporte
        const { data: scheduleData } = await supabase
          .from("schedule")
          .select(
            `
              *,
              property:properties (
                id, title, address,
                details_properties (*)
              )
            `,
          )
          .lt("date", new Date().toISOString().split("T")[0])
          .eq("status", "Pendiente")
          .eq("id_realtor", user.id);

        if (scheduleData && scheduleData.length > 0) {
          setPendingAppointments(scheduleData);
          setShowFeedback(true);
        }
      } catch (error) {
        console.error("Error loading pending appointments:", error);
      }
    }

    loadPendingAppointments();
  }, [supabase, role, userLoading]);

  return (
    <div className="p-8 space-y-8">
      {role === "realtor" && showFeedback && (
        <FeedbackDialog
          appointments={pendingAppointments}
          onComplete={() => setShowFeedback(false)}
        />
      )}

      <h3 className="text-lg lg:text-2xl font-medium text-gray-900 dark:text-white">
        Hola, <span className="text-wine-red font-bold">{nickname}</span>{" "}
        ¡bienvenido de nuevo! 👋
      </h3>

      {role === "realtor" && (
        <>
          <StatCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SalesChart />
            </div>
            <AppointmentsList />
          </div>

          <SalesTable />
        </>
      )}
    </div>
  );
}
