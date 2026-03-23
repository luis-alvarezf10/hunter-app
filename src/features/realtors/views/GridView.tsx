import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { IconButton } from "@/shared/components/buttons/IconButton";
import { OptionsMenuButton } from "@/shared/components/buttons/OptionsMenuButton";
import { Card } from "@/shared/components/cards/card";
import { useRouter } from "next/navigation";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

interface realtorItem {
  id: string;
  national_id: string | null;
  name: string;
  lastname: string;
  nickname: string;
  ui_color: string;
  created_at: string;
  company?: {
      name: string;
    };
}

interface Props {
    items: realtorItem[];
    onRefresh: () => void;
}

export default function GridView({ items, onRefresh }: Props) {
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
    <div>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {items.map((realtor) => (
            <Card key={realtor.id}>
              <div className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div
                    className="size-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-transform group-hover:scale-105 ring-2 ring-white/10"
                    style={{
                      backgroundColor: realtor.ui_color,
                      boxShadow: `0 0 15px ${realtor.ui_color}40`,
                    }}
                  >
                    {realtor.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {realtor.name} {realtor.lastname}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {realtor.nickname}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Empresa:</span>{" "}
                    {realtor.company?.name || "No asignada"}
                  </p>
                </div>
                <div className="flex gap-3">
                    <ActionButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    >
                        Ver detalles
                    </ActionButton>
                  <OptionsMenuButton actions={menuActions} position="top" align="right" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No hay agentes disponibles.
          </p>
        </div>
      )}
    </div>
  );
}
