"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiCalendar,
  HiOutlineInformationCircle,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import { createClient } from "@/core/config";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { BaseDialog } from "@/shared/components/dialogs/BaseDialog";
import { BadgeButton } from "@/shared/components/buttons/BadgeButton";
import ViewToggle from "@/shared/components/buttons/ToggleButtons";
import { CustomField } from "@/shared/components/inputs/CustomField";
import { Dropdown } from "@/shared/components/inputs/Dropdown";
import { ConfirmDialog } from "@/shared/components/dialogs";
import { SuccessDialog } from "@/shared/components/dialogs/SuccessDialog";

interface Appointment {
  id: string;
  client_name: string;
  date: string;
  description: string;
  property?: {
    title: string;
    address: string;
    details_properties?: Array<{ price?: number }> | { price?: number };
    id_type_offer?: string;
  };
}

interface FeedbackModalProps {
  appointments: Appointment[];
  onComplete: () => void;
  onRefresh?: () => void;
}
export function FeedbackDialog({
  appointments,
  onComplete,
  onRefresh 
}: FeedbackModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [acceptedConditions, setAcceptedConditions] = useState<boolean | null>(
    true,
  );
  const [offerTypes, setOfferTypes] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Control de Pasos
  const [step, setStep] = useState<
    "selection" | "reprogram" | "offer" | "cancelled"
  >("selection");

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
  // 2. Cargar tipos de propiedad (Solo una vez al abrir el modal)
  useEffect(() => {
    const fetchOfferTypes = async () => {
      const { data: offerTypes } = await supabase
        .from("type_offers")
        .select("id, name")
        .order("name");

      if (offerTypes) {
        setOfferTypes(offerTypes);
      }
    };

    fetchOfferTypes();
  }, []); // Array vacío = ejecución única

  // 3. Mantener el indicador en sincronía
  useEffect(() => {
    setActiveDotIndex(currentIndex);
  }, [currentIndex]);

  // 4. Lógica de autollanado de precio (Inteligente)
  const currentAppt = appointments[currentIndex];

  useEffect(() => {
    const propertyDetails = currentAppt?.property?.details_properties;
    const originalPrice = Array.isArray(propertyDetails)
      ? propertyDetails[0]?.price
      : (propertyDetails as { price?: number } | undefined)?.price;
    const originalOfferType = currentAppt?.property?.id_type_offer;

    if (step === "offer") {
      setOfferData((prev) => ({
        ...prev,
        price:
          prev.price === "" && originalPrice != null
            ? String(originalPrice)
            : prev.price,
        type_id:
          prev.type_id === "" && originalOfferType != null
            ? String(originalOfferType)
            : prev.type_id,
      }));
    }
  }, [step, currentAppt]);

  if (!mounted || !appointments || appointments.length === 0 || !currentAppt) {
    return null;
  }

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

  const advanceIndicator = () => {
    const maxDots = Math.max(appointments.length, 2);
    setActiveDotIndex((prev) => Math.min(prev + 1, maxDots - 1));
  };

  const decreaseIndicator = () => {
    setActiveDotIndex((prev) => Math.max(prev - 1, 0));
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
      setShowSuccessDialog(true);

      setTimeout(() => {
        if (onRefresh) onRefresh();
        
      }, 1000);
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

        <BaseDialog className="group max-w-3xl">
          <div className="group ">
            <div className="flex items-center justify-center mb-6">
              {step === "selection" ? (
                <div className="icon-animate size-16 rounded-2xl bg-red-500 dark:bg-red-500/10 flex items-center justify-center rounded-2xl transition-all duration-300 border-b-1 border-t-1 border-transparent group-hover:scale-110 group-hover:dark:border-b-red-500 group-hover:dark:border-t-white/10">
                  <HiOutlineInformationCircle className="text-white dark:text-secondary text-3xl" />
                </div>
              ) : null}
            </div>

            {step === "selection" && (
              <>
                <div className="flex flex-col items-center gap-3 text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Seguimiento de Cita
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Hemos notado que tienes una cita pendiente en una fecha
                    pasada
                  </p>
                  <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-gray-200/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-left w-full md:w-1/2">
                    <p className="text-sm font-bold text-secondary uppercase tracking-widest ">
                      Cliente: {currentAppt.client_name}
                    </p>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-300 leading-snug">
                      {currentAppt.property?.title || "No especificada"},{" "}
                      {currentAppt.property?.address}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
                      Fecha: {currentAppt.date}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    ¿Qué acción tomó el cliente respecto a esta cita?
                  </p>
                  <div className="flex flex-col-reverse md:flex-row gap-3">
                    <ActionButton
                      onClick={() => {
                        advanceIndicator();
                        setStep("cancelled");
                      }}
                      variant="secondary"
                      className="flex-1"
                      disabled={loading}
                      size={window.innerWidth < 768 ? "md" : "sm"}
                      leftIcon={<HiThumbDown className="text-xl" />}
                    >
                      No se realizó
                    </ActionButton>
                    <ActionButton
                      onClick={() => {
                        advanceIndicator();
                        setStep("reprogram");
                      }}
                      variant="confirm"
                      className="flex-1"
                      disabled={loading}
                      size={window.innerWidth < 768 ? "md" : "sm"}
                      leftIcon={<HiCalendar className="text-xl" />}
                    >
                      Reprogramó
                    </ActionButton>
                    <ActionButton
                      onClick={() => {
                        advanceIndicator();
                        setStep("offer");
                      }}
                      variant="primary"
                      className="flex-1"
                      disabled={loading}
                      size={window.innerWidth < 768 ? "md" : "sm"}
                      leftIcon={<HiThumbUp className="text-xl" />}
                    >
                      Si se realizó
                    </ActionButton>
                  </div>
                </div>
              </>
            )}

            {step === "reprogram" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <BadgeButton
                  onClick={() => {
                    decreaseIndicator();
                    setStep("selection");
                    setAcceptedConditions(null); // Resetear al volver
                  }}
                  iconVariant="back"
                  className="absolute top-3 left-3"
                >
                  Volver
                </BadgeButton>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Nueva Fecha
                </h3>
                <div className="flex flex-col gap-5">
                  <CustomField 
                    label="Selecciona la nueva fecha"
                    type="datetime-local"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                  <ActionButton
                    onClick={() => handleUpdate("Pendiente", { date: newDate, time: newDate.split("T")[1] })}
                    variant="primary"
                    className="w-full py-4"
                    disabled={loading || !newDate}
                  >
                    Confirmar Reprogramación
                  </ActionButton>

                </div>
              </div>
            )}

            {step === "offer" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <BadgeButton
                  onClick={() => {
                    decreaseIndicator();
                    setStep("selection");
                    setAcceptedConditions(null); 
                  }}
                  iconVariant="back"
                  className="absolute top-3 left-3"
                >
                  Volver
                </BadgeButton>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                  Registro de Oferta
                </h3>

                <div className="mt-6 flex flex-col gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 text-center px-2">
                    ¿El cliente aceptó las condiciones del propietario?
                  </p>

                  <ViewToggle
                    activeMode={
                      acceptedConditions === true
                        ? "Si"
                        : acceptedConditions === false
                          ? "No"
                          : ""
                    }
                    firstButton="Si"
                    secondButton="No"
                    onClickFirst={() => setAcceptedConditions(true)}
                    onClickSecond={() => setAcceptedConditions(false)}
                  />
                </div>

                {/* Formulario condicional: Solo sale si marcó que NO aceptó */}
                {acceptedConditions === false && (
                  <div className="flex flex-col items-start md:items-end md:flex-row gap-5 animate-in zoom-in-95 duration-300 p-5 ">
                    {/* Aquí tus inputs de Monto y Tipo */}
                    <CustomField
                      label="Monto de la Oferta"
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={offerData.price}
                      onChange={(e) =>
                        setOfferData({
                          ...offerData,
                          price: e.target.value,
                        })
                      }
                    />
                    <Dropdown
                      options={offerTypes.map((type) => ({
                        value: type.id,
                        label: type.name,
                      }))}
                      value={offerData.type_id}
                      onChange={(val) =>
                        setOfferData({ ...offerData, type_id: val || "" })
                      }
                      placeholder="Tipo de Propiedad"
                      className=" px-5 py-4"
                    />
                  </div>
                )}

                {/* Botón Final: Deshabilitado hasta que haya una respuesta */}
                <div className="flex flex-col gap-2 mt-8">
                  <ActionButton
                    onClick={() => handleUpdate("Realizada")}
                    variant="primary"
                    className="w-full py-4"
                    // DESHABILITADO SI: no ha respondido (null) O si eligió NO y no ha llenado el precio
                    disabled={
                      loading ||
                      acceptedConditions === null ||
                      (acceptedConditions === false && !offerData.price)
                    }
                  >
                    {acceptedConditions === true
                      ? "Confirmar y Guardar"
                      : "Guardar Propuesta"}
                  </ActionButton>
                </div>
              </div>
            )}

            {step === "cancelled" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <BadgeButton
                  onClick={() => {
                    decreaseIndicator();
                    setStep("selection");
                    setAcceptedConditions(null); // Resetear al volver
                  }}
                  iconVariant="back"
                  className="absolute top-3 left-3"
                >
                  Volver
                </BadgeButton>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Cancelación de cita
                </h3>
                <div className="pt-4">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Lo sentimos mucho. Cuentanos la razón.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <ActionButton
                        onClick={() => handleUpdate("No asistí")}
                        variant="secondary"
                        className="flex-1 min-w-0"
                        disabled={loading}
                        size="sm"
                      >
                        No asistí
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleUpdate("Cliente no asistió")}
                        variant="secondary"
                        className="flex-1 min-w-0"
                        disabled={loading}
                        size="sm"
                      >
                         El cliente no asistió
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleUpdate("Cancelada")}
                        variant="secondary"
                        className="flex-1 min-w-0"
                        disabled={loading}
                        size="sm"
                      >
                         El cliente canceló la cita
                      </ActionButton>
                    </div>
                  </div>
              </div>
            )}

            {/* Indicador de Progreso */}
            <div className="mt-8 flex justify-center gap-2 relative">
              {(() => {
                const progressCount = Math.max(appointments.length, 2);
                return Array.from({ length: progressCount }).map((_, idx) => {
                  const isActive = idx === activeDotIndex;
                  return (
                    <div
                      key={`progress-${idx}`}
                      className={`
                        h-2 rounded-full flex-shrink-0 min-w-[8px] transition-all duration-500 ease-out
                        ${
                          isActive
                            ? "w-8 bg-secondary shadow-sm shadow-secondary/40"
                            : "w-2 bg-gray-200 dark:bg-gray-500 hover:bg-gray-400"
                        }
                      `}
                    />
                  );
                });
              })()}
            </div>
          </div>
        </BaseDialog>
      </div>
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          nextStep();
        }}
        title="!Reporte de cita notificada!"
        message="La cita se ha reportada exitosamente, te felicitamos de antemano por tu esfuerzo."
      />
    </>
  );

  return createPortal(dialogContent, document.body);
}
