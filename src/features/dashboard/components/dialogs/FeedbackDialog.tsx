"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineX,
} from "react-icons/hi";
import { createClient } from "@/core/config";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { BaseDialog } from "@/shared/components/dialogs/BaseDialog";

interface Appointment {
  id: string;
  client_name: string;
  date: string;
  description: string;
  property?: {
    title: string;
    address: string;
    details: Array<{ price: number }> | { price: number };
  };
}

interface FeedbackModalProps {
  appointments: Appointment[];
  onComplete: () => void;
}
export function FeedbackDialog({
  appointments,
  onComplete,
}: FeedbackModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Control de Pasos
  const [step, setStep] = useState<"selection" | "reprogram" | "offer">(
    "selection",
  );

  // Datos del Formulario
  const [newDate, setNewDate] = useState("");
  const [offerData, setOfferData] = useState({
    price: "",
    type_id: "", // Aquí conectarías con tu tabla type_offers
  });

  const supabase = createClient();
  // 1. Efecto de montado
  useEffect(() => {
    setMounted(true);
  }, []);

  // 3. Efecto de autollanado de precio
  const currentAppt = appointments[currentIndex];

  // Helper para obtener el precio sin importar si es array u objeto
  const getPrice = () => {
    const details = currentAppt?.property?.details;
    if (Array.isArray(details)) return details[0]?.price;
    return details?.price;
  };

  // 3. Efecto de autollanado de precio
  useEffect(() => {
    // 1. Extraemos el precio de la estructura anidada
    const propertyDetails = currentAppt?.property?.details;
    const originalPrice = Array.isArray(propertyDetails)
      ? propertyDetails[0]?.price
      : propertyDetails?.price;

    // 2. Si entramos al paso de oferta Y tenemos un precio, lo ponemos por defecto
    if (step === "offer" && originalPrice) {
      setOfferData((prev) => ({
        ...prev,
        price: originalPrice.toString(),
      }));
    }
  }, [step, currentAppt]); // Se dispara cada vez que cambias de paso o de cita

  // 4. VALIDACIÓN CRÍTICA: Si no hay citas o no está montado, salimos antes de declarar el JSX
  if (!mounted || !appointments || appointments.length === 0 || !currentAppt) {
    return null;
  }

  const nextStep = () => {
    setStep("selection");
    setNewDate("");
    setOfferData({ price: "", type_id: "" });
    if (currentIndex < appointments.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleUpdate = async (
    status: string,
    additionalData = {},
    table = "schedule",
  ) => {
    setLoading(true);
    try {
      // 1. Actualizar el estado de la cita
      const { error: apptError } = await supabase
        .from("schedule")
        .update({ status, ...additionalData })
        .eq("id", currentAppt.id);

      if (apptError) throw apptError;

      // 2. Si hay una oferta, insertarla en su propia tabla
      if (step === "offer" && offerData.price) {
        const { error: offerError } = await supabase.from("offers").insert([
          {
            client_name: currentAppt.client_name,
            price: parseFloat(offerData.price),
            id_type_offer: offerData.type_id || null, // ID de la tabla type_offers
            status: "Pendiente",
          },
        ]);
        if (offerError) throw offerError;
      }

      nextStep();
    } catch (error) {
      console.error("Error en la operación:", error);
    } finally {
      setLoading(false);
    }
  };
  const dialogContent = (
    <>
      

      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <div className="overlay-animate absolute inset-0 bg-black/40 backdrop-blur-md" />

        <BaseDialog className="group max-w-2xl">
        
        <div className="group ">
          <div className="flex items-center justify-center mb-6">
            <div className="icon-animate size-16 rounded-2xl bg-secondary dark:bg-secondary/20 flex items-center justify-center border-b-1 border-t-1 border-transparent transition-all duration-300">
              {step === "offer" ? (
                <HiOutlineCurrencyDollar className="text-white dark:text-secondary text-3xl" />
              ) : (
                <HiOutlineCalendar className="text-white dark:text-secondary text-3xl" />
              )}
            </div>
          </div>

          {step === "selection" && (
            <>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Seguimiento de Cita
                </h3>
                <div className="mt-4 p-4 rounded-2xl bg-gray-500/5 border border-gray-200 dark:border-white/5 text-left">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                    Cliente: {currentAppt.client_name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
                    Propiedad:{" "}
                    {currentAppt.property?.title || "No especificada"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
                    Fecha: {currentAppt.date}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
                    Descripción: {currentAppt.property?.address}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row gap-3">
                <ActionButton
                  onClick={() => handleUpdate("Cancelada")}
                  variant="secondary"
                  className="flex-1"
                  disabled={loading}
                >
                  <HiOutlineX className="text-xl text-red-500" /> Cancelada
                </ActionButton>

                <ActionButton
                  onClick={() => setStep("reprogram")}
                  variant="confirm"
                  className="flex-1"
                  disabled={loading}
                >
                  <HiOutlineCalendar className="text-xl" /> Reprogramó
                </ActionButton>

                <ActionButton
                  onClick={() => setStep("offer")}
                  variant="primary"
                  className="flex-1"
                  disabled={loading}
                >
                  <HiOutlineCheck className="text-xl" /> Se realizó
                </ActionButton>
              </div>
            </>
          )}

          {step === "reprogram" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                onClick={() => setStep("selection")}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-secondary mb-4"
              >
                <HiOutlineArrowLeft /> Volver
              </button>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Nueva Fecha
              </h3>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none text-center text-lg mb-6"
              />
              <ActionButton
                onClick={() => handleUpdate("Pendiente", { date: newDate })}
                variant="primary"
                className="w-full py-4"
                disabled={loading || !newDate}
              >
                Confirmar Reprogramación
              </ActionButton>
            </div>
          )}

          {step === "offer" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                onClick={() => setStep("selection")}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-secondary mb-4"
              >
                <HiOutlineArrowLeft /> Volver
              </button>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                Registro de Oferta
              </h3>
              <p className="text-sm text-center text-gray-500 mb-6 mt-1">
                ¿El cliente realizó una oferta económica?
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Monto de la Oferta
                  </label>
                  <div className="relative">
                    <HiOutlineCurrencyDollar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Ej: 150000"
                      value={offerData.price}
                      onChange={(e) =>
                        setOfferData({ ...offerData, price: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Tipo de Oferta
                  </label>
                  <div className="relative">
                    <HiOutlineTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={offerData.type_id}
                      onChange={(e) =>
                        setOfferData({ ...offerData, type_id: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none appearance-none"
                    >
                      <option value="">Selecciona tipo...</option>
                      <option value="ID_VENTA">Venta Directa</option>
                      <option value="ID_CONTRAOFERTA">Contraoferta</option>
                      <option value="ID_PERMUTA">Permuta</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <ActionButton
                  onClick={() => handleUpdate("Realizada")}
                  variant="primary"
                  className="w-full py-4"
                  disabled={loading}
                >
                  Guardar Oferta y Finalizar
                </ActionButton>
                <button
                  onClick={() => handleUpdate("Realizada")}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 py-2"
                >
                  No hubo oferta, solo marcar como realizada
                </button>
              </div>
            </div>
          )}

          {/* Indicador de Progreso */}
          <div className="mt-8 flex justify-center gap-2">
            {appointments.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? "w-6 bg-secondary" : "w-1.5 bg-gray-300 dark:bg-gray-700"}`}
              />
            ))}
          </div>
        </div>
        </BaseDialog>
      </div>
    </>
  );

  return createPortal(dialogContent, document.body);
}
