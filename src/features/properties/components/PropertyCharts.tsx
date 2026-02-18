export function PropertyCharts() {
  // Datos de ejemplo para las gráficas
  const statusData = [
    { label: 'Disponibles', value: 45, color: '#10b981', percentage: 45 },
    { label: 'Reservadas', value: 30, color: '#f59e0b', percentage: 30 },
    { label: 'Vendidas', value: 25, color: '#6b7280', percentage: 25 },
  ];

  const typeData = [
    { label: 'Residencias', value: 50, color: '#3b82f6', percentage: 50 },
    { label: 'Terrenos', value: 30, color: '#22c55e', percentage: 30 },
    { label: 'Comerciales', value: 20, color: '#a855f7', percentage: 20 },
  ];

  // Función para crear el path del segmento de la torta
  const createPieSlice = (startAngle: number, endAngle: number) => {
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
  };

  const renderPieChart = (data: typeof statusData) => {
    let currentAngle = -90; // Empezar desde arriba

    return (
      <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
        {data.map((item, index) => {
          const sliceAngle = (item.percentage / 100) * 360;
          const path = createPieSlice(currentAngle, currentAngle + sliceAngle);
          currentAngle += sliceAngle;

          return (
            <g key={index}>
              <path
                d={path}
                fill={item.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              >
                <title>{`${item.label}: ${item.value} (${item.percentage}%)`}</title>
              </path>
            </g>
          );
        })}
        {/* Círculo blanco en el centro para efecto donut */}
        <circle cx="100" cy="100" r="50" fill="white" className="dark:fill-[#1a1a1a]" />
      </svg>
    );
  };

  return (
    <div className="">
      {/* Gráfica de Tipo */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">
          Propiedades por Tipo
        </h3>
        
        <div className="flex flex-col items-center">
          {renderPieChart(typeData)}
          
          {/* Leyenda */}
          <div className="mt-6 space-y-3 w-full">
            {typeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {item.value} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
