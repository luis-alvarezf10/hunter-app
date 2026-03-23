"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/core/config/supabase";
import { useRouter } from "next/navigation";
import { TitleView } from "@/shared/components/text/TitleView";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import ViewToggle from "@/shared/components/buttons/ViewToggleButton";
import { LoadSpin } from "@/shared/components/spins/LoadSpin";

import { SearchBar } from "@/shared/components/inputs/SearchBar";
import { GridView } from "../views/GridView";

interface companyItem {
  id: string;
  name: string;
  logo: string;
  country: string;
  country_code: string;
  rif: string;
  created_at: string;
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<companyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      const { data: fetchedData, error: fetchError } = await supabase
        .from("companies")
        .select(`*`)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const transformedData: companyItem[] = (fetchedData || []).map(
        (item: any) => {
          return {
            id: item.id,
            name: item.name || "",
            logo: item.logo,
            country: item.country,
            country_code: item.country_code,
            rif: item.rif || "",
            created_at: item.created_at,
          };
        },
      );

      setCompanies(transformedData);
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };
  const filteredCompanies = companies.filter((company) => {
    const search = searchTerm.toLowerCase();

    return (
      company.name.toLowerCase().includes(search) ||
      company.rif.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoadSpin />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TitleView
          title="Empresas Registradas"
          subtitle="Empresas inmobiliarias aliadas a go hunter app."
        />
        <ActionButton
          className="w-full md:w-auto justify-center"
          onClick={() => router.push("/companies/add")}
          iconVariant="add"
        >
          Nueva Empresa
        </ActionButton>
      </div>
      <div className="flex gap-3 items-center justify-between">
        <div className="w-full md:w-1/2">
          <SearchBar
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            placeholder="Buscar por nombre o rif"
          />
        </div>
        <div className="hidden md:block ">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>
      <div className="border-b border-white/10 py-1">
        <span>Total empresas: </span>
        <span className="font-semibold">{filteredCompanies.length}</span>
      </div>
      {viewMode === "grid" ? (
        <GridView items={filteredCompanies} onRefresh={fetchCompanies}/>
      ) : (
        <div>chao</div>
      )}
    </div>
  );
}
