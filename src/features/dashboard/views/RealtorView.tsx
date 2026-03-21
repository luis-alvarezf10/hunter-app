import { useEffect, useState } from "react";
import { AppointmentsList } from "../components/AppointmentsList";
import { SalesChart } from "../components/SalesChart";
import { SalesTable } from "../components/SalesTable";
import { StatCards } from "../components/StatCards";
import { useUser } from "@/core/context/UserContext";
import { createClient } from "@/core/config";
import { FeedbackDialog } from "../components/dialogs/FeedbackDialog";

export function RealtorView() {
  const { role, nickname, user, loading: userLoading } = useUser();
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadPendingAppointments() {
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
    <>
      {role === "realtor" && showFeedback && (
        <FeedbackDialog
          appointments={pendingAppointments}
          onComplete={() => setShowFeedback(false)}
        />
      )}
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <AppointmentsList />
      </div>

      <SalesTable />
    </>
  );
}
