"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/core/config/supabase";
import { ClientsList } from "../components";
import { LoadSpin } from "@/shared/components/spins/LoadSpin";
import { TitleView } from "@/shared/components/text/TitleView";

interface Client {
  id: string;
  name: string;
  last_name: string;
  national_id: string;
  phone: string;
  created_at: string;
  properties: Array<{
    id: string;
    title: string;
    address: string;
    status: string;
  }>;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("No user found");
        return;
      }

      // Get properties where the user is the advisor
      const { data: properties, error: propertiesError } = await supabase
        .from("properties")
        .select("id, title, address, status, id_owner")
        .eq("id_advisor", user.id);

      if (propertiesError) throw propertiesError;

      // Get unique client IDs
      const clientIds = [
        ...new Set(properties?.map((p) => p.id_owner).filter(Boolean)),
      ];

      if (clientIds.length === 0) {
        setClients([]);
        setLoading(false);
        return;
      }

      // Get clients data
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .in("id", clientIds);

      if (clientsError) throw clientsError;

      // Map clients with their properties
      const clientsWithProperties =
        clientsData?.map((client) => ({
          ...client,
          properties: properties?.filter((p) => p.id_owner === client.id) || [],
        })) || [];

      console.log("Clients loaded:", clientsWithProperties);
      setClients(clientsWithProperties);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoadSpin />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <TitleView
        title="Clientes"
        subtitle="Visualiza la lista de clientes relacionados contigo"
      />
      <ClientsList clients={clients} onRefresh={fetchClients} />
    </div>
  );
}
