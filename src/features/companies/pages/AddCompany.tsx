"use client";
import { createClient } from "@/core/config/supabase";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { HiOutlineCamera } from "react-icons/hi";
import { useImageUpload } from "@/shared/hooks/useImageUpload";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { TitleView } from "@/shared/components/text/TitleView";
import { BadgeButton } from "@/shared/components/buttons/BadgeButton";
import { CountrySelector } from "@/shared/components/inputs/CountrySelector";
import { CustomField } from "@/shared/components/inputs/CustomField";

export default function AddCompanyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const companyId = searchParams.get("id");

  // 1. Estado para los campos de texto
  const [formData, setFormData] = useState({
    name: "",
    rif: "",
    country_code: "VE",
  });

  const {
    imagePreview,
    imageFile, 
    fileInputRef,
    handleCameraClick,
    handleImageChange,
    resetImage,
  } = useImageUpload();

  // 2. Función de envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.country_code) return alert("Faltan datos");

    setLoading(true);
    try {
      let logoUrl = "";

      // Subir imagen si existe
      if (imageFile) {
         try {
          const fileExt = imageFile.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `company-logos/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("company-logos")
            .upload(filePath, imageFile);

          if (uploadError) {
            console.error("Error subiendo imagen:", uploadError);
            // Continuar sin imagen si falla el upload
          } else {
            const {
              data: { publicUrl },
            } = supabase.storage.from("company-logos").getPublicUrl(filePath);

            logoUrl = publicUrl;
          }
        } catch (err) {
          console.error("Error en upload de imagen:", err);
          // Continuar sin imagen si falla
        }
      }

      // Insertar en la tabla
      const { error } = await supabase.from("companies").insert([
        {
          name: formData.name,
          rif: formData.rif,
          country_code: formData.country_code,
          logo: logoUrl,
        },
      ]);

      if (error) throw error;
      router.push("/companies"); // O la ruta de tu lista
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 items-start">
        <TitleView
          title={companyId ? "Editar Propiedad" : "Nueva Propiedad"}
          subtitle={
            companyId
              ? "Actualiza la información de la propiedad"
              : "Completa la información de la propiedad"
          }
        />
        <BadgeButton
          onClick={() => router.back()}
          iconVariant="back"
          variant="secondary"
        >
          Volver
        </BadgeButton>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-100 dark:border-white/5"
      >
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold tracking-widest text-gray-900 dark:text-gray-300 ml-2">Logo de la Empresa</label>
          <div className="flex flex-wrap gap-4 items-center">
            {imagePreview && (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/30">
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={resetImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  <span className="material-symbols-outlined text-xs">
                    close
                  </span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleCameraClick}
              className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl hover:border-primary transition-colors text-gray-400 hover:text-primary"
            >
              <HiOutlineCamera className="text-3xl" />
              <span className="text-[10px] mt-2 font-medium">Subir Foto</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>
        {/* Nombre de la Empresa */}
        <CustomField
          label="Nombre de la Empresa"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {/* RIF / ID Fiscal */}

        <CustomField
          label="RIF o Identificación Fiscal"
          value={formData.rif}
          onChange={(e) => setFormData({ ...formData, rif: e.target.value })}
        />
        {/* Selector de País (Reutilizable) */}
        <CountrySelector
          value={formData.country_code}
          onChange={(code) => setFormData({ ...formData, country_code: code })}
        />

        

        {/* Botón de Guardar */}
        <div className="md:col-span-2 pt-4">
          <ActionButton type="submit" className="w-full md:w-auto">
            Guardar Empresa
          </ActionButton>
        </div>
      </form>
    </div>
  );
}
