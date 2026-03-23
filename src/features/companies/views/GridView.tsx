import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { OptionsMenuButton } from "@/shared/components/buttons/OptionsMenuButton";
import { Card } from "@/shared/components/cards/card";
import { useRouter } from "next/navigation";
import { HiOutlineFlag, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Flag from "react-world-flags";

interface companyItem {
  id: string;
  name: string;
  logo: string;
  country: string;
  country_code: string;
  rif: string;
  created_at: string;
}

interface Props {
  items: companyItem[];
  onRefresh: () => void;
}

export function GridView({ items, onRefresh }: Props) {
  const router = useRouter();
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

  return (
    <>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {items.map((company) => (
            <Card key={company.id}>
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#1a1a1a] flex-shrink-0 shadow-sm">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-secondary to-wine-red  text-white">
                          <span className="text-xl font-semibold uppercase">
                            {company.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white capitalize">
                        {company.name}
                      </h3>
                    </div>
                    
                  </div>
                  <div className="z-10 w-6 h-6 overflow-hidden rounded-xl shadow-md">
                  <Flag 
                    code={company.country_code} 
                    fallback={<HiOutlineFlag />}
                    className="w-full h-full object-cover" 
                  />
                </div>
                </div>
                <div className="flex gap-3">
                  <ActionButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    Ver detalles
                  </ActionButton>
                  <OptionsMenuButton
                    actions={menuActions}
                    position="top"
                    align="right"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No hay empresas disponibles.
          </p>
        </div>
      )}
    </>
  );
}
