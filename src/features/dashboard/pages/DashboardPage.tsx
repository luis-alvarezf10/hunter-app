"use client";

import { useUser } from "@/core/context/UserContext";
import { RealtorView } from "../views/RealtorView";

export function DashboardPage() {
  const { role, nickname } = useUser();

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-wrap gap-3 text-lg lg:text-2xl font-medium text-gray-900 dark:text-white">
        <span>Hola, <strong className="text-primary font-bold">{nickname}</strong>{" "}</span>
        <span>¡bienvenido de nuevo! 👋</span>
      </div>

      {role === "realtor" && <RealtorView />}
    </div>
  );
}
