import { Card } from "@/shared/components/cards/card";
import { TitleCard } from "@/shared/components/text/TitleCard";

// Agregué los campos faltantes a la interfaz para que sea coherente
interface RealtorProps {
  realtor: {
    points: number;
    created_at: string;
    last_updated?: string;
    stakeholder: {
      email: string;
      phone: string;
      national_id: string;
    };
    company: {
      name: string;
      logo?: string;
    };
  };
  calculateDaysInCompany: (date: any) => number;
}

export default function RealtorInfoCard({
  realtor,
  calculateDaysInCompany,
}: RealtorProps) {
  return (
    <Card className="p-6">
      <TitleCard showDivider title="Información General" />

      <div className="mt-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-gray-400 text-sm font-medium">
            Correo Electrónico
          </span>
          <p className="text-gray-900 dark:text-white">
            {realtor.stakeholder?.email || "Sin correo"}
          </p>
        </div>
        <div>
          <span className="text-gray-400 text-sm font-medium">Teléfono</span>
          <p className="text-gray-900 dark:text-white">
            {realtor.stakeholder?.phone || "-"}
          </p>
        </div>
        <div>
          <span className="text-gray-400 text-sm font-medium">Cédula</span>
          <p className="text-gray-900 dark:text-white">
            {realtor.stakeholder?.national_id || "-"}
          </p>
        </div>
        <div>
          <span className="text-gray-400 text-sm font-medium">
            Fecha de Registro
          </span>
          <p className="text-gray-900 dark:text-white">
            {realtor.created_at
              ? new Date(realtor.created_at).toLocaleDateString()
              : "-"}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-300/50 dark:border-white/10 my-6" />


        <div className="flex flex-col-reverse md:flex-row  grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <TitleCard showDivider title="Información Empresa" />

            <div className="mt-4 flex items-center gap-4">
              <div className="size-10 rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#1a1a1a] flex-shrink-0 shadow-sm">
                {realtor.company.logo ? (
                  <img
                    src={realtor.company.logo}
                    alt={`${realtor.company.name} logo`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-secondary to-wine-red  text-white">
                    <span className="text-xl font-semibold uppercase">
                      {realtor.company.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <p>{realtor.company.name}</p>
            </div>

            <span className="text-gray-400 text-sm">
              Relacionado hace {calculateDaysInCompany(realtor.last_updated)}{" "}
              días
            </span>
          </div>

          <div className="md:hidden border-t border-gray-300/50 dark:border-white/10 my-4" />

          <div>
            <TitleCard showDivider title="Información Adicional" />

            <div className="mt-4">
              <span className="text-gray-400 text-sm">Total Puntos</span>

              <p>{realtor.points}</p>
            </div>
          </div>
        </div>
    </Card>
  );
}
