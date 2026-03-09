"use client";

import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { Dropdown } from "@/shared/components/inputs/Dropdown";
import { SearchBar } from "@/shared/components/inputs/SearchBar";
import { useState, useMemo } from "react";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
} from "react-icons/hi";

interface ScheduleItem {
  id: string;
  description: string;
  client_name: string;
  date: string;
  status: string;
  property?: {
    name: string;
    address: string;
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div>
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
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
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
      <div className="space-y-6">
        {Object.entries(groupedSchedules).map(([date, items]) => (
          <div
            key={date}
            className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow dark:shadow-gray-800 p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-4 capitalize text-gray-900 dark:text-white">
              {formatDate(date)}
            </h3>
            <div className="space-y-3">
              {items.map((schedule) => (
                <div
                  key={schedule.id}
                  className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {schedule.client_name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {schedule.description}
                      </div>
                      {schedule.property && (
                        <div className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                          📍 {schedule.property.name} -{" "}
                          {schedule.property.address}
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(schedule.status)}`}
                    >
                      {schedule.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredAndSortedSchedules.length === 0 && (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow dark:shadow-gray-800 p-12 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            {searchTerm || filterType !== "all" || filterStatus !== "all"
              ? "No se encontraron citas con los filtros aplicados"
              : "No tienes citas programadas"}
          </div>
        )}
      </div>
    </div>
  );
}
