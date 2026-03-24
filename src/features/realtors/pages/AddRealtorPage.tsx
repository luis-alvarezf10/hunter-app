"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeButton } from "@/shared/components/buttons/BadgeButton";
import { TitleView } from "@/shared/components/text/TitleView";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { QRCodeSVG } from "qrcode.react"; // Importamos el QR
import {
  HiOutlineMail,
  HiOutlineClipboardCopy,
  HiOutlineTrash,
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import CompanySearchDialog from "../components/dialogs/CompanySearchDialog";
import { IconButton } from "@/shared/components/buttons/IconButton";
import { SuccessDialog } from "@/shared/components/dialogs/SuccessDialog";

export default function AddRealtorPage() {
  const router = useRouter();

  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    logo?: string;
    name: string;
  } | null>(null);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const [dialog, setDialog] = useState({
    isOpen: false,
    type: "success" as "success" | "error" | "warning",
    title: "",
    message: ""
  });

  const showAlert = (type: "success" | "error" | "warning", title: string, message: string) => {
    setDialog({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const handleGenerateLink = () => {
    if (!selectedCompany) {
      showAlert("error", "Error", "Por favor, selecciona una empresa primero.")
      return;
    };
    
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/auth/register/realtor?company_id=${selectedCompany.id}`;
    setInviteLink(link);
  };

  // Función para compartir en WhatsApp
  const shareWhatsApp = () => {
    if (!inviteLink) return;
    const text = encodeURIComponent(`¡Hola! Únete al equipo de Go Hunter como Realtor aquí: ${inviteLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareEmail = () => {
    if (!inviteLink) return;
    const subject = encodeURIComponent("Invitación Go Hunter");
    const body = encodeURIComponent(`Hola, Únete al equipo de Go Hunter como Realtor aquí: ${inviteLink}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    showAlert("success", "¡Link copiado!", "Puedes compartirlo con precaución.");
  };

  return (
    <>
      <div className="p-8 space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 items-start">
          <TitleView
            title="Invitación de Agente"
            subtitle="Genera un código de acceso para un nuevo Realtor"
          />
          <BadgeButton
            onClick={() => router.back()}
            iconVariant="back"
            variant="secondary"
          >
            Volver
          </BadgeButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Selección */}
          <div className="lg:col-span-2 space-y-6 bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-widest text-gray-900 dark:text-gray-300 uppercase ml-2">
                Empresa Inmobiliaria
              </label>
              {selectedCompany ? (
                <div className="flex items-center justify-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
 
                    <div className="size-10 rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#1a1a1a] flex-shrink-0 shadow-sm">
                      {selectedCompany.logo ? (
                        <img
                          src={selectedCompany.logo}
                          alt={`${selectedCompany.name} logo`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-secondary to-wine-red  text-white">
                          <span className="text-xl font-semibold uppercase">
                            {selectedCompany.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold">{selectedCompany.name}</h3>
  
                    </div>
 

                </div>
              ) : (
                <ActionButton
                  type="button"
                  onClick={() => setShowCompanyDialog(true)}
                  variant="dotted"
                  className="w-full py-10"
                  iconVariant="search"
                >
                  Buscar y seleccionar 
                </ActionButton>
              )}
            </div>

            {!inviteLink ? (
              <ActionButton
                onClick={handleGenerateLink}
                className="w-full justify-center py-4"
                iconVariant="link"
                variant="confirm"
              >
                Generar Link 
              </ActionButton>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 break-all text-sm font-mono text-gray-600 dark:text-gray-400 truncate ">
                  {inviteLink}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <IconButton 
                    onClick={copyToClipboard}
                    variant="secondary"
                    iconVariant="copylink"
                  />
                  <IconButton 
                    onClick={shareWhatsApp}
                    variant="green"
                    iconVariant="whatsapp"
                  />
                  <IconButton 
                    onClick={shareEmail}
                    variant="blue"
                    iconVariant="email"
                  />
                </div>
                <ActionButton
                  onClick={() => {
                    setInviteLink("");
                    setSelectedCompany(null);
                  }}
                  variant="dotted"
                  className="w-full text-sm"
                >
                  Generar otro link
                </ActionButton>
              </div>
            )}
          </div>

          {/* Columna Derecha: Código QR */}
          <div className="flex flex-col items-center justify-center bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              Acceso Rápido QR
            </p>
            {inviteLink ? (
              <div className="bg-white p-4 rounded-2xl shadow-inner">
                <QRCodeSVG
                  value={inviteLink}
                  size={180}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                />
              </div>
            ) : (
              <div className="w-[180px] h-[180px] bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10">
                <p className="text-[10px] text-gray-400 px-4">
                  Genera un link para ver el QR
                </p>
              </div>
            )}
            <p className="mt-6 text-sm text-gray-500 italic">
              El agente podrá escanear este código para registrarse
              directamente.
            </p>
          </div>
        </div>
      </div>
      <CompanySearchDialog
        isOpen={showCompanyDialog}
        onClose={() => setShowCompanyDialog(false)}
        onSelect={(company) => {
          setSelectedCompany(company);
          setShowCompanyDialog(false);
        }}
      />
      <SuccessDialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog(prev => ({ ...prev, isOpen: false }))}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
      />
    </>
  );
}
