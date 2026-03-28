"use client";
import { createClient } from "@/core/config";
import { PropertyCharts } from "@/features/properties/components/PropertyCharts";
import { PropertyStats } from "@/features/properties/components/PropertyStats";
import { BadgeButton } from "@/shared/components/buttons/BadgeButton";
import { OptionsMenuButton } from "@/shared/components/buttons/OptionsMenuButton";
import { TitleCard } from "@/shared/components/text/TitleCard";
import { TitleView } from "@/shared/components/text/TitleView";
import { LoadingPage } from "@/shared/pages/LoadingPage";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import RealtorInfoCard from "../components/cards/RealtorInfoCard";
import GeneralStatCards from "../components/cards/GeneralStatCards";
import BillingStatCards from "../components/cards/BillingsStatCards";
import DatesStats from "../components/cards/DatesStats";

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
        .select(
          `
          *,
          stakeholder:stakeholders (*),
          company:companies (*)
        `,
        )
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

  const calculateDaysInCompany = (dateString: string | null | undefined) => {
    if (!dateString) return 0;

    // Creamos las fechas
    const joinedDate = new Date(dateString);
    const today = new Date();

    // "Reseteamos" las horas a medianoche para comparar solo días
    joinedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Diferencia en milisegundos
    const diffTime = today.getTime() - joinedDate.getTime();

    // Conversión a días (1000ms * 60s * 60m * 24h)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Si quieres que el primer día cuente como 1 (mínimo 1), usa:
    // return Math.max(1, diffDays);

    return diffDays < 0 ? 0 : diffDays;
  };

  if (loading) return <LoadingPage />;

  if (!realtor) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">No se encontró el agente.</p>
        <BadgeButton
          onClick={() => router.back()}
          iconVariant="back"
          variant="secondary"
        >
          Volver
        </BadgeButton>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 items-start">
        <TitleView title="Detalle de Agente" />
        <div className="w-full flex items-center justify-between">
          <BadgeButton
            onClick={() => router.back()}
            iconVariant="back"
            variant="secondary"
          >
            Volver
          </BadgeButton>
          <OptionsMenuButton actions={menuActions} />
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
          <h1 className="text-2xl font-semibold">
            {realtor.stakeholder.name} {realtor.stakeholder.lastname}
          </h1>
          <p className="text-gray-500">{realtor.stakeholder.nickname}</p>
        </div>
      </div>

      <RealtorInfoCard
        realtor={realtor}
        calculateDaysInCompany={calculateDaysInCompany}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <PropertyStats id={realtor.stakeholder.id} />
        </div>

        <div className="xl:col-span-2">
          <PropertyCharts id={realtor.stakeholder.id} />
        </div>
      </div>
      <TitleCard
        title="Estadísticas"
        subtitle="Selecciona un rango de tiempo para poder verificarlas."
      />
      <div className="border-t border-gray-300 dark:border-white/10 pt-2"/>
      <GeneralStatCards realtorId={realtor.stakeholder.id} />
      <div className="border-t border-gray-300 dark:border-white/10 pt-2"/>
      <BillingStatCards realtorId={realtor.stakeholder.id} />
      <div className="border-t border-gray-300 dark:border-white/10 pt-2"/>
      <TitleView title="Gráfica" subtitle={`Visualiza datos detallados relacionados a ${realtor.stakeholder.nickname ? realtor.stakeholder.nickname : realtor.stakeholder.name}`}/>
      <DatesStats realtorId={realtor.stakeholder.id} />
    </div>
  );
  
}
