"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/core/config";

interface UserContextType {
  user: any | null;
  role: "admin" | "realtor" | "manager" | null;
  nickname: string;
  fullname: string;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  role: null,
  nickname: "",
  fullname: "",
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    
    // Función para cargar datos desde la DB
    const fetchProfile = async (currentUser: any) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("stakeholders")
        .select("nickname, name, lastname, role")
        .eq("id", currentUser.id)
        .single();

      if (data) {
        setUser(currentUser);
        setNickname(data.nickname || data.name);
        setFullname(`${data.name} ${data.lastname || ""}`.trim());
        setRole(data.role);
      }
      setLoading(false);
    };

    // ESCUCHADOR DE EVENTOS (Aquí está el truco)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        fetchProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        // Limpieza total instantánea
        setLoading(false);
      }
    });

    // Carga inicial (para cuando refrescas la página)
    supabase.auth.getUser().then(({ data: { user } }) => {
      fetchProfile(user);
    });

    // Limpiamos la suscripción al desmontar
    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <UserContext.Provider value={{ user, role, nickname, fullname, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};