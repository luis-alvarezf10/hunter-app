'use client';

import { useState } from 'react';
import { createClient } from '@/core/config/supabase';
import { useRouter } from 'next/navigation';
import { PropertySearchDialog } from '../components';

interface Property {
  id: string;
  title: string;
  address: string;
  description: string;
  status: string;
}

export default function AddSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPropertyDialog, setShowPropertyDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    description: '',
    date: ''
  });

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyDialog(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('No hay usuario autenticado');
        return;
      }

      const { error } = await supabase.from('schedule').insert({
        id_advisdor: user.id,
        client_name: formData.client_name,
        description: formData.description || null,
        date: formData.date,
        id_property: selectedProperty?.id || null,
        status: 'Pendiente'
      });

      if (error) throw error;

      alert('Cita creada exitosamente');
      router.push('/schedule');
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push('/schedule')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la agenda
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Nueva Cita
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow dark:shadow-gray-800 p-6 border border-gray-200 dark:border-gray-700 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Nombre del Cliente *
          </label>
          <input
            type="text"
            required
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Fecha *
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Detalles de la cita..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Propiedad Asociada (Opcional)
          </label>
          
          {selectedProperty ? (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {selectedProperty.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedProperty.address}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {selectedProperty.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProperty(null)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPropertyDialog(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              + Buscar y seleccionar propiedad
            </button>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/schedule')}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Guardando...' : 'Guardar Cita'}
          </button>
        </div>
      </form>

      <PropertySearchDialog
        isOpen={showPropertyDialog}
        onClose={() => setShowPropertyDialog(false)}
        onSelect={handlePropertySelect}
      />
    </div>
  );
}
