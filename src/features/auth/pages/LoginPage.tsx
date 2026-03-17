import { SocialMediaButtons } from "@/shared/components/buttons/SocialMediaButtons";
import { LoginForm, SocialLogin, PortfolioStats } from "../components";
import { Footer } from "@/shared/components";
import { LogoImage } from "@/shared/components/images/LogoImage";

export function LoginPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Panel Izquierdo - Arquitectónico */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 overflow-hidden backdrop-md bg-black/90">
        <img
          src="/image.jpg" // Cambia esto por tu URL o path
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 blur-sm" // Opacidad baja para que no distraiga
        />
        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-12 relative flex flex-col gap-3">
            <div className="h-35">
              {/* Logo para dark mode */}
              <LogoImage className="h-70 absolute -translate-y-1/5 left-1/2 -translate-x-1/2" />
            </div>
            <h2 className="text-white text-3xl font-bold leading-tigh">
              Aplicación de Gerencia inmobiliaria
            </h2>
            <p className="text-slate-300 text-lg">
              Gestión de ventas y propiedades en tiempo real, con reportes
              personalizados.
            </p>
          </div>

          <PortfolioStats />
        </div>

        {/* Efecto de Fondo */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      {/* Panel Derecho - Formulario de Login */}
      <div className="w-full lg:w-1/2 flex flex-col items-center overflow-y-auto  px-6 py-12 relative">
        <div className="my-auto w-full max-w-md flex flex-col gap-3">
          {/* Logo Mobile */}
          <div className="lg:hidden h-40 ">
            <LogoImage className="h-70 absolute -translate-y-1/5 left-1/2 -translate-x-1/2 " />
          </div>
          {/* Encabezado */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-medium text-slate-900 dark:text-white tracking-tight mb-2">
              Bienvenido de nuevo
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Por favor, ingresa tus datos para acceder.
            </p>
          </div>

          <LoginForm />

          <SocialLogin />

          {/* Registro */}
          <div className="mt-10 text-center text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              ¿Aún no tienes cuenta?{" "}
              <a
                className="text-primary font-semibold hover:underline ml-1"
                href="/auth/register"
              >
                Solicita tu cuenta
              </a>
            </p>
          </div>
        </div>

        <SocialMediaButtons />
        <Footer />
      </div>
    </div>
  );
}
