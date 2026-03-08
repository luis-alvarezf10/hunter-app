'use client';

import { useState } from 'react';
import DayScheduleDialog from './DayScheduleDialog';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi';

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
      const firstScheduleDate = new Date(schedules[0].date + 'T00:00:00');
      setCurrentDate(new Date(firstScheduleDate.getFullYear(), firstScheduleDate.getMonth(), 1));
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pendiente': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
      'Confirmada': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      'Realizada': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
      'Cancelada': 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
      'No asistió': 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700',
      'Pospuesta': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
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
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const filtered = schedules.filter(s => {
      // Normalize both dates to compare only YYYY-MM-DD
      const scheduleDate = s.date?.split('T')[0]; // In case it comes with time
      return scheduleDate === dateStr;
    });
    return filtered;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setIsDialogOpen(true);
  };

  const getSelectedDaySchedules = () => {
    if (!selectedDate) return [];
    return schedules.filter(s => {
      const scheduleDate = s.date?.split('T')[0];
      return scheduleDate === selectedDate;
    });
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="flex  justify-between items-center mb-4 gap-3">
        <button onClick={previousMonth} className=" px-4 py-2 bg-white/90 dark:bg-[#1a1a1a] rounded-xl dark:border dark:border-white/10 shadow-sm">
          <HiOutlineChevronDoubleLeft />
        </button>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <h2 className="text-lg sm:text-xl font-semibold capitalize text-gray-900 dark:text-white text-center">
            {monthName}
          </h2>
        </div>
        <button onClick={nextMonth} className="px-4 py-2 bg-white/90 dark:bg-[#1a1a1a] rounded-xl dark:border dark:border-white/10 shadow-sm">
          <HiOutlineChevronDoubleRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 bg-white/90 dark:bg-[#1a1a1a] dark:border dark:border-white/10 p-2 rounded-2xl  shadow-sm">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2 text-xs sm:text-sm">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}

        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="border border-gray-200 dark:border-gray-700 rounded p-1 sm:p-2 bg-gray-50 dark:bg-gray-800/50" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const daySchedules = getSchedulesForDate(day);
          const isToday = 
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`rounded-2xl p-1 sm:p-2 min-h-[50px] sm:min-h-[80px] cursor-pointer transition-all hover:shadow-md flex items-center justify-center ${
                isToday 
                  ? 'bg-gradient-to-b from-secondary to-primary dark:to-wine-red/50 text-white' 
                  : 'bg-background'
              }`}
            >
              <div className="font-semibold">{day}</div>
            </div>
          );
        })}
      </div>

      {/* Day Schedule Dialog */}
      <DayScheduleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        schedules={getSelectedDaySchedules()}
        date={selectedDate || ''}
      />
    </div>
  );
}
