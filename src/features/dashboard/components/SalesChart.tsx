export function SalesChart() {
  const months = [
    { name: 'Ene', height: 40 },
    { name: 'Feb', height: 60 },
    { name: 'Mar', height: 55 },
    { name: 'Abr', height: 80 },
    { name: 'May', height: 95, value: '$124.5k', active: true },
    { name: 'Jun', height: 70 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-[#1c2b36]">
            Análisis Estratégico de Ventas
          </h3>
          <p className="text-sm text-gray-500">Rendimiento mensual de ingresos</p>
        </div>
        <select className="text-sm border-gray-200 rounded-lg bg-gray-50 text-gray-600 focus:ring-[#6b1e2e] focus:border-[#6b1e2e]">
          <option>Últimos 6 meses</option>
          <option>Último año</option>
        </select>
      </div>

      <div className="h-64 relative flex items-end justify-between px-2">
        {months.map((month, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-center flex-1"
          >
            <div
              className={`w-8 lg:w-12 rounded-t transition-all ${
                month.active
                  ? 'bg-[#6b1e2e]/80'
                  : 'bg-gray-100 group-hover:bg-[#6b1e2e]/20'
              }`}
              style={{ height: `${month.height}%` }}
            >
              {month.value && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1c2b36] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                  {month.value}
                </div>
              )}
            </div>
            <span
              className={`text-xs font-bold mt-3 ${
                month.active ? 'text-[#6b1e2e]' : 'text-gray-400'
              }`}
            >
              {month.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
