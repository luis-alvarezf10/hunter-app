'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineHome, HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineSearch } from 'react-icons/hi';
import { PropertyStats, PropertyCharts } from '../components';
import { createClient } from '@/core/config';

interface Property {
  id: string;
  title: string;
  address: string | null;
  status: string;
  image: string | null;
  details_properties: Array<{
    price: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    area_sqm: number | null;
  }>;
}

export function PropertiesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar propiedades del asesor
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('properties')
          .select(`
            id,
            title,
            address,
            status,
            image,
            details_properties (
              price,
              bedrooms,
              bathrooms,
              area_sqm
            )
          `)
          .eq('id_advisor', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setProperties(data || []);
      } catch (err) {
        console.error('Error cargando propiedades:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Estadísticas calculadas
  const stats = {
    residences: properties.length,
    lands: 0,
    commercial: 0,
    available: properties.filter(p => p.status === 'available').length,
    reserved: properties.filter(p => p.status === 'reserved').length,
    sold: properties.filter(p => p.status === 'sold').length,
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (property.address && property.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'reserved':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'sold':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'reserved':
        return 'Reservada';
      case 'sold':
        return 'Vendida';
      default:
        return status;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mis Propiedades
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona y visualiza todas las propiedades disponibles
          </p>
        </div>
        <button 
          onClick={() => router.push('/properties/add')}
          className="px-4 py-2.5 bg-[#6b1e2e] hover:bg-[#6b1e2e]/90 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nueva Propiedad
        </button>
      </div>

      {/* Estadísticas y Gráficas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PropertyStats stats={stats} />
        <PropertyCharts />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Buscar por nombre o ubicación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
        />
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-[#6b1e2e] border-t-transparent rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Cargando propiedades...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const details = property.details_properties[0];
            return (
              <div
                key={property.id}
                className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
                  {property.image ? (
                    <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <HiOutlineHome className="text-6xl text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h3>
                  
                  {property.address && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                      <HiOutlineLocationMarker className="text-lg" />
                      <span className="text-sm">{property.address}</span>
                    </div>
                  )}

                  {details?.price && (
                    <div className="flex items-center gap-2 mb-4">
                      <HiOutlineCurrencyDollar className="text-xl text-[#6b1e2e]" />
                      <span className="text-2xl font-bold text-[#6b1e2e]">
                        ${details.price.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Features */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                    {details?.bedrooms && (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">bed</span>
                        <span>{details.bedrooms}</span>
                      </div>
                    )}
                    {details?.bathrooms && (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">bathtub</span>
                        <span>{details.bathrooms}</span>
                      </div>
                    )}
                    {details?.area_sqm && (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">square_foot</span>
                        <span>{details.area_sqm}m²</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-3 py-2 bg-[#6b1e2e] hover:bg-[#6b1e2e]/90 text-white rounded-lg text-sm font-semibold transition-colors">
                      Ver Detalles
                    </button>
                    <button 
                      onClick={() => router.push(`/properties/add?id=${property.id}`)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <HiOutlineHome className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No se encontraron propiedades
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
