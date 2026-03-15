"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/core/config/supabase";
import { BaseDialog } from "@/shared/components/dialogs/BaseDialog";
import { TitleCard } from "@/shared/components/text/TitleCard";
import { SearchBar } from "@/shared/components/inputs/SearchBar";
import { LoadSpin } from "@/shared/components/spins/LoadSpin";
import { div } from "framer-motion/client";
import { DecoratorPropertyBadge } from "@/shared/components/badges/DecoratorPropertyBadge";
import { HiOutlineHome, HiOutlineLocationMarker } from "react-icons/hi";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { createPortal } from "react-dom";

interface Property {
  id: string;
  title: string;
  address: string;
  description: string;
  status: string;
  image?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (property: Property) => void;
}

export default function PropertySearchDialog({
  isOpen,
  onClose,
  onSelect,
}: Props) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
      setFilteredProperties(filtered);
    }
  }, [searchTerm, properties]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("properties")
        .select("id, title, address, description, status, image")
        .eq("id_advisor", user.id) // Primera condición
        .eq("status", "available") // Segunda condición (se encadenan)
        .order("created_at", { ascending: false });
      if (error) throw error;

      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (property: Property) => {
    onSelect(property);
    setSearchTerm("");
  };

  if (!isOpen) return null;

  const dialogContent = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="overlay-animate absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Dialog */}
      <BaseDialog className="group max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300 dark:border-white/10">
          <TitleCard title="Busca una propiedad" />
        </div>
        {/* Search */}
        <div className="p-6 border-b border-gray-300 dark:border-white/10">
          <SearchBar
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            placeholder="Buscar por títutlo o dirección"
          />
        </div>
        {/* Content */}
        <div className="p-1 overflow-y-auto max-h-[calc(50vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center p-10">
              <LoadSpin />
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "No se encontraron propiedades"
                : "No tienes propiedades registradas"}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => handleSelect(property)}
                  className="border border-gray-300/50 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      {property.image ? (
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiOutlineHome className="text-2xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 min-w-0">
                      <DecoratorPropertyBadge status={property.status} />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate text-sm md:text-base">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-40 mt-0.5">
                          <HiOutlineLocationMarker className="text-xs shrink-0" />
                          <span className="text-xs truncate">
                            {property.address || "Sin dirección"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {property.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {property.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-300/50 dark:border-white/10">
          <ActionButton onClick={onClose} variant="secondary">
            Cerrar
          </ActionButton>
        </div>
      </BaseDialog>
    </div>
  );
  return createPortal(dialogContent, document.body);
}
