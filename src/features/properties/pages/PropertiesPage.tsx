"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineSearch,
  HiViewGrid,
  HiViewList,
  HiX,
} from "react-icons/hi";
import { PropertyStats, PropertyCharts } from "../components";
import { createClient } from "@/core/config";
import { TitleView } from "@/shared/components/text/TitleView";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { SearchBar } from "@/shared/components/inputs/SearchBar";
import { IconButton } from "@/shared/components/buttons/IconButton";
import ViewToggle from "../components/buttons/ViewToggle";

interface Property {
  id: string;
  title: string;
  description: string | null;
  address: string | null;
  status: string;
  image: string | null;
  id_type_offer: string | null;
  id_type: string | null;
  type_offers: {
    name: string;
    value: string;
  } | null;
  type_properties: {
    value: string;
  } | null;
  details_properties:
    | {
        bedrooms: number | null;
        bathrooms: number | null;
        area_sqm: number | null;
        price: number | null;
        period: string | null;
        is_furnished: boolean | null;
        half_bath: number | null;
        lot_size: number | null;
        parking_spots: number | null;
      }
    | Array<{
        bedrooms: number | null;
        bathrooms: number | null;
        area_sqm: number | null;
        price: number | null;
        period: string | null;
        is_furnished: boolean | null;
        half_bath: number | null;
        lot_size: number | null;
        parking_spots: number | null;
      }>;
}

export function PropertiesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(
    null,
  );
  const [selectedPropertyType, setSelectedPropertyType] = useState<
    string | null
  >(null);
  const [propertyTypes, setPropertyTypes] = useState<
    Array<{ id: string; value: string }>
  >([]);

  // Cargar propiedades del asesor
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.log("No hay usuario autenticado");
          return;
        }

        console.log("Cargando propiedades para usuario:", user.id);

        const { data, error } = await supabase
          .from("properties")
          .select(
            `
            id,
            title,
            description,
            address,
            status,
            image,
            id_type_offer,
            id_type,
            details_properties (
              bedrooms,
              bathrooms,
              area_sqm,
              price,
              period,
              is_furnished,
              half_bath,
              lot_size,
              parking_spots
            )
          `,
          )
          .eq("id_advisor", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error de Supabase:", error);
          throw error;
        }

        // Cargar tipos de ofertas por separado
        const { data: offerTypes } = await supabase
          .from("type_offers")
          .select("id, name, value");

        // Cargar tipos de propiedades
        const { data: propTypes } = await supabase
          .from("type_properties")
          .select("id, value")
          .order("value");

        if (propTypes) {
          setPropertyTypes(propTypes);
        }

        // Mapear tipos de ofertas y propiedades a las propiedades
        const propertiesWithOffers =
          data?.map((property) => ({
            ...property,
            type_offers:
              offerTypes?.find((t) => t.id === property.id_type_offer) || null,
            type_properties:
              propTypes?.find((t) => t.id === property.id_type) || null,
          })) || [];

        console.log("Propiedades cargadas:", propertiesWithOffers.length);
        console.log("Ejemplo de propiedad:", propertiesWithOffers[0]);
        setProperties(propertiesWithOffers);
      } catch (err: any) {
        console.error("Error cargando propiedades:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [supabase]);

  const filteredProperties = properties.filter(
    (property) =>
      (property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.address &&
          property.address.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (!selectedTypeFilter ||
        property.type_offers?.value === selectedTypeFilter) &&
      (!selectedPropertyType || property.id_type === selectedPropertyType),
  );

  const offerTypes = Array.from(
    new Set(properties.map((p) => p.type_offers?.value).filter(Boolean)),
  );

  const resetFilters = () => {
    setSelectedTypeFilter(null);
    setSelectedPropertyType(null);
    setSearchTerm("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "reserved":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
      case "saled":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
      case "rented":
        return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible";
      case "reserved":
        return "Reservada";
      case "saled":
        return "Vendida";
      case "rented":
        return "Alquilada";
      default:
        return status;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <TitleView
            title="Mis Propiedades"
            subtitle="Administra tus propiedades, visualiza estadísticas y más"
          />
        </div>

        <ActionButton
          onClick={() => router.push("/properties/add")}
          variant="primary"
          iconVariant="add"
          size="md"
        >
          Nueva propiedad
        </ActionButton>
      </div>

      {/* Estadísticas y Gráficas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <PropertyStats />
        </div>

        <div className="xl:col-span-2">
          <PropertyCharts />
        </div>
      </div>

      {/* Search Bar y Toggle de Vista */}
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            placeholder="Buscar por nombre o ubicación..."
          />
        </div>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        
      </div>

      {/* Filtros por Tipo de Propiedad */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setSelectedTypeFilter(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            selectedTypeFilter === null
              ? "bg-[#6b1e2e] text-white"
              : "bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          Todas
        </button>
        {offerTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedTypeFilter(type as string)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedTypeFilter === type
                ? "bg-[#6b1e2e] text-white"
                : "bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {type === "Sale" ? "Venta" : type === "Rent" ? "Renta" : type}
          </button>
        ))}

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

        <select
          value={selectedPropertyType || ""}
          onChange={(e) => setSelectedPropertyType(e.target.value || null)}
          className="px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors outline-none focus:ring-2 focus:ring-[#6b1e2e]/50"
        >
          <option value="">Tipo de Propiedad</option>
          {propertyTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.value}
            </option>
          ))}
        </select>

        {(selectedTypeFilter || selectedPropertyType || searchTerm) && (
          <button
            onClick={resetFilters}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Restablecer filtros"
          >
            <HiX className="text-lg text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Properties Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-[#6b1e2e] border-t-transparent rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Cargando propiedades...
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            // Manejar details_properties como objeto o array
            const details = Array.isArray(property.details_properties)
              ? property.details_properties[0]
              : property.details_properties;

            return (
              <div
                key={property.id}
                className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <HiOutlineHome className="text-6xl text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(property.status)}`}
                    >
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
                    <div className="flex items-center gap-2 mb-3">
                      <HiOutlineCurrencyDollar className="text-xl text-[#6b1e2e]" />
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#6b1e2e]">
                          ${details.price.toLocaleString()}
                        </span>
                        {property.type_offers?.value === "Rent" &&
                          details.period && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              /
                              {details.period === "monthly"
                                ? "mes"
                                : details.period === "daily"
                                  ? "día"
                                  : details.period === "weekly"
                                    ? "semana"
                                    : "año"}
                            </span>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Badges adicionales */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {property.type_offers && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                        {property.type_offers.name}
                      </span>
                    )}
                    {details?.is_furnished && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full">
                        Amueblada
                      </span>
                    )}
                  </div>

                  {/* Características destacadas */}
                  <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    {details?.bedrooms != null && details.bedrooms > 0 ? (
                      <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="material-symbols-outlined text-2xl text-[#6b1e2e] mb-1">
                          bed
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {details.bedrooms}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Hab.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-40">
                        <span className="material-symbols-outlined text-2xl text-gray-400 mb-1">
                          bed
                        </span>
                        <span className="text-sm font-bold text-gray-400">
                          -
                        </span>
                        <span className="text-xs text-gray-400">Hab.</span>
                      </div>
                    )}

                    {details?.bathrooms != null && details.bathrooms > 0 ? (
                      <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="material-symbols-outlined text-2xl text-[#6b1e2e] mb-1">
                          bathtub
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {details.bathrooms}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Baños
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-40">
                        <span className="material-symbols-outlined text-2xl text-gray-400 mb-1">
                          bathtub
                        </span>
                        <span className="text-sm font-bold text-gray-400">
                          -
                        </span>
                        <span className="text-xs text-gray-400">Baños</span>
                      </div>
                    )}

                    {details?.area_sqm != null && details.area_sqm > 0 ? (
                      <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="material-symbols-outlined text-2xl text-[#6b1e2e] mb-1">
                          square_foot
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {details.area_sqm}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          m²
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-40">
                        <span className="material-symbols-outlined text-2xl text-gray-400 mb-1">
                          square_foot
                        </span>
                        <span className="text-sm font-bold text-gray-400">
                          -
                        </span>
                        <span className="text-xs text-gray-400">m²</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowDetailsDialog(true);
                      }}
                      className="flex-1 px-3 py-2 bg-[#6b1e2e] hover:bg-[#6b1e2e]/90 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/properties/add?id=${property.id}`)
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => {
            const details = Array.isArray(property.details_properties)
              ? property.details_properties[0]
              : property.details_properties;

            return (
              <div
                key={property.id}
                className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative md:w-64 h-48 bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                    {property.image ? (
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <HiOutlineHome className="text-6xl text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(property.status)}`}
                      >
                        {getStatusLabel(property.status)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {property.title}
                        </h3>
                        {property.address && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <HiOutlineLocationMarker className="text-lg" />
                            <span className="text-sm">{property.address}</span>
                          </div>
                        )}
                      </div>
                      {details?.price && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#6b1e2e]">
                            ${details.price.toLocaleString()}
                          </div>
                          {property.type_offers?.value === "Rent" &&
                            details.period && (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                /
                                {details.period === "monthly"
                                  ? "mes"
                                  : details.period === "daily"
                                    ? "día"
                                    : details.period === "weekly"
                                      ? "semana"
                                      : "año"}
                              </span>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {property.type_offers && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                          {property.type_offers.name}
                        </span>
                      )}
                      {details?.is_furnished && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full">
                          Amueblada
                        </span>
                      )}
                    </div>

                    {/* Características */}
                    <div className="flex gap-4 mb-4">
                      {details?.bedrooms != null && details.bedrooms > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-xl text-[#6b1e2e]">
                            bed
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {details.bedrooms} Hab.
                          </span>
                        </div>
                      )}
                      {details?.bathrooms != null && details.bathrooms > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-xl text-[#6b1e2e]">
                            bathtub
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {details.bathrooms} Baños
                          </span>
                        </div>
                      )}
                      {details?.area_sqm != null && details.area_sqm > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-xl text-[#6b1e2e]">
                            square_foot
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {details.area_sqm} m²
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowDetailsDialog(true);
                        }}
                        className="flex-1 px-4 py-2 bg-[#6b1e2e] hover:bg-[#6b1e2e]/90 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/properties/add?id=${property.id}`)
                        }
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          edit
                        </span>
                      </button>
                    </div>
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

      {/* Modal de Detalles */}
      {showDetailsDialog &&
        selectedProperty &&
        (() => {
          // Manejar details_properties como objeto o array
          const details = Array.isArray(selectedProperty.details_properties)
            ? selectedProperty.details_properties[0]
            : selectedProperty.details_properties;

          return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-6xl h-[85vh] overflow-hidden animate-fadeIn">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Columna Izquierda - Imagen */}
                  <div className="md:w-2/5 h-64 md:h-full relative bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                    {selectedProperty.image ? (
                      <img
                        src={selectedProperty.image}
                        alt={selectedProperty.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <HiOutlineHome className="text-8xl text-gray-400" />
                      </div>
                    )}

                    {/* Badge de estado sobre la imagen */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedProperty.status)}`}
                      >
                        {getStatusLabel(selectedProperty.status)}
                      </span>
                    </div>
                  </div>

                  {/* Columna Derecha - Información */}
                  <div className="md:w-3/5 flex flex-col overflow-y-auto">
                    {/* Header con botón cerrar */}
                    <div className="sticky top-0 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Detalles de la Propiedad
                      </h2>
                      <button
                        onClick={() => {
                          setShowDetailsDialog(false);
                          setSelectedProperty(null);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">
                          close
                        </span>
                      </button>
                    </div>

                    {/* Contenido scrolleable */}
                    <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                      {/* Título */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {selectedProperty.title}
                        </h3>

                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-4">
                          {selectedProperty.type_offers && (
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-semibold rounded-full">
                              {selectedProperty.type_offers.name}
                            </span>
                          )}
                          {details?.is_furnished && (
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-sm font-semibold rounded-full">
                              Amueblada
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Precio */}
                      {details?.price && (
                        <div className="p-4 bg-gradient-to-r from-[#6b1e2e]/10 to-[#8b2e3e]/10 rounded-lg border-l-4 border-[#6b1e2e]">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Precio
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-[#6b1e2e]">
                              ${details.price.toLocaleString()}
                            </span>
                            {selectedProperty.type_offers?.value === "Rent" &&
                              details.period && (
                                <span className="text-lg text-gray-500 dark:text-gray-400">
                                  /
                                  {details.period === "monthly"
                                    ? "mes"
                                    : details.period === "daily"
                                      ? "día"
                                      : details.period === "weekly"
                                        ? "semana"
                                        : "año"}
                                </span>
                              )}
                          </div>
                        </div>
                      )}

                      {/* Ubicación */}
                      {selectedProperty.address && (
                        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <HiOutlineLocationMarker className="text-2xl text-[#6b1e2e] flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Ubicación
                            </p>
                            <p className="text-gray-900 dark:text-white">
                              {selectedProperty.address}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Características principales */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                          Características
                        </h4>
                        <div className="grid grid-cols-2 gap-3 min-h-[240px]">
                          {details?.bedrooms ? (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <span className="material-symbols-outlined text-2xl text-[#6b1e2e]">
                                bed
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Habitaciones
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {details.bedrooms}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-50">
                              <span className="material-symbols-outlined text-2xl text-gray-400">
                                bed
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Habitaciones
                                </p>
                                <p className="text-lg font-bold text-gray-400">
                                  N/A
                                </p>
                              </div>
                            </div>
                          )}

                          {details?.bathrooms ? (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <span className="material-symbols-outlined text-2xl text-[#6b1e2e]">
                                bathtub
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Baños
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {details.bathrooms}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-50">
                              <span className="material-symbols-outlined text-2xl text-gray-400">
                                bathtub
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Baños
                                </p>
                                <p className="text-lg font-bold text-gray-400">
                                  N/A
                                </p>
                              </div>
                            </div>
                          )}

                          {details?.area_sqm ? (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <span className="material-symbols-outlined text-2xl text-[#6b1e2e]">
                                square_foot
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Área
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {details.area_sqm} m²
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-50">
                              <span className="material-symbols-outlined text-2xl text-gray-400">
                                square_foot
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Área
                                </p>
                                <p className="text-lg font-bold text-gray-400">
                                  N/A
                                </p>
                              </div>
                            </div>
                          )}

                          {details?.parking_spots ? (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <span className="material-symbols-outlined text-2xl text-[#6b1e2e]">
                                garage
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Estacionamientos
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {details.parking_spots}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-50">
                              <span className="material-symbols-outlined text-2xl text-gray-400">
                                garage
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Estacionamientos
                                </p>
                                <p className="text-lg font-bold text-gray-400">
                                  N/A
                                </p>
                              </div>
                            </div>
                          )}

                          {details?.half_bath ? (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <span className="material-symbols-outlined text-2xl text-[#6b1e2e]">
                                wc
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Medios Baños
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {details.half_bath}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-50">
                              <span className="material-symbols-outlined text-2xl text-gray-400">
                                wc
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Medios Baños
                                </p>
                                <p className="text-lg font-bold text-gray-400">
                                  N/A
                                </p>
                              </div>
                            </div>
                          )}

                          {details?.lot_size ? (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <span className="material-symbols-outlined text-2xl text-[#6b1e2e]">
                                landscape
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Tamaño del Lote
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {details.lot_size} m²
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-50">
                              <span className="material-symbols-outlined text-2xl text-gray-400">
                                landscape
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Tamaño del Lote
                                </p>
                                <p className="text-lg font-bold text-gray-400">
                                  N/A
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Descripción */}
                      {selectedProperty.description && (
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                            Descripción
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {selectedProperty.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer con botones */}
                    <div className="sticky bottom-0 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
                      <button
                        onClick={() => {
                          setShowDetailsDialog(false);
                          router.push(
                            `/properties/add?id=${selectedProperty.id}`,
                          );
                        }}
                        className="flex-1 px-4 py-3 bg-[#6b1e2e] hover:bg-[#6b1e2e]/90 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">edit</span>
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setShowDetailsDialog(false);
                          setSelectedProperty(null);
                        }}
                        className="px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
