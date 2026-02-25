'use client';

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
      'Pendiente': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
      'Confirmada': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      'Realizada': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
      'Cancelada': 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
      'No asistió': 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300',
      'Pospuesta': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white dark:bg-[#1a1a1a] rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
            Citas del {formatDate(date)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {schedule.client_name}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(schedule.status)}`}>
                      {schedule.status}
                    </span>
                  </div>
                  
                  {schedule.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {schedule.description}
                    </p>
                  )}
                  
                  {schedule.property && (
                    <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded p-2">
                      <span>📍</span>
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
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
