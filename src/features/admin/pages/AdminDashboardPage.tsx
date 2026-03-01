'use client';

import { GlobalStats, SystemOverview } from '../components';

export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      
      <GlobalStats />
      
      <div className="mt-6">
        <SystemOverview />
      </div>
    </div>
  );
}
