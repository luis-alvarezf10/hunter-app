"use client";
import { useEffect, useRef, Suspense } from "react";
import { createClient } from "@/core/config";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingPage } from "@/shared/pages/LoadingPage";

// 1. Extraemos la lógica a un componente interno
function AuthCallbackContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProcessing = useRef(false);

  useEffect(() => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    const completeRegistration = async () => {
      // 1. Intercambiar el código por la sesión
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session?.user) {
        console.error("Error de sesión:", authError);
        router.push("/auth/login");
        return;
      }

      // 2. Extraer los datos de la URL
      const national_id = searchParams.get("national_id");
      const name = searchParams.get("name");
      const lastname = searchParams.get("lastname");
      const birthdate = searchParams.get("birthdate");
      const id_company = searchParams.get("id_company");

      if (national_id) {
        console.log("Datos detectados, insertando en stakeholders...");
        
        // 3. Inserción manual en stakeholders
        const { error: dbError } = await supabase.from("stakeholders").upsert({
          id: session.user.id,
          national_id: national_id,
          name: name,
          lastname: lastname,
          role: "realtor",
          ui_color: "#8b0f08",
          birthdate: birthdate,
        });

        // 4. Inserción en realtors
        if (!dbError && id_company) {
          await supabase.from("realtors").upsert({
            id_realtor: session.user.id,
            id_company: id_company,
          });
        }
      }

      router.push("/dashboard");
    };

    completeRegistration();
  }, [supabase, router, searchParams]);

  return <LoadingPage />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <AuthCallbackContent />
    </Suspense>
  );
}