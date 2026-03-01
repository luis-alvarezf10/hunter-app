'use client';

import { SystemReports } from '../components';

export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reportes del Sistema</h1>
      
      <SystemReports />
    </div>
  );
}
