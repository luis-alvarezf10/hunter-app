import { HiOutlineHome, HiOutlineOfficeBuilding, HiOutlineMap } from 'react-icons/hi';

interface PropertyStatsProps {
  stats: {
    residences: number;
    lands: number;
    commercial: number;
    available: number;
    reserved: number;
    sold: number;
  };
}

export function PropertyStats({ stats }: PropertyStatsProps) {
  const typeData = [
    { label: 'Residencias', value: stats.residences, color: 'bg-blue-500', icon: <HiOutlineHome className="text-xl" /> },
    { label: 'Terrenos', value: stats.lands, color: 'bg-green-500', icon: <HiOutlineMap className="text-xl" /> },
    { label: 'Comerciales', value: stats.commercial, color: 'bg-purple-500', icon: <HiOutlineOfficeBuilding className="text-xl" /> },
  ];

  const statusData = [
    { label: 'Disponibles', value: stats.available, color: 'bg-emerald-500', icon: 'check_circle' },
    { label: 'Reservadas', value: stats.reserved, color: 'bg-amber-500', icon: 'schedule' },
    { label: 'Vendidas', value: stats.sold, color: 'bg-gray-500', icon: 'sell' },
  ];

  const maxValue = Math.max(...typeData.map(d => d.value), ...statusData.map(d => d.value));

  return (
    <div className="">
      {/* Gráfica de Estados */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Propiedades por Estado
        </h3>
        
        <div className="space-y-4">
          {statusData.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 ${item.color} bg-opacity-20 rounded-lg`}>
                    <span className="material-symbols-outlined text-lg text-gray-900 dark:text-white">
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`${item.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
