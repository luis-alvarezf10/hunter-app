"use client";

import { Dropdown } from "@/shared/components/inputs/Dropdown";
import { SearchBar } from "@/shared/components/inputs/SearchBar";
import { DataTable } from "@/shared/components/tables/DataTable";
import { useState, useMemo } from "react";
import {
  HiOutlineUserGroup,
  HiOutlineEye,
  HiOutlineTrash,
} from "react-icons/hi";

// 1. Asegúrate de que las interfaces estén claras
interface Property {
  id: string;
  title: string;
  address: string;
  status: string;
}

interface Client {
  id: string;
  name: string;
  last_name: string;
  national_id: string;
  phone: string;
  created_at: string;
  properties: Property[];
}

interface Props {
  clients: Client[];
  onRefresh: () => void;
}

export default function ClientsList({ clients }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "properties">("name");

  // ... (Tu lógica de filteredAndSortedClients se mantiene igual)
  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter((client) => {
      const fullName = `${client.name} ${client.last_name}`.toLowerCase();
      const search = searchTerm.toLowerCase();
      return (
        fullName.includes(search) ||
        client.national_id.includes(search) ||
        client.properties.some(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.address?.toLowerCase().includes(search),
        )
      );
    });

    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return `${a.name} ${a.last_name}`.localeCompare(
          `${b.name} ${b.last_name}`,
        );
      }
      return b.properties.length - a.properties.length;
    });

    return filtered;
  }, [clients, searchTerm, sortBy]);

  // 2. Definir los datos agrupados
  const tableData = {
    "Clientes Registrados": filteredAndSortedClients,
  };

  // 3. TIPAR LAS COLUMNAS (Esto elimina el error de 'any')
  const clientColumns = [
    {
      header: "Cliente",
      // En móvil (col-span-7) ocupa casi todo el ancho. En desktop (md:col-span-4) se ajusta.
      className: "col-span-7 md:col-span-4",
      accessor: (client: Client) => (
        <div className="flex items-center justify-between gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-b from-secondary to-wine-red dark:from-secondary/50 dark:to-wine-red/30 dark:border-t-1 border-white/30 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-base md:text-sm font-semibold text-white dark:text-secondary/80">
                {client.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-lg md:text-sm text-gray-900 dark:text-white truncate">
                {client.name} {client.last_name}
              </h3>
            </div>
          </div>
          <div className="md:hidden flex flex-col items-center">
            <span className="text-xs text-gray-500  uppercase tracking-tighter">
              Props
            </span>
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {client.properties.length}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Cédula",
      className: "col-span-2 text-center",
      hideOnMobile: true, // Se oculta en móvil porque ya la pusimos arriba en el subtítulo
      accessor: (client: Client) => (
        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          V-{client.national_id}
        </span>
      ),
    },
    {
      header: "Teléfono",
      className: "col-span-2 text-center",
      hideOnMobile: true, // Se oculta en móvil
      accessor: (client: Client) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {client.phone}
        </span>
      ),
    },
    {
      header: "Propiedades",
      className: "col-span-3 md:col-span-2 text-center",
      hideOnMobile: true,
      // En móvil mostramos solo el número para que no ocupe espacio
      accessor: (client: Client) => (
        <div className="flex flex-col items-center">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">
            {client.properties.length}
          </span>
          <span className="text-[10px] text-gray-500 md:hidden uppercase tracking-tighter">
            Props
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <SearchBar
            value={searchTerm}
            placeholder="Buscar por nombre o CI..."
            onChange={(value) => setSearchTerm(value)}
          />
        </div>
        <Dropdown
          options={[
            { value: "name", label: "Nombre (A-Z)" },
            { value: "properties", label: "Más propiedades" },
          ]}
          value={sortBy}
          onChange={(value) => setSortBy(value as "name" | "properties")}
        />
      </div>

      {/* Info Stats */}
      <div className="pt-4 border-t border-gray-300/50 dark:border-white/10">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <HiOutlineUserGroup className="w-5 h-5" />
          <span className="font-semibold">Total de clientes:</span>
          <span>{filteredAndSortedClients.length}</span>
        </div>
      </div>

      {/* DataTable principal */}
      <div className="w-full">
        <DataTable<Client> // <-- Pasamos el tipo Client aquí también
          data={tableData}
          columns={clientColumns}
          actions={[
            {
              label: "Ver detalles",
              icon: <HiOutlineEye />,
              onClick: (c) => console.log(c),
            },
            {
              label: "Eliminar",
              icon: <HiOutlineTrash />,
              onClick: (c) => {},
              isDanger: true,
            },
          ]}
        />

        {/* Empty State */}
        {filteredAndSortedClients.length === 0 && (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-12 text-center border border-gray-200 dark:border-white/10 mt-4 text-gray-500">
            {searchTerm
              ? "No se encontraron coincidencias"
              : "No hay clientes registrados"}
          </div>
        )}
      </div>
    </div>
  );
}
