'use client';

import { useState, useMemo } from 'react';

interface ScheduleItem {
  id: string;
  description: string;
  client_name: string;
  date: string;
  status: string;
  property?: {
    name: string;
    address: string;
  };
}

interface Props {
  schedules: ScheduleItem[];
  onRefresh: () => void;
}

export default function ScheduleList({ schedules }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredAndSortedSchedules = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = schedules.filter(schedule => {
      // Search filter
      const matchesSearch = 
        schedule.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.property?.address.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Date filter
      const scheduleDate = new Date(schedule.date + 'T00:00:00');
      scheduleDate.setHours(0, 0, 0, 0);

      if (filterType === 'upcoming') {
        if (scheduleDate < today) return false;
      } else if (filterType === 'past') {
        if (scheduleDate >= today) return false;
      }

      // Status filter
      if (filterStatus !== 'all' && schedule.status !== filterStatus) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [schedules, searchTerm, filterType, filterStatus, sortOrder]);

  const groupedSchedules = filteredAndSortedSchedules.reduce((acc, schedule) => {
    const date = schedule.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(schedule);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pendiente': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
      'Confirmada': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      'Realizada': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
      'Cancelada': 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
      'No asistió': 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300',
      'Pospuesta': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow dark:shadow-gray-800 p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cliente, descripción, propiedad..."
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

          {/* Filter Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Período
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'upcoming' | 'past')}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="upcoming">Próximas</option>
              <option value="past">Pasadas</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Realizada">Realizada</option>
              <option value="Cancelada">Cancelada</option>
              <option value="No asistió">No asistió</option>
              <option value="Pospuesta">Pospuesta</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Ordenar
            </label>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-sm">
                {sortOrder === 'asc' ? 'Más antiguas' : 'Más recientes'}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sortOrder === 'asc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>
              {filteredAndSortedSchedules.length} cita{filteredAndSortedSchedules.length !== 1 ? 's' : ''} 
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? ' encontrada' : ''}
              {filteredAndSortedSchedules.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {Object.entries(groupedSchedules).map(([date, items]) => (
          <div key={date} className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow dark:shadow-gray-800 p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 capitalize text-gray-900 dark:text-white">{formatDate(date)}</h3>
            <div className="space-y-3">
              {items.map(schedule => (
                <div key={schedule.id} className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{schedule.client_name}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{schedule.description}</div>
                      {schedule.property && (
                        <div className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                          📍 {schedule.property.name} - {schedule.property.address}
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(schedule.status)}`}>
                      {schedule.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredAndSortedSchedules.length === 0 && (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow dark:shadow-gray-800 p-12 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'No se encontraron citas con los filtros aplicados' 
              : 'No tienes citas programadas'}
          </div>
        )}
      </div>
    </div>
  );
}
