"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/core/config/supabase";
import { BaseDialog } from "@/shared/components/dialogs/BaseDialog";
import { TitleCard } from "@/shared/components/text/TitleCard";
import { SearchBar } from "@/shared/components/inputs/SearchBar";
import { LoadSpin } from "@/shared/components/spins/LoadSpin";
import { div } from "framer-motion/client";
import { DecoratorPropertyBadge } from "@/shared/components/badges/DecoratorPropertyBadge";
import { HiOutlineHome, HiOutlineLocationMarker } from "react-icons/hi";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { createPortal } from "react-dom";

interface Property {
  id: string;
  title: string;
  address: string;
  description: string;
  status: string;
  image?: string;
}

interface companyItem {
  id: string;
  name: string;
  logo: string;
  country: string;
  country_code: string;
  rif: string;
  created_at: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: companyItem) => void;
}

export default function CompanySearchDialog({
  isOpen,
  onClose,
  onSelect,
}: Props) {
  const [companies, setCompanies] = useState<companyItem[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<companyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(
        (property) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.rif.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      setCompanies(data || []);
      setFilteredCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: companyItem) => {
    onSelect(item);
    setSearchTerm("");
  };

  if (!isOpen) return null;

  const dialogContent = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="overlay-animate absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Dialog */}
      <BaseDialog className="group max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300 dark:border-white/10">
          <TitleCard title="Busca una empresa inmobiliaria" />
        </div>
        {/* Search */}
        <div className="p-6 border-b border-gray-300 dark:border-white/10">
          <SearchBar
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            placeholder="Buscar por títutlo o dirección"
          />
        </div>
        {/* Content */}
        <div className="p-1 overflow-y-auto max-h-[calc(50vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center p-10">
              <LoadSpin />
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "No se encontraron propiedades"
                : "No tienes propiedades registradas"}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleSelect(company)}
                  className="border border-gray-300/50 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiOutlineHome className="text-2xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 min-w-0">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate text-sm md:text-base">
                          {company.name}
                        </h3>
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-300/50 dark:border-white/10">
          <ActionButton onClick={onClose} variant="secondary">
            Cerrar
          </ActionButton>
        </div>
      </BaseDialog>
    </div>
  );
  return createPortal(dialogContent, document.body);
}
