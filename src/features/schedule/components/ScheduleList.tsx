"use client";

import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { Dropdown } from "@/shared/components/inputs/Dropdown";
import { SearchBar } from "@/shared/components/inputs/SearchBar";
import { useState, useMemo } from "react";
import {
  HiOutlineArrowNarrowUp,
  HiOutlineClipboardList,
} from "react-icons/hi";

interface ScheduleItem {
  id: string;
  description: string;
  client_name: string;
  date: string;
  time: string;
  status: string;
  property?: {
    name: string,
    address: string
  };
}

interface Props {
  schedules: ScheduleItem[];
  onRefresh: () => void;
}

export default function ScheduleList({ schedules }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "upcoming" | "past">(
    "all",
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  

  const filteredAndSortedSchedules = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = schedules.filter((schedule) => {
      // Search filter
      const matchesSearch =
        schedule.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        schedule.property?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        schedule.property?.address
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Date filter
      const scheduleDate = new Date(schedule.date + "T00:00:00");
      scheduleDate.setHours(0, 0, 0, 0);

      if (filterType === "upcoming") {
        if (scheduleDate < today) return false;
      } else if (filterType === "past") {
        if (scheduleDate >= today) return false;
      }

      // Status filter
      if (filterStatus !== "all" && schedule.status !== filterStatus) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [schedules, searchTerm, filterType, filterStatus, sortOrder]);

  const groupedSchedules = filteredAndSortedSchedules.reduce(
    (acc, schedule) => {
      const date = schedule.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(schedule);
      return acc;
    },
    {} as Record<string, ScheduleItem[]>,
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pendiente:
        "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
      Confirmada:
        "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
      Realizada:
        "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
      Cancelada: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
      "No asistió":
        "bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300",
      Pospuesta:
        "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
    };
    return (
      colors[status] ||
      "bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300"
    );
  };

  const getStatusBorderColor = (status: string) => {
    const colors: Record<string, string> = {
      Pendiente: "bg-amber-500",
      Confirmada: "border-l-blue-500 dark:border-l-blue-600",
      Realizada: "border-l-green-500 dark:border-l-green-600",
      Cancelada: "border-l-red-500 dark:border-l-red-600",
      "No asistió": "border-l-gray-500 dark:border-l-gray-600",
      Pospuesta: "border-l-purple-500 dark:border-l-purple-600",
    };
    return colors[status] || "border-l-gray-500 dark:border-l-gray-600";
  };

  return (
    <div className="">
      {/* Filters */}
      <div className="flex flex-col gap-4 my-5">
        <div className="flex flex-col md:flex-row justify-between gap-3">
          {/* Search */}
          <div className="">
            <SearchBar
              value={searchTerm}
              placeholder="Buscar cita por cliente"
              onChange={(value) => setSearchTerm(value)}
            />
          </div>

          {/* Filter Type */}
          <div className="flex flex-wrap md:flex-row gap-2 items-center ">
            <Dropdown
              options={[
                { value: "all", label: "Todas" },
                { value: "upcoming", label: "Próximas" },
                { value: "past", label: "Pasadas" },
              ]}
              value={filterType}
              onChange={(value) =>
                setFilterType(value as "all" | "upcoming" | "past")
              }
              placeholder="Por período"
            />
            <Dropdown
              options={[
                { value: "all", label: "Todos" },
                { value: "Pendiente", label: "Pendiente" },
                { value: "Confirmada", label: "Confirmada" },
                { value: "Realizada", label: "Realizada" },
                { value: "Cancelada", label: "Cancelada" },
                { value: "No asistió", label: "No asistió" },
                { value: "Pospuesta", label: "Pospuesta" },
              ]}
              value={filterStatus}
              onChange={(value) => setFilterStatus(value ?? "all")}
              placeholder="Por Status"
            />
            <ActionButton
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              variant="glass"
              size="sm"
            >
              <span className="text-sm">
                {sortOrder === "asc" ? "Más antiguas" : "Más recientes"}
              </span>
              <div
                className={`transition-transform duration-300 ${sortOrder === "desc" ? "rotate-180" : "rotate-0"}`}
              >
                <HiOutlineArrowNarrowUp />
              </div>
            </ActionButton>
          </div>
        </div>

        {/* Stats */}
        <div className="pt-4 border-t border-gray-300/50 dark:border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <HiOutlineClipboardList className="w-5 h-5" />
            <span>
              {filteredAndSortedSchedules.length} cita
              {filteredAndSortedSchedules.length !== 1 ? "s" : ""}
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? " encontrada"
                : ""}
              {filteredAndSortedSchedules.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="w-full">
  {/* Header - Solo visible en MD+ */}
  <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-100 dark:bg-white/5 rounded-t-xl border-x border-t border-gray-300 dark:border-white/10 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
    <div className="col-span-3">Cliente</div>
    <div className="col-span-3">Propiedad</div>
    <div className="col-span-2 text-center">Fecha / Hora</div>
    <div className="col-span-2 text-center">Estado</div>
    <div className="col-span-2 text-right">Acciones</div>
  </div>

  <div className="space-y-4 md:space-y-0 md:border md:border-gray-300 md:dark:border-white/10 md:rounded-b-xl overflow-hidden">
    {Object.entries(groupedSchedules).map(([date, items]) => (
      <div key={date}>
        {/* Separador de Fecha - Sticky para mejor UX */}
        <div className="sticky top-0 z-10 bg-gray-50/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm px-6 py-2 border-y border-gray-300 dark:border-white/10">
          <span className="text-xs font-black uppercase tracking-widest text-[#6b1e2e] dark:text-red-400">
            {formatDate(date)}
          </span>
        </div>

        {items.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white dark:bg-[#1a1a1a] md:grid md:grid-cols-12 md:items-center gap-4 p-4 md:px-6 md:py-4 border-x border-b border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors shadow-sm md:shadow-none mb-3 md:mb-0 mx-2 md:mx-0 rounded-2xl md:rounded-none"
          >
            {/* Columna 1: Cliente */}
            <div className="col-span-3 flex items-center gap-3 mb-2 md:mb-0">
              <div className={`w-1 h-10 rounded-full shrink-0 ${getStatusBorderColor(schedule.status)}`} />
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm">
                  {schedule.client_name}
                </h3>
                <p className="text-xs text-gray-500 truncate italic">{schedule.description}</p>
              </div>
            </div>

            {/* Columna 2: Propiedad */}
            <div className="col-span-3 mb-3 md:mb-0 flex items-center gap-1 text-gray-600 dark:text-gray-400">
              {schedule.property ? (
                <>
                  <span className="material-symbols-outlined text-sm shrink-0">location_on</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{schedule.property.name}</p>
                    <p className="text-[10px] opacity-70 truncate">{schedule.property.address}</p>
                  </div>
                </>
              ) : (
                <span className="text-xs text-gray-400 italic">Sin propiedad asignada</span>
              )}
            </div>

            {/* Columna 3: Fecha/Hora */}
            <div className="col-span-2 md:text-center mb-3 md:mb-0">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                {/* Asumiendo que tienes la hora o la extraes de la fecha */}
                {schedule.time || "--:--"}
              </span>
            </div>

            {/* Columna 4: Estado */}
            <div className="col-span-2 flex md:justify-center mb-4 md:mb-0">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(schedule.status)}`}>
                {schedule.status}
              </span>
            </div>

            {/* Columna 5: Acciones */}
            <div className="col-span-2 flex items-center justify-end gap-2 border-t md:border-none pt-3 md:pt-0">
              
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>

  {/* Empty State */}
  {filteredAndSortedSchedules.length === 0 && (
    <div className="mt-4 bg-white dark:bg-[#1a1a1a] rounded-2xl p-12 text-center border border-dashed border-gray-300 dark:border-white/10">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
        <span className="material-symbols-outlined text-3xl text-gray-400">calendar_today</span>
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-medium">
        {searchTerm || filterType !== "all" || filterStatus !== "all"
          ? "No se encontraron citas con los filtros aplicados"
          : "No tienes citas programadas"}
      </p>
    </div>
  )}
</div>
      </div>
  );
}
