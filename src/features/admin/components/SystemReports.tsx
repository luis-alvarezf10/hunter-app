'use client';

export default function SystemReports() {
  // TODO: Implementar reportes del sistema
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Reporte de Actividad</h2>
        <p className="text-gray-600">
          Gráficos y estadísticas de actividad del sistema.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Reporte de Ventas</h2>
        <p className="text-gray-600">
          Análisis de ventas y transacciones.
        </p>
      </div>
    </div>
  );
}
