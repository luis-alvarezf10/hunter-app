"use client";
import { createClient } from "@/core/config";
import { BadgeButton } from "@/shared/components/buttons/BadgeButton";
import { IconButton } from "@/shared/components/buttons/IconButton";
import { OptionsMenuButton } from "@/shared/components/buttons/OptionsMenuButton";
import { Card } from "@/shared/components/cards/card";
import { TitleCard } from "@/shared/components/text/TitleCard";
import { TitleView } from "@/shared/components/text/TitleView";
import { LoadingPage } from "@/shared/pages/LoadingPage";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

interface Props {
  realtorId: string;
}

export default function RealtorDetailsPage({ realtorId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [realtor, setRealtor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

   const menuActions = [
      {
        label: "Editar",
        icon: <HiOutlinePencil />,
        onClick: () => router.push(``),
      },
      {
        label: "Eliminar",
        icon: <HiOutlineTrash />,
        onClick: () => {},
        variant: "danger" as const,
      },
    ];

  useEffect(() => {
    const fetchRealtor = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("realtors")
        .select(`
          *,
          stakeholder:stakeholders (*),
          company:companies (*)
        `)
        .eq("id", realtorId) 
        .single();

      if (error || !data) {
        // En cliente no podemos usar notFound(), redirigimos o mostramos mensaje
        console.error("Error fetching realtor:", error);
      } else {
        setRealtor(data);
      }
      setLoading(false);
    };

    if (realtorId) fetchRealtor();
  }, [realtorId, supabase]);

  if (loading) return <LoadingPage />;
  
  if (!realtor) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">No se encontró el agente.</p>
        <BadgeButton onClick={() => router.back()} iconVariant="back" variant="secondary">
          Volver
        </BadgeButton>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 items-start">
        <TitleView
          title="Detalle de Agente"
        />
        <div className="w-full flex items-center justify-between">
          <BadgeButton
            onClick={() => router.back()}
            iconVariant="back"
            variant="secondary"
          >
            Volver
          </BadgeButton>
          <OptionsMenuButton
            actions={menuActions}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 border-t border-gray-300 dark:border-white/10 pt-2">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-medium text-3xl"
          style={{ backgroundColor: realtor.stakeholder.ui_color }}
        >
          {realtor.stakeholder.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {realtor.stakeholder.name} {realtor.stakeholder.lastname}
          </h1>
          <p className="text-gray-500">
            {realtor.stakeholder.nickname}
          </p>
        </div>
      </div>
      
      <Card className="p-6">
        <TitleCard
          showDivider
          title="Información General"
        />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400 text-sm">Correo Electrónico</span>
            <p>{realtor.stakeholder.email}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Teléfono</span>
            <p>{realtor.stakeholder.phone}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Cédula</span>
            <p>{realtor.stakeholder.national_id}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Fecha de Registro</span>
            <p>{new Date(realtor.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      {/* Aquí van tus gráficas de estadísticas de GoHunter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl bg-white dark:bg-[#1a1a1a]">
           <p className="text-sm text-gray-500">
            ID Nacional: {realtor.stakeholder.national_id}
          </p>
          <span className="text-gray-400 text-sm">Empresa Asociada</span>
          <p className="font-semibold">
            {realtor.id_company || "Independiente"}
          </p>
        </div>
      </div>
    </div>
  );
}
