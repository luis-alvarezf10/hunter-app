"use client";

import { UserProvider } from "@/core/context/UserContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {/* Aquí puedes meter más providers en el futuro, como el de Theme o TanStack Query */}
      {children}
    </UserProvider>
  );
}