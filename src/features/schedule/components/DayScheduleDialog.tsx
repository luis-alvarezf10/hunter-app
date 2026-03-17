'use client';

import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { BaseDialog } from "@/shared/components/dialogs/BaseDialog";
import { createPortal } from "react-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";

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
  isOpen: boolean;
  onClose: () => void;
  schedules: ScheduleItem[];
  date: string;
}

export default function DayScheduleDialog({ isOpen, onClose, schedules, date }: Props) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pendiente': 'bg-amber-500',
      'Confirmada': 'bg-green-500',
      'Realizada': 'bg-emerald-500',
      'Cancelada': 'bg-red-500 ',
      'No asistió': 'bg-gray-500',
      'Pospuesta': 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300';
  };

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const dialogContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <BaseDialog className="max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
            {formatDate(date)}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {schedules.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No hay citas programadas para este día
            </p>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div 
                  key={schedule.id}
                  className="border border-gray-300/50 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md  rounded-2xl p-4 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                      {schedule.client_name}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(schedule.status)}`}>
                      {schedule.status}
                    </span>
                  </div>
                  
                  {schedule.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
                      {schedule.description}
                    </p>
                  )}
                  
                  {schedule.property && (
                    <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-white/5 rounded-2xl p-3">
                      <HiOutlineLocationMarker className="text-primary" />
                      <div>
                        <div className="font-medium">{schedule.property.name}</div>
                        <div>{schedule.property.address}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-300/50 dark:border-white/10">
        <ActionButton
          onClick={onClose}
          variant="danger"
          iconVariant="close"
          size="sm"
        >
          Cerrar
        </ActionButton>
        </div>
      </BaseDialog>
    </div>
  );
  return createPortal(dialogContent, document.body);
}
