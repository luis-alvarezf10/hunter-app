export function AppointmentsList() {
  const appointments = [
    {
      time: '14:30',
      day: 'Hoy',
      title: 'Cierre Proyecto Alfa',
      client: 'Logística S.A.',
      priority: true,
    },
    {
      time: '16:00',
      day: 'Hoy',
      title: 'Seguimiento Lead',
      client: 'Inmobiliaria Real',
      priority: false,
    },
    {
      time: '09:15',
      day: 'Mañ',
      title: 'Demo Herramienta',
      client: 'Tecnologías Global',
      priority: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#1c2b36]">Próximas Citas</h3>
        <button className="text-[#6b1e2e] text-sm font-bold hover:underline">
          Ver todas
        </button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {appointments.map((apt, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border-l-4 ${
              apt.priority ? 'border-[#6b1e2e]' : 'border-gray-200'
            }`}
          >
            <div className="bg-gray-100 rounded-lg p-2 text-center min-w-[50px]">
              <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">
                {apt.day}
              </p>
              <p className="text-sm font-bold text-[#1c2b36]">{apt.time}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1c2b36]">{apt.title}</p>
              <p className="text-xs text-gray-500">Cliente: {apt.client}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm font-medium hover:border-[#6b1e2e] hover:text-[#6b1e2e] transition-colors flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm">add</span>
        Nueva Cita
      </button>
    </div>
  );
}
