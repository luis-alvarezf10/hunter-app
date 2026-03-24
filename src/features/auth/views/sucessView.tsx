"use client"; // No olvides esto si usas useRouter

import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { useRouter } from "next/navigation";
import { HiOutlineCheck } from "react-icons/hi";

interface SuccessViewProps {
  name: string;
  email: string;
}

export default function SuccessView({ name, email }: SuccessViewProps) {
  const router = useRouter();
  
  return (
    <div className="h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="group max-w-md w-full bg-white dark:bg-[#1a1a1a] p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 text-center space-y-6 animate-in fade-in zoom-in duration-300">
        
        <div className="flex items-center justify-center">
          <div className="icon-animate size-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-b-1 border-t-1 border-transparent group-hover:scale-110 group-hover:dark:border-t-white/10 bg-emerald-500 text-white dark:bg-emerald-500/10 group-hover:dark:border-b-emerald-500 dark:text-emerald-500">
            <HiOutlineCheck className="text-3xl" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ¡Casi listo, {name}!
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Hemos enviado un correo de confirmación a <br />
            <span className="font-semibold text-gray-900 dark:text-white">
              {email}
            </span>
          </p>
        </div>

        <div className="bg-amber-500 dark:bg-amber-500/10 p-4 rounded-2xl border border-transparent dark:border-amber-500/10 text-sm text-white dark:text-amber-400 text-left">
          <strong>Nota:</strong> Si no lo ves en unos minutos, revisa tu
          carpeta de <b>Spam</b> o correo no deseado.
        </div>

        <ActionButton
          onClick={() => router.push("/auth/login")}
          variant="secondary"
          className="w-full"
          // size="lg" // Asegúrate que tu ActionButton acepte size="lg"
          iconVariant="redirect"
        >
          Ir al inicio de sesión
        </ActionButton>
      </div>
    </div>
  );
}