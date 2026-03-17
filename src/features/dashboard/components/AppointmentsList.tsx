import { createClient } from "@/core/config";
import DayScheduleDialog from "@/features/schedule/components/DayScheduleDialog";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { BadgeButton } from "@/shared/components/buttons/BadgeButton";
import { Card } from "@/shared/components/cards/card";
import { TitleCard } from "@/shared/components/text/TitleCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HiOutlineChevronRight,
  HiOutlineCalendar,
  HiOutlinePlus,
} from "react-icons/hi";

export function AppointmentsList() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);

  // --- Estados para el Diálogo ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .gte("date", now)
        .order("date", { ascending: true })
        .eq("status", "Pendiente");
      // Quitamos el .limit(3) si quieres que el modal pueda mostrar todas las del día

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica del Diálogo ---
  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const getSelectedDaySchedules = () => {
    if (!selectedDate) return [];
    return appointments.filter((apt) => apt.date === selectedDate);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate() + 1,
      month: date
        .toLocaleDateString("es-ES", { month: "short" })
        .toUpperCase()
        .replace(".", ""),
      fullDate: dateString, // La guardamos para el filtro
    };
  };

  const formatTime = (time: string) => {
    if (!time) return "Sin hora";
    let [hoursStr, minutes] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    if (isNaN(hours)) return "--:--";
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Card className="p-6" showEffect={appointments.length > 0}>
        <div className="flex flex-wrap items-center justify-between mb-8">
          <TitleCard title="Próximas citas" />
          <BadgeButton
            onClick={() => router.push("/schedule")}
            size="sm"
            variant="red"
            rightIcon={<HiOutlineChevronRight />}
          >
            Ver todas
          </BadgeButton>
        </div>

        <div className="space-y-4 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <p className="text-sm">Cargando...</p>
            </div>
          ) : (
            appointments.slice(0, 3).map((apt, index) => {
              // Mostramos solo 3 en la lista
              const { day, month, fullDate } = formatDate(apt.date);
              return (
                <div
                  key={apt.id || index}
                  onClick={() => handleDayClick(fullDate)}
                  className="group/item flex items-center gap-4 p-3 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-white/10"
                >
                  <div>
                    <div className="flex flex-col items-center justify-center min-w-[56px] h-[56px] bg-white dark:bg-[#242424] shadow-sm rounded-xl border border-gray-100 dark:border-white/5">
                      <span className="text-[10px] font-bold text-red-600 leading-none">
                        {month}
                      </span>
                      <span className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                        {day}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-400 text-center font-medium">
                      {formatTime(apt.time)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        • {apt.client_name}
                      </span>
                    </div>
                  </div>

                  <HiOutlineChevronRight className="text-gray-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                </div>
              );
            })
          )}
        </div>
        <ActionButton
          variant="dotted"
          onClick={() => router.push("/schedule/add")}
          iconVariant="add"
        >
          Agendar nueva cita
        </ActionButton>
      </Card>

      {/* Renderizado del Diálogo */}
      <DayScheduleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        schedules={getSelectedDaySchedules()}
        date={selectedDate || ""}
      />
    </>
  );
}
