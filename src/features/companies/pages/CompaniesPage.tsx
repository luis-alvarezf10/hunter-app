"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/core/config/supabase";
import { useRouter } from "next/navigation";
import { TitleView } from "@/shared/components/text/TitleView";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import ViewToggle from "@/shared/components/buttons/ViewToggleButton";
import { LoadSpin } from "@/shared/components/spins/LoadSpin";

import { SearchBar } from "@/shared/components/inputs/SearchBar";

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
        .select(
          `*`,
        )
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
            subtitle="Empresa inmobiliarias aliadas a go hunter app."
          />
        <ActionButton
          className="w-full md:w-auto justify-center" 
          onClick={() => router.push("")}
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
      {viewMode === "grid" ? (
        <div>
            {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {company.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {company.rif}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {company.country}
                    </span>
                    <ActionButton
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/companies/${company.id}`)}
                    >
                      Ver detalles
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No hay empresas disponibles.
            </p>
          </div>
        )}
            
        </div>
      ) : (
        <div>chao</div>
      )}
    </div>
  );
}
