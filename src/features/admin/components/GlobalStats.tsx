'use client';

export default function GlobalStats() {
  // TODO: Fetch datos globales de la base de datos
  
  const stats = [
    { label: 'Total Usuarios', value: '0', change: '+0%' },
    { label: 'Total Propiedades', value: '0', change: '+0%' },
    { label: 'Total Citas', value: '0', change: '+0%' },
    { label: 'Total Clientes', value: '0', change: '+0%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">{stat.label}</p>
          <p className="text-3xl font-bold mt-2">{stat.value}</p>
          <p className="text-sm text-green-600 mt-1">{stat.change}</p>
        </div>
      ))}
    </div>
  );
}
