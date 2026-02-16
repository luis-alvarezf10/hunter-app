export function StatCards() {
  const stats = [
    {
      label: 'Ventas Totales',
      value: '$425,000',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'payments',
      iconBg: 'bg-[#6b1e2e]/10',
      iconColor: 'text-[#6b1e2e]',
      subtitle: 'vs. periodo anterior',
    },
    {
      label: 'Tasa de Conversión',
      value: '24.5%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'cached',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      subtitle: 'Promedio mensual',
    },
    {
      label: 'Cazadores Activos',
      value: '18',
      change: '+0%',
      changeType: 'neutral',
      icon: 'person_search',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      subtitle: 'En línea actualmente',
    },
    {
      label: 'Meta Mensual',
      value: '82%',
      change: '-5%',
      changeType: 'negative',
      icon: 'ads_click',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      subtitle: '12 días restantes',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 text-black dark:text-white p-6 rounded-xl  shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-500">
              {stat.label}
            </span>
            <div className={`p-2 ${stat.iconBg} rounded-lg ${stat.iconColor}`}>
              <span className="material-symbols-outlined text-lg">
                {stat.icon}
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1c2b36]">
              {stat.value}
            </span>
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                stat.changeType === 'positive'
                  ? 'text-emerald-600 bg-emerald-50'
                  : stat.changeType === 'negative'
                  ? 'text-red-500 bg-red-50'
                  : 'text-gray-400 bg-gray-50'
              }`}
            >
              {stat.change}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
