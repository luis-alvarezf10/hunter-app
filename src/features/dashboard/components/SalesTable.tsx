export function SalesTable() {
  const sales = [
    {
      time: 'Hace 15 min',
      seller: 'Sofia Martínez',
      initials: 'SM',
      color: 'emerald',
      client: 'Grupo Sanitas',
      amount: '$12,450.00',
      status: 'Completado',
      statusColor: 'emerald',
    },
    {
      time: 'Hace 2 horas',
      seller: 'Jorge Ríos',
      initials: 'JR',
      color: 'blue',
      client: 'AutoPartes S.L.',
      amount: '$8,200.00',
      status: 'Enviado',
      statusColor: 'blue',
    },
    {
      time: 'Hoy, 10:45 AM',
      seller: 'Ana Poveda',
      initials: 'AP',
      color: 'amber',
      client: 'Consultores X',
      amount: '$15,000.00',
      status: 'Pendiente',
      statusColor: 'amber',
    },
    {
      time: 'Hoy, 09:20 AM',
      seller: 'David León',
      initials: 'DL',
      color: 'primary',
      client: 'Hogar & Estilo',
      amount: '$4,100.00',
      status: 'Completado',
      statusColor: 'emerald',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      emerald: 'bg-emerald-100 text-emerald-700',
      blue: 'bg-blue-100 text-blue-700',
      amber: 'bg-amber-100 text-amber-700',
      primary: 'bg-[#6b1e2e]/10 text-[#6b1e2e]',
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1c2b36]">
            Ventas Recientes del Equipo
          </h3>
          <p className="text-sm text-gray-500">Últimas 24 horas de actividad</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-[#1c2b36] text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
            Filtrar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
            <tr>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Vendedor</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4 text-right">Monto</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sales.map((sale, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">{sale.time}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-7 rounded-full flex items-center justify-center text-[10px] font-bold ${getColorClasses(
                        sale.color
                      )}`}
                    >
                      {sale.initials}
                    </div>
                    <span className="text-sm font-bold text-[#1c2b36]">
                      {sale.seller}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {sale.client}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-[#1c2b36] text-right">
                  {sale.amount}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getColorClasses(
                      sale.statusColor
                    )}`}
                  >
                    {sale.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-[#6b1e2e] transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 flex items-center justify-center border-t border-gray-100">
        <button className="text-sm font-bold text-[#6b1e2e] hover:underline">
          Cargar más registros
        </button>
      </div>
    </div>
  );
}
