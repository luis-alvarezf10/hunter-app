'use client';

import { UsersTable } from '../components';

export default function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
      
      <UsersTable />
    </div>
  );
}
