"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/core/config"; // Tu config de supabase
import { CustomField } from "@/shared/components/inputs/CustomField";
import { ActionButton } from "@/shared/components/buttons/ActionButton";
import { TitleView } from "@/shared/components/text/TitleView";
import { HiOutlineCheck } from "react-icons/hi";
import { FilledIcon } from "@/shared/components/icons/FilledIcon";
import { LogoImage } from "@/shared/components/images/LogoImage";
import { fireSuccessConfetti } from "@/shared/components/animations/FireSuccessConfetti";
import { SuccessDialog } from "@/shared/components/dialogs/SuccessDialog";

function RealtorRegisterForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const router = useRouter();
  const supabase = createClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // Capturamos el ID de la empresa desde la URL (?company_id=...)
  const companyId = searchParams.get("company_id");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    birthdate: "",
    national_id: "",
    confirm_password: "",
  });
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      nextStep();
      return; // Detenemos la ejecución aquí para que NO toque Supabase todavía
    }
    if (formData.password !== formData.confirm_password) {
      setIsError(true);
      return;
    }
    if (!companyId)
      return alert("Link de invitación inválido (Falta Company ID)");

    setLoading(true);

    try {
      // 1. Crear el usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.name} ${formData.lastname}`,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo crear el usuario");

      // 2. Insertar en la tabla stakeholders
      const { error: dbError } = await supabase.from("stakeholders").insert({
        id: authData.user.id,
        national_id: formData.national_id,
        name: formData.name,
        lastname: formData.lastname,
        role: "realtor",
        ui_color: "#8b0f08",
        birthdate: formData.birthdate,
      });

      if (dbError) throw dbError;

      const { error: relError } = await supabase.from("realtors").insert({
        id_realtor: authData.user.id,
        id_company: companyId,
      });

      if (relError) throw relError;
      fireSuccessConfetti();
      setIsSuccess(true);
    } catch (error: any) {
      alert(error.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };
  if (isSuccess) {
    return (
      <div className="h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="group max-w-md w-full bg-white dark:bg-[#1a1a1a] p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-center">
            <div
              className={`icon-animate size-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-b-1 border-t-1 border-transparent group-hover:scale-110 group-hover:dark:border-t-white/10 bg-emerald-500 text-white dark:bg-emerald-500/10 group-hover:dark:border-b-emerald-500 dark:text-emerald-500 `}
            >
              <HiOutlineCheck className="text-3xl" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ¡Casi listo, {formData.name}!
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Hemos enviado un correo de confirmación a <br />
              <span className="font-semibold text-gray-900 dark:text-white">
                {formData.email}
              </span>
            </p>
          </div>

          <div className="bg-amber-500 dark:bg-amber-500/10 p-4 rounded-2xl border-1  dark:border-amber-500/10 text-sm text-white dark:text-amber-400 text-left">
            <strong>Nota:</strong> Si no lo ves en unos minutos, revisa tu
            carpeta de <b>Spam</b> o correo no deseado.
          </div>

          <ActionButton
            onClick={() => router.push("/auth/login")}
            variant="secondary"
            className="w-full"
            size="lg"
            iconVariant="redirect"
          >
            Ir al inicio de sesión
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen  flex items-center justify-center p-6">
        <div className="flex items-stretch justify-center w-full max-w-5xl gap-6 bg-white dark:bg-[#1a1a1a] p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl min-h-[600px]">
          <div className="relative hidden lg:flex flex-col items-center justify-center gap-2 w-1/2 bg-background rounded-2xl overflow-hidden p-8">
            <div className=" h-40 ">
              <LogoImage className="h-70 absolute -translate-y-1/5 left-1/2 -translate-x-1/2 " />
            </div>
            <div className="w-full border-t border-gray-300 dark:border-white/10 h-0.5" />
            <h2 className="text-xl font-semibold">Crea tu cuenta</h2>
            <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Completa los datos para poder gestionar tus estadísticas
            </span>
          </div>
          <div className="w-full p-10">
            {/* Indicador de Pasos (Visual) */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`h-1 w-10 rounded-full transition-all duration-500 ${step >= 1 ? "bg-secondary shadow-lg shadow-red-300 dark:shadow-red-700" : "bg-gray-200 dark:bg-white/10"}`}
              />
              <div
                className={`h-1 w-10 rounded-full transition-all duration-500 ${step >= 2 ? "bg-secondary shadow-lg shadow-red-300 dark:shadow-red-700" : "bg-gray-200 dark:bg-white/10"}`}
              />
            </div>

            <TitleView
              title={step === 1 ? "Datos Personales" : "Seguridad de la Cuenta"}
              subtitle={
                step === 1
                  ? "Cuéntanos quién eres"
                  : "Configura tus credenciales de acceso"
              }
            />

            <form onSubmit={handleSignUp} className="space-y-6 mt-8">
              {/* PASO 1: Información Personal */}
              {step === 1 && (
                <>
                  <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <CustomField
                      label="Nombre"
                      placeholder="ej: Juan"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                    <CustomField
                      label="Apellido"
                      placeholder="ej: Pérez"
                      value={formData.lastname}
                      onChange={(e) =>
                        setFormData({ ...formData, lastname: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <CustomField
                      label="Cédula de Identidad"
                      placeholder="ej: 123..."
                      value={formData.national_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          national_id: e.target.value,
                        })
                      }
                      required
                    />
                    <CustomField
                      label="Fecha de nacimiento"
                      type="Date"
                      value={formData.birthdate}
                      onChange={(e) =>
                        setFormData({ ...formData, birthdate: e.target.value })
                      }
                      required
                    />
                  </div>
                </>
              )}

              {/* PASO 2: Cuenta */}
              {step === 2 && (
                <>
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <CustomField
                      label="Correo Electrónico"
                      type="email"
                      placeholder="ej: juan@empresa.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <CustomField
                      label="Contraseña"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      required
                    />
                    <CustomField
                      label="Confirmar contraseña"
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirm_password: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </>
              )}

              {/* Botones de Navegación */}
              <div className="pt-6 flex flex-col-reverse md:flex-row gap-3">
                {step > 1 && (
                  <ActionButton
                    type="button"
                    variant="secondary"
                    onClick={prevStep}
                  >
                    Retroceder
                  </ActionButton>
                )}
                <ActionButton type="submit">
                  {step === 1 ? <>Siguiente</> : "Completar "}
                </ActionButton>
              </div>
            </form>
          </div>
        </div>
      </div>
      <SuccessDialog
        isOpen={isError}
        title="¡Error de contraseñas!"
        message="Las contraseñas ingresadas no coinciden."
        onClose={() => setIsError(false)}
        type="error"
      />
    </>
  );
}

// Next.js requiere Suspense cuando usas useSearchParams en componentes cliente
export default function RealtorRegistrationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Cargando...
        </div>
      }
    >
      <RealtorRegisterForm />
    </Suspense>
  );
}
