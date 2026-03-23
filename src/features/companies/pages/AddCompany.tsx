"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeButton } from "@/shared/components/buttons/BadgeButton";
import { TitleView } from "@/shared/components/text/TitleView";
import { CustomField } from "@/shared/components/inputs/CustomField";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { StatusPropertyBadge } from "@/shared/components/badges/StatusPropertyBadge";
import { IconButton } from "@/shared/components/buttons/IconButton";
import { HiOutlineTrash } from "react-icons/hi";

interface Property {
  id: string;
  title: string;
  address: string;
  description: string;
  status: string;
}

export default function AddCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
 

  return (
    <>
      <div className="p-8 space-y-6 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 items-start">
          <TitleView
            title="Nueva cita"
            subtitle="Complete los datos para programar una nueva cita"
          />
          <BadgeButton
            onClick={() => router.back()}
            iconVariant="back"
            variant="secondary"
          >
            Volver
          </BadgeButton>
        </div>

       
      </div>

    </>
  );
}
