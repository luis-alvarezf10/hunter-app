"use client";

import { useState } from "react";
import DayScheduleDialog from "./DayScheduleDialog";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";

interface ScheduleItem {
  id: string;
  description: string;
  client_name: string;
  date: string;
  status: string;
  property?: {
    name: string;
    address: string;
  };
}

interface Props {
  schedules: ScheduleItem[];
  onRefresh: () => void;
}

export default function ScheduleCalendar({ schedules }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Navigate to first schedule month if available
  const navigateToFirstSchedule = () => {
    if (schedules.length > 0) {
      const firstScheduleDate = new Date(schedules[0].date + "T00:00:00");
      setCurrentDate(
        new Date(
          firstScheduleDate.getFullYear(),
          firstScheduleDate.getMonth(),
          1,
        ),
      );
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getSchedulesForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const filtered = schedules.filter((s) => {
      // Normalize both dates to compare only YYYY-MM-DD
      const scheduleDate = s.date?.split("T")[0]; // In case it comes with time
      return scheduleDate === dateStr;
    });
    return filtered;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("es-ES", {
    month: "long",
  });
  const year = currentDate.getFullYear();

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setIsDialogOpen(true);
  };

  const getSelectedDaySchedules = () => {
    if (!selectedDate) return [];
    return schedules.filter((s) => {
      const scheduleDate = s.date?.split("T")[0];
      return scheduleDate === selectedDate;
    });
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="flex items-center justify-center w-full">
        <span className="text-sm text-gray-500 dark:text-gray-300 font-semibold">{year}</span>
      </div>
      <div className="flex  justify-between items-center mb-4 gap-3">
        <button
          onClick={previousMonth}
          className=" px-4 py-2 bg-white/90 dark:bg-[#1a1a1a] rounded-xl dark:border dark:border-white/10 shadow-sm"
        >
          <HiOutlineChevronDoubleLeft />
        </button>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <h2 className="text-lg sm:text-xl font-semibold capitalize text-gray-900 dark:text-white text-center">
            {monthName}
          </h2>
        </div>
        <button
          onClick={nextMonth}
          className="px-4 py-2 bg-white/90 dark:bg-[#1a1a1a] rounded-xl dark:border dark:border-white/10 shadow-sm"
        >
          <HiOutlineChevronDoubleRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 bg-white/90 dark:bg-[#1a1a1a] dark:border dark:border-white/10 p-2 rounded-2xl  shadow-sm">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2 text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}

        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center justify-center text-gray-400 dark:text-gray-600 py-2 font-black"
          > 
          -
          </div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const daySchedules = getSchedulesForDate(day);
          const hasSchedules = daySchedules.length > 0;
          const scheduleCount = daySchedules.length;

          const isToday =
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
        relative rounded-2xl p-1 sm:p-2 min-h-[50px] sm:min-h-[80px] 
        cursor-pointer transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-1
        ${
          isToday
            ? "bg-gradient-to-b from-secondary to-primary dark:to-wine-red text-white shadow-md z-10"
            : hasSchedules
              ? "text-white bg-gradient-to-b from-gray-300 dark:from-gray-400 to-gray-400 dark:to-white/30" // Gris más suave para que el contador resalte
              : "bg-background text-gray-600 dark:text-gray-400 border border-transparent"
        }
      `}
            >
              <span className="text-sm sm:text-base font-bold">{day}</span>
              {hasSchedules && (
                <div
                  className={`
          absolute -top-1 -right-1 h-4 w-4 md:h-6 md:w-6 flex items-center justify-center rounded-full font-bold shadow-sm 
          ${
            isToday
              ? "bg-white text-secondary " // En el día de hoy, contador blanco con texto de color
              : "bg-secondary text-white" // En días normales, el estilo que ya tenías
          }
          text-xs md:text-sm
        `}
                >
                  {scheduleCount > 9 ? "9+" : scheduleCount}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Day Schedule Dialog */}
      <DayScheduleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        schedules={getSelectedDaySchedules()}
        date={selectedDate || ""}
      />
    </div>
  );
}
