'use client';

import { useState, useMemo } from 'react';

interface Client {
  id: string;
  name: string;
  last_name: string;
  national_id: string;
  created_at: string;
  properties: Array<{
    id: string;
    title: string;
    address: string;
    status: string;
  }>;
}

interface Props {
  clients: Client[];
  onRefresh: () => void;
}

export default function ClientsList({ clients }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'properties'>('name');

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
      const fullName = `${client.name} ${client.last_name}`.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      return (
        fullName.includes(search) ||
        client.national_id.includes(search) ||
        client.properties.some(p => 
          p.title.toLowerCase().includes(search) ||
          p.address?.toLowerCase().includes(search)
        )
      );
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      } else {
        return b.properties.length - a.properties.length;
      }
    });

    return filtered;
  }, [clients, searchTerm, sortBy]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Disponible': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
      'Vendida': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      'Reservada': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
      'En proceso': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow dark:shadow-gray-800 p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, cédula, propiedad..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'properties')}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Nombre</option>
              <option value="properties">Cantidad de propiedades</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>
              {filteredAndSortedClients.length} cliente{filteredAndSortedClients.length !== 1 ? 's' : ''}
              {searchTerm ? ' encontrado' : ''}
              {filteredAndSortedClients.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAndSortedClients.map((client) => (
          <div
            key={client.id}
            className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow dark:shadow-gray-800 p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-700 transition-shadow"
          >
            {/* Client Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                    {client.name.charAt(0)}{client.last_name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {client.name} {client.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    CI: {client.national_id}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {client.properties.length} {client.properties.length === 1 ? 'propiedad' : 'propiedades'}
              </span>
            </div>

            {/* Properties */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Propiedades:
              </h4>
              {client.properties.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Sin propiedades registradas
                </p>
              ) : (
                <div className="space-y-2">
                  {client.properties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-start justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {property.title}
                        </p>
                        {property.address && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            📍 {property.address}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedClients.length === 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow dark:shadow-gray-800 p-12 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
          {searchTerm 
            ? 'No se encontraron clientes con los filtros aplicados' 
            : 'No tienes clientes con propiedades asignadas'}
        </div>
      )}
    </div>
  );
}
