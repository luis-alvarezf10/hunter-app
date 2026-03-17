"use client";

import { useState } from "react";
import { createClient } from "@/core/config/supabase";
import { useRouter } from "next/navigation";
import { PropertySearchDialog } from "../components";
import { BadgeButton } from "@/shared/components/buttons/BadgeButton";
import { TitleView } from "@/shared/components/text/TitleView";
import { Card } from "@/shared/components/cards/card";
import { CustomField } from "@/shared/components/inputs/CustomField";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { StatusPropertyBadge } from "@/shared/components/badges/StatusPropertyBadge";
import { IconButton } from "@/shared/components/buttons/IconButton";
import { HiOutlineTrash } from "react-icons/hi";

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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [formData, setFormData] = useState({
    client_name: "",
    description: "",
    date: "",
    time: ""
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("No hay usuario autenticado");
        return;
      }

      const { error } = await supabase.from("schedule").insert({
        id_realtor: user.id,
        client_name: formData.client_name,
        description: formData.description || null,
        date: formData.date,
        time: formData.time,
        id_property: selectedProperty?.id || null,
        status: "Pendiente",
      });

      if (error) throw error;

      alert("Cita creada exitosamente");
      router.push("/schedule");
    } catch (error) {
      console.error("Error creating schedule:", error);
      alert("Error al crear la cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-8 space-y-6 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 items-start">
          <TitleView
            title="Nueva cita"
            subtitle="Complete los datos para programar una nueva cita"
          />
          <BadgeButton
            onClick={() => router.back()}
            iconVariant="back"
            variant="secondary"
          >
            Volver
          </BadgeButton>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 p-6 rounded-3xl border border-white/10 bg-white/50 dark:bg-[#1a1a1a]/40 backdrop-blur-sm shadow-xl">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CustomField
                label="Nombre del Cliente *"
                placeholder="Nombre completo"
                type="text"
                required
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
              />
              <CustomField
                label="Fecha *"
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ 
                    ...formData, 
                    date: e.target.value,
                    time: e.target.value.split("T")[1]
                  })
                }
              />
            </div>

            <CustomField
              label="Descripción"
              placeholder="Añade detalles relevantes sobre la reunión..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* Property Selection Area */}
            <div className="space-y-3">
              <label className="text-xs font-semibold tracking-widest text-gray-600 dark:text-gray-400 ml-2">
                Propiedad vinculada
              </label>
              {selectedProperty ? (
                <div className="border border-gray-300/50 dark:border-white/10 rounded-2xl p-4 bg-white/90 dark:bg-white/5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 flex flex-col gap-2">
                      <h3 className="font-semibold">
                        {selectedProperty.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedProperty.address}
                      </p>
                      
                      <div>
                        <StatusPropertyBadge status={selectedProperty.status} />
                      </div>
                    </div>

                    <IconButton
                      onClick={() => setSelectedProperty(null)}
                      icon={<HiOutlineTrash className="w-5 h-5" />}
                      variant="danger"
                    />
                  </div>
                </div>
              ) : (
                <ActionButton
                  type="button"
                  onClick={() => setShowPropertyDialog(true)}
                  variant="dotted"
                  className="w-full py-8"
                  iconVariant="search"
                  size="sm"
                >
                  Buscar y seleccionar propiedad
                </ActionButton>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
              <ActionButton
                onClick={() => router.back()}
                variant="secondary"
                className="flex-1 md:flex-none md:w-48"
                iconVariant="close"
                size={window.innerWidth > 768 ? "md" : "sm"}
              >
                Cancelar
              </ActionButton>
              <ActionButton
                type="submit"
                disabled={loading}
                className="flex-1 md:flex-none md:w-48"
                iconVariant="check"
                size={window.innerWidth > 768 ? "md" : "sm"}
              >
                {loading ? "Guardando..." : "Guardar"}
              </ActionButton>
            </div>
          </div>
        </form>
      </div>

      <PropertySearchDialog
        isOpen={showPropertyDialog}
        onClose={() => setShowPropertyDialog(false)}
        onSelect={handlePropertySelect}
      />
    </>
  );
}
