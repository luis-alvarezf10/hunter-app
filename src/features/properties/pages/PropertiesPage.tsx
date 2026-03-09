"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  HiOutlineHome,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineSearch,
  HiViewGrid,
  HiViewList,
  HiX,
  HiOutlineRefresh,
  HiPencil,
  HiDotsVertical,
  HiTrash,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineEye,
} from "react-icons/hi";
import { PropertyStats, PropertyCharts } from "../components";
import { createClient } from "@/core/config";
import { TitleView } from "@/shared/components/text/TitleView";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { SearchBar } from "@/shared/components/inputs/SearchBar";
import { IconButton } from "@/shared/components/buttons/IconButton";
import { Dropdown } from "@/shared/components/inputs/Dropdown";
import ViewToggle from "../components/buttons/ViewToggle";
import { Card } from "@/shared/components/cards/card";
import { ConfirmDialog } from "@/shared/components/dialogs/ConfirmDialog";
import { SuccessDialog } from "@/shared/components/dialogs/SuccessDialog";
import { TitleCard } from "@/shared/components/text/TitleCard";

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
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<
    Array<{ id: string; value: string }>
  >([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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
      (!selectedPropertyType || property.id_type === selectedPropertyType) &&
      (!selectedStatus || property.status === selectedStatus),
  );

  const offerTypes = Array.from(
    new Set(properties.map((p) => p.type_offers?.value).filter(Boolean)),
  );

  const resetFilters = () => {
    setSelectedTypeFilter(null);
    setSelectedPropertyType(null);
    setSelectedStatus(null);
    setSearchTerm("");
  };

  const handleDeleteProperty = async (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setShowDeleteDialog(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      // Eliminar relaciones (ignorar errores si no existen)
      await supabase
        .from("property_images")
        .delete()
        .eq("id_property", propertyToDelete);
      await supabase
        .from("property_amenities")
        .delete()
        .eq("id_property", propertyToDelete);
      await supabase
        .from("details_properties")
        .delete()
        .eq("id_property", propertyToDelete);

      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyToDelete);
      if (error) throw error;

      setProperties(properties.filter((p) => p.id !== propertyToDelete));
      setPropertyToDelete(null);
      setShowSuccessDialog(true);
    } catch (err: any) {
      console.error("Error eliminando propiedad:", err);
      console.error("Detalles del error:", JSON.stringify(err, null, 2));
      alert(
        `Error al eliminar la propiedad: ${err.message || "Error desconocido"}`,
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500 text-white";
      case "reserved":
        return "bg-amber-500 text-white";
      case "saled":
        return "bg-purple-500  text-white";
      case "rented":
        return "bg-blue-500 text-white";
      default:
        return "bg-grey-500  text-white";
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
      <div className="flex flex-wrap gap-2 items-center ">
        <Dropdown
          options={[
            { value: "Sale", label: "Venta" },
            { value: "Rent", label: "Renta" },
          ]}
          value={selectedTypeFilter}
          onChange={setSelectedTypeFilter}
          placeholder="Tipo de Oferta"
        />

        <Dropdown
          options={propertyTypes.map((type) => ({
            value: type.id,
            label: type.value,
          }))}
          value={selectedPropertyType}
          onChange={setSelectedPropertyType}
          placeholder="Tipo de Propiedad"
        />

        <Dropdown
          options={[
            { value: "available", label: "Disponible" },
            { value: "reserved", label: "Reservada" },
            { value: "saled", label: "Vendida" },
            { value: "rented", label: "Alquilada" },
          ]}
          value={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Estado"
        />

        {(selectedTypeFilter ||
          selectedPropertyType ||
          selectedStatus ||
          searchTerm) && (
          <ActionButton
            variant="danger"
            iconVariant="reset"
            onClick={resetFilters}
            size="sm"
            children="Reestablecer"
            className=""
          />
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
              <Card
                key={property.id}
                className="p-1 border-1 border-white/20 relative overflow-visible"
              >
                <div className="rounded-2xl overflow-hidden hover:shadow-lg">
                  {/* Image */}
                  <div className="relative h-48">
                    {property.image ? (
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <HiOutlineHome className="text-6xl text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}
                      >
                        {getStatusLabel(property.status)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-medium mb-2 truncate">
                        {property.title}
                      </h3>
                      {details?.price && (
                        <div className="flex items-start gap-2 mb-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-semibold text-primary dark:text-white">
                              ${details.price.toLocaleString()}
                            </span>
                            {property.type_offers?.value === "Rent" &&
                              details.period && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
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
                    </div>

                    {property.address && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                        <HiOutlineLocationMarker className="text-lg" />
                        <span className="text-sm">{property.address}</span>
                      </div>
                    )}

                    {/* Badges adicionales */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {property.type_offers && (
                        <span className="px-2 py-0.5  text-blue-500 font-medium  text-xs">
                          - {property.type_offers.name}
                        </span>
                      )}
                      {details?.is_furnished && (
                        <span className="px-2 py-0.5 text-purple-500 dark:text-purple-500 font-medium text-xs">
                          - Amueblada
                        </span>
                      )}
                    </div>

                    {/* Características destacadas */}
                    <div className="grid grid-cols-3 gap-2 p-4 border-y border-gray-300/50 dark:border-white/10 mb-3">
                      {details?.bedrooms != null && details.bedrooms > 0 && (
                        <div className="flex justify-center items-center gap-2">
                          <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-400">
                            bed
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Hab.
                          </span>
                          <span className="text-sm font- text-gray-900 dark:text-white">
                            {details.bedrooms}
                          </span>
                        </div>
                      )}

                      {details?.bathrooms != null && details.bathrooms > 0 && (
                        <div className="flex justify-center items-center gap-2">
                          <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                            bathtub
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Baños
                          </span>
                          <span className="text-sm font- text-gray-900 dark:text-white">
                            {details.bathrooms}
                          </span>
                        </div>
                      )}

                      {details?.area_sqm != null && details.area_sqm > 0 && (
                        <div className="flex justify-center items-center gap-2">
                          <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                            square_foot
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            m²
                          </span>
                          <span className="text-sm font- text-gray-900 dark:text-white">
                            {details.area_sqm}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <ActionButton
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowDetailsDialog(true);
                        }}
                        className="flex-1"
                      >
                        Ver Detalles
                      </ActionButton>

                      <div className="relative">
                        <IconButton
                          icon={<HiDotsVertical className="text-lg w-5 h-5" />}
                          variant="outline"
                          className="w-12 h-12"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === property.id ? null : property.id,
                            )
                          }
                        />
                        <AnimatePresence>
                          {openMenuId === property.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 bottom-full mb-2 w-48  bg-white/90 dark:bg-[#1a1a1a]/90 dark:border-1 border-white/30 rounded-2xl shadow-lg z-[100] backdrop-blur-sm"
                            >
                              <button
                                onClick={() => {
                                  router.push(
                                    `/properties/add?id=${property.id}`,
                                  );
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2 rounded-t-2xl cursor-pointer"
                              >
                                <HiOutlinePencil className="text-lg" />
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteProperty(property.id);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 rounded-b-2xl cursor-pointer"
                              >
                                <HiOutlineTrash className="text-lg" />
                                Eliminar
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="">
          {/* Encabezado de la Tabla - Solo visible en tablet/PC (md+) */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-100 dark:bg-white/5 rounded-t-xl border-x border-t border-gray-300 dark:border-white/10 text-xs uppercase font-semibold text-gray-600 dark:text-gray-300">
            <div className="col-span-5">Propiedad</div>
            <div className="col-span-2 text-center">Estado</div>
            <div className="col-span-3 text-center">Precio</div>
            <div className="col-span-2 text-center">Acciones</div>
          </div>

          {/* Cuerpo de la Tabla / Lista de Cartas */}
          <div className="space-y-3 md:space-y-0 md:border md:border-gray-300 md:dark:border-white/10 md:rounded-b-xl overflow-hidden">
            {filteredProperties.map((property) => {
              const details = Array.isArray(property.details_properties)
                ? property.details_properties[0]
                : property.details_properties;

              return (
                <div
                  key={property.id}
                  className="bg-white/90 dark:bg-[#1a1a1a] md:grid md:grid-cols-12 md:items-center gap-4 p-4 md:px-6 md:py-4 dark:border border-gray-300 dark:border-white/10 md:border-none md:border-b md:last:border-b-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors shadow-sm md:shadow-none rounded-2xl md:rounded-none"
                >
                  {/* Columna 1: Info Principal */}
                  <div className="col-span-5 flex items-center gap-4 mb-4 md:mb-0">
                    <div className="relative w-16 h-16 md:w-12 md:h-12 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      {property.image ? (
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiOutlineHome className="text-2xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 min-w-0">
                      <div
                        className={`w-2 block md:hidden rounded-full ${getStatusColor(property.status)}`}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm md:text-base">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-0.5">
                          <HiOutlineLocationMarker className="text-xs shrink-0" />
                          <span className="text-xs truncate">
                            {property.address || "Sin dirección"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Columna 2: Estado */}
                  <div className="col-span-2 hidden md:flex md:justify-center md:items-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${getStatusColor(property.status)}`}
                    >
                      {getStatusLabel(property.status)}
                    </span>
                  </div>

                  {/* Columna 3: Precio */}
                  <div className="col-span-3 border-y md:border-none border-gray-300/50 dark:border-y-white/10 flex flex-row md:flex-col items-center justify-center gap-1">
                    <span className="text-lg md:text-base font- text-primary dark:text-white">
                      ${details?.price?.toLocaleString()}
                    </span>
                    {property.type_offers?.value === "Rent" &&
                      details.period && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
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

                  {/* Columna 4: Acciones */}
                  <div className="col-span-2 flex items-center justify-end gap-2  pt-3 md:pt-0">
                    <IconButton onClick={() => {
                        setSelectedProperty(property);
                        setShowDetailsDialog(true);
                      }}  
                      variant="secondary"
                      className="flex-1 md:flex-none h-12"
                      icon={<HiOutlineEye  className="text-lg" />}
                    />
                    <div className="relative">
                        <IconButton
                          icon={<HiDotsVertical className="text-lg w-5 h-5" />}
                          variant="outline"
                          className="flex-1 md:flex-none w-12 h-12"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === property.id ? null : property.id,
                            )
                          }
                        />
                        <AnimatePresence>
                          {openMenuId === property.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 bottom-full md:-bottom-3 md:right-full md:mr-2 mb-2 md:mb-0 w-48  bg-white/90 dark:bg-[#1a1a1a]/90 dark:border-1 border-white/30 rounded-2xl shadow-lg z-[100] backdrop-blur-sm"
                            >
                              <button
                                onClick={() => {
                                  router.push(
                                    `/properties/add?id=${property.id}`,
                                  );
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2 rounded-t-2xl cursor-pointer"
                              >
                                <HiOutlinePencil className="text-lg" />
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteProperty(property.id);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 rounded-b-2xl cursor-pointer"
                              >
                                <HiOutlineTrash className="text-lg" />
                                Eliminar
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
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
        createPortal(
          (() => {
            const details = Array.isArray(selectedProperty.details_properties)
              ? selectedProperty.details_properties[0]
              : selectedProperty.details_properties;

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setShowDetailsDialog(false);
                    setSelectedProperty(null);
                  }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-md rounded-2xl border border-gray-300/50 dark:border-white/10 w-full max-w-6xl max-h-[85vh] mx-4 overflow-hidden p-2"
                >
                  <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
                    {/* Columna Izquierda - Imagen */}
                    <div className="md:w-2/5 h-64 md:h-auto relative flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-2xl">
                      {selectedProperty.image ? (
                        <img
                          src={selectedProperty.image}
                          alt={selectedProperty.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <HiOutlineHome className="text-8xl text-gray-400" />
                        </div>
                      )}
                      {/* Badge de estado sobre la imagen */}
                      <div className="absolute top-3 right-3 z-10">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(selectedProperty.status)}`}
                        >
                          {getStatusLabel(selectedProperty.status)}
                        </span>
                      </div>
                    </div>

                    {/* Columna Derecha - Información */}
                    <div className="md:w-3/5 flex flex-col overflow-y-auto">
                      {/* Header con botón cerrar */}
                      <div className="sticky top-0 border-b border-gray-300/50 dark:border-white/10 p-4 flex items-center justify-between z-10">
                        <h2 className="text-2xl font-semibold">
                          Detalles de la Propiedad
                        </h2>
                      </div>
                      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                        {/* Título */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center  justify-between">
                            <h3 className="text-2xl font-medium mb-3">
                              {selectedProperty.title}
                            </h3>
                            {details?.price && (
                              <div className="">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  Precio
                                </p>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-3xl font-bold text-primary">
                                    ${details.price.toLocaleString()}
                                  </span>
                                  {selectedProperty.type_offers?.value ===
                                    "Rent" &&
                                    details.period && (
                                      <span className="text-lg text-gray-600 dark:text-gray-400">
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
                          </div>

                          {/* Badges */}
                          <div className="flex items-center gap-2 flex-wrap mb-4">
                            {selectedProperty.type_offers && (
                              <span className="text-sm text-blue-500 font-medium">
                                - {selectedProperty.type_offers.name}
                              </span>
                            )}
                            {details?.is_furnished && (
                              <span className="text-sm text-purple-500 dark:text-purple-400 font-medium">
                                - Amueblada
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Ubicación */}
                        {selectedProperty.address && (
                          <div className="flex items-center gap-3">
                            <HiOutlineLocationMarker className="text-2xl text-gray-600 dark:text-gray-400 flex-shrink-0" />
                            <p className="text-gray-900 dark:text-white">
                              {selectedProperty.address}
                            </p>
                          </div>
                        )}

                        {/* Características principales */}
                        <div className="flex flex-col gap-3">
                          <TitleCard
                            title="Características"
                            subtitle="verifica los detalles de propiedad aquí: "
                            showDivider
                          />
                          <div className="grid grid-cols-2 gap-3 min-h-[240px] min-w-[260px]">
                            {details?.bedrooms != null &&
                              details.bedrooms > 0 && (
                                <div className="flex flex-col md:flex-row items-center gap-1 bg-gray-500/5 rounded-2xl  justify-start p-3  backdrop-blur-md border border-gray-300/50 border-white/10 shadow-md">
                                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                    Habitaciones
                                  </p>
                                  <p className=" text-gray-900 dark:text-white">
                                    {details.bedrooms}
                                  </p>
                                </div>
                              )}

                            {details?.bathrooms != null &&
                              details.bathrooms > 0 && (
                                <div className="flex flex-col md:flex-row items-center gap-1 bg-gray-500/5 rounded-2xl  justify-start p-3  backdrop-blur-md border border-gray-300/50 border-white/10 shadow-md">
                                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                    Baños
                                  </p>
                                  <p className=" text-gray-900 dark:text-white">
                                    {details.bathrooms}
                                  </p>
                                </div>
                              )}

                            {details?.area_sqm != null &&
                              details.area_sqm > 0 && (
                                <div className="flex flex-col md:flex-row items-center gap-1 bg-gray-500/5 rounded-2xl  justify-start p-3  backdrop-blur-md border border-gray-300/50 border-white/10 shadow-md">
                                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                    Área
                                  </p>
                                  <p className="text-gray-900 dark:text-white">
                                    {details.area_sqm} m²
                                  </p>
                                </div>
                              )}

                            {details?.parking_spots != null &&
                              details.parking_spots > 0 && (
                                <div className="flex flex-col md:flex-row items-center gap-1 bg-gray-500/5 rounded-2xl  justify-start p-3  backdrop-blur-md border border-gray-300/50 border-white/10 shadow-md">
                                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                    Estacionamientos
                                  </p>
                                  <p className="text-gray-900 dark:text-white">
                                    {details.parking_spots}
                                  </p>
                                </div>
                              )}

                            {details?.half_bath != null &&
                              details.half_bath > 0 && (
                                <div className="flex flex-col md:flex-row items-center gap-1 bg-gray-500/5 rounded-2xl  justify-start p-3  backdrop-blur-md border border-gray-300/50 border-white/10 shadow-md">
                                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                    Medios Baños
                                  </p>
                                  <p className="text-gray-900 dark:text-white">
                                    {details.half_bath}
                                  </p>
                                </div>
                              )}

                            {details?.lot_size != null &&
                              details.lot_size > 0 && (
                                <div className="flex flex-col md:flex-row items-center gap-1 bg-gray-500/5 rounded-2xl  justify-start p-3  backdrop-blur-md border border-gray-300/50 border-white/10 shadow-md">
                                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                    Tamaño del Lote
                                  </p>
                                  <p className="text-gray-900 dark:text-white">
                                    {details.lot_size} m²
                                  </p>
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
                      <div className="sticky bottom-0 border-t border-gray-300/50 dark:border-white/10 p-4 flex gap-3">
                        <ActionButton
                          onClick={() => {
                            setShowDetailsDialog(false);
                            router.push(
                              `/properties/add?id=${selectedProperty.id}`,
                            );
                          }}
                          className="flex-1"
                        >
                          Editar
                        </ActionButton>
                        <ActionButton
                          onClick={() => {
                            setShowDetailsDialog(false);
                            setSelectedProperty(null);
                          }}
                          className=""
                          variant="outline"
                        >
                          Cerrar
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })(),
          document.body,
        )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Eliminar Propiedad"
        message="¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="¡Propiedad Eliminada!"
        message="La propiedad se ha eliminado exitosamente."
      />
    </div>
  );
}
