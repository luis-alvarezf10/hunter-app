"use client";

import { createClient } from "@/core/config";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { IconButton } from "@/shared/components/buttons/IconButton";
import { ConfirmDialog } from "@/shared/components/dialogs";
import { SuccessDialog } from "@/shared/components/dialogs/SuccessDialog";
import { Dropdown } from "@/shared/components/inputs/Dropdown";
import { SearchBar } from "@/shared/components/inputs/SearchBar";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Cambiar esto
// ... denro del componente:

import { useState, useMemo } from "react";
import {
  HiDotsVertical,
  HiOutlineArrowNarrowUp,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineLocationMarker,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";

interface ScheduleItem {
  id: string;
  id_advisor: string;
  id_property: string;
  description: string;
  client_name: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
  property?: {
    name: string;
    address: string;
  };
}

interface Props {
  schedules: ScheduleItem[];
  onRefresh: () => void;
}

export default function ScheduleList({ schedules, onRefresh }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "upcoming" | "past">(
    "all",
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [dateToDelete, setDateToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shortDate = (dateStr: string) => {
    if (!dateStr) return "--/--/--";
    const date = new Date(dateStr + "T00:00:00");
    if (isNaN(date.getTime())) return "Fecha inválida";

    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    if (!time) return "Sin hora";
    let [hoursStr, minutes] = time.split(":");
    let hours = parseInt(hoursStr, 10);

    if (isNaN(hours)) return "--:--";

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
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
      Pendiente: "bg-amber-500",
      Confirmada: "bg-blue-500",
      Realizada: "bg-green-500 ",
      Cancelada: "bg-red-500",
      "No asistió": "bg-gray-500",
      Pospuesta: "bg-pink-500",
    };
    return (
      colors[status] ||
      "bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300"
    );
  };

  const getStatusBorderColor = (status: string) => {
    const colors: Record<string, string> = {
      Pendiente: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
      Confirmada: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
      Realizada: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
      Cancelada: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]",
      "No asistió": "bg-gray-500 shadow-[0_0_8px_rgba(107,114,128,0.4)]",
      Pospuesta: "bg-pink-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]",
    };

    return colors[status] || "bg-gray-500 shadow-none";
  };

  const handleDeleteDate = async (DateId: string) => {
    setDateToDelete(DateId);
    setShowDeleteDialog(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!dateToDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("schedule")
        .delete()
        .eq("id", dateToDelete);

      if (error) throw error;

      setShowDeleteDialog(false);
      setShowSuccessDialog(true);

      setTimeout(() => {
        if (onRefresh) {
          onRefresh();
        }
        setDateToDelete(null);
      }, 1000);

      setDateToDelete(null);
      console.log("Cita eliminada correctamente");
    } catch (err: any) {
      console.error("Error eliminando cita:", err);
      alert(`Error al eliminar la cita: ${err.message || "Error desconocido"}`);
    }
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
          <div className="flex items-end gap-2 text-sm text-gray-600 dark:text-gray-400">
            <HiOutlineClipboardList className="w-5 h-5" />
            <span className="font-semibold">Total de citas:</span>
            <span>{filteredAndSortedSchedules.length}</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="w-full">
        {/* Header - Solo visible en MD+ */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-100 dark:bg-white/5 rounded-t-xl border-x border-t border-gray-300 dark:border-white/10 text-xs uppercase font-semibold text-gray-600 dark:text-gray-300">
          <div className="col-span-3">Cliente</div>
          <div className="col-span-3">Propiedad</div>
          <div className="col-span-2 text-center">Fecha / Hora</div>
          <div className="col-span-2 text-center">Estado</div>
          <div className="col-span-2 text-center">Acciones</div>
        </div>

        <div className="space-y-4 md:space-y-0 md:border md:border-gray-300 md:dark:border-white/10 md:rounded-b-xl overflow-hidden">
          {Object.entries(groupedSchedules).map(([date, items]) => (
            <div key={date}>
              {/* Separador de Fecha - Sticky para mejor UX */}

              <div className="md:hidden sticky top-0 mb-5 z-10 py-2 flex items-center justify-center gap-3">
                <div className="flex-1 bg-gray-300 dark:bg-white/20 h-0.5 rounded-full " />
                <span className="text-xs font-black uppercase tracking-widest dark:text-secondary">
                  {formatDate(date)}
                </span>
                <div className="flex-1 bg-gray-300 dark:bg-white/20 h-0.5 rounded-full " />
              </div>
              {items.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-white dark:bg-[#1a1a1a] flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 p-6 md:px-6 md:py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors shadow-sm md:shadow-none mb-3 md:mb-0 rounded-2xl md:rounded-none"
                >
                  {/* Columna 1: Cliente */}
                  <div className="col-span-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-1 h-10 rounded-full shrink-0 ${getStatusBorderColor(schedule.status)}`}
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate text-sm">
                          {schedule.client_name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate italic">
                          {schedule.description}
                        </p>
                      </div>
                    </div>
                    <div className="md:hidden text-center flex flex-col gap-1">
                      <span className="text-sm font-medium ">
                        {/* Asumiendo que tienes la hora o la extraes de la fecha */}
                        {shortDate(schedule.date)}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {formatTime(schedule.time)}
                      </span>
                    </div>
                    {/* <span
                      className={`md:hidden px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-white ${getStatusColor(schedule.status)}`}
                    >
                      {schedule.status}
                    </span> */}
                  </div>

                  {/* Columna 2: Propiedad */}
                  <div className="col-span-3 flex border-t md:border-none gap-1 pt-7 md:pt-0">
                    <div className="flex items-start gap-1 justify-between w-full">
                      {schedule.property ? (
                        <>
                          <div className="flex items-start gap-1">
                            <HiOutlineLocationMarker />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {schedule.property.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {schedule.property.address}
                              </p>
                            </div>

                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Sin propiedad asignada
                        </span>
                      )}
                      <div className="relative">
                        <IconButton
                          icon={<HiDotsVertical className="text-lg w-5 h-5" />}
                          variant="outline"
                          className="md:hidden flex-1 md:flex-none w-12 h-12"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === schedule.id ? null : schedule.id,
                            )
                          }
                        />
                        <AnimatePresence>
                          {openMenuId === schedule.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 bottom-full md:-bottom-3 md:right-full md:mr-2 mb-2 md:mb-0 w-48  bg-white/90 dark:bg-[#1a1a1a]/90 dark:border-1 border-white/30 rounded-2xl shadow-lg z-[100] backdrop-blur-sm"
                            >
                              <button
                                onClick={() => {
                                  router.push(
                                    `/schedule/add?id=${schedule.id}`,
                                  );
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2 rounded-t-2xl cursor-pointer"
                              >
                                <HiOutlinePencil className="text-lg" />
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteDate(schedule.id);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 rounded-b-2xl cursor-pointer"
                              >
                                <HiOutlineTrash className="text-lg" />
                                Eliminar
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Columna 3: Fecha/Hora */}
                  <div className="col-span-2 hidden md:text-center md:flex flex-col gap-1">
                    <span className="text-sm font-medium ">
                      {/* Asumiendo que tienes la hora o la extraes de la fecha */}
                      {shortDate(schedule.date)}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {formatTime(schedule.time)}
                    </span>
                  </div>

                  {/* Columna 4: Estado */}
                  <div className="col-span-2 hidden md:flex md:justify-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-white ${getStatusColor(schedule.status)}`}
                    >
                      {schedule.status}
                    </span>
                  </div>

                  {/* Columna 5: Acciones */}
                  <div className="col-span-2 flex items-center justify-center gap-2 pt-3 md:pt-0">
                    <div className="hidden md:block relative">
                      <IconButton
                        icon={<HiDotsVertical className="text-lg w-5 h-5" />}
                        variant="outline"
                        className="flex-1 md:flex-none w-12 h-12"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === schedule.id ? null : schedule.id,
                          )
                        }
                      />
                      <AnimatePresence>
                        {openMenuId === schedule.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 bottom-full md:-bottom-3 md:right-full md:mr-2 mb-2 md:mb-0 w-48  bg-white/90 dark:bg-[#1a1a1a]/90 dark:border-1 border-white/30 rounded-2xl shadow-lg z-[100] backdrop-blur-sm"
                          >
                            <button
                              onClick={() => {
                                router.push(`/schedule/add?id=${schedule.id}`);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2 rounded-t-2xl cursor-pointer"
                            >
                              <HiOutlinePencil className="text-lg" />
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteDate(schedule.id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 rounded-b-2xl cursor-pointer"
                            >
                              <HiOutlineTrash className="text-lg" />
                              Eliminar
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedSchedules.length === 0 && (
          <div className="bg-white dark:bg-[#1a1a1a] p-12 text-center border border-dashed border-gray-300 dark:border-white/10 rounded-b-2xl">
            <div className="inline-flex items-center  justify-center mb-4">
              <HiOutlineCalendar className="text-5xl text-gray-400 dark:text-white/10" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "No se encontraron citas con los filtros aplicados"
                : "No se encontraron citas"}
            </p>
          </div>
        )}

        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Eliminar Cita"
          message="¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
        />

        <SuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          title="¡Cita Eliminada!"
          message="La cita se ha eliminado de tu agenda exitosamente."
        />
      </div>
    </div>
  );
}
