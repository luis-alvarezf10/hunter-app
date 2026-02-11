import { SocialMediaButtons } from '@/shared/components/buttons/SocialMediaButtons';
import { LoginForm, SocialLogin, PortfolioStats } from '../components';
import { Footer } from '@/shared/components';

export function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Panel Izquierdo - Arquitectónico */}
      <div className="hidden lg:flex w-1/2 architectural-bg relative items-center justify-center p-12 overflow-hidden">
        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-12 relative flex flex-col gap-3">
            <div className="h-35">
              {/* Logo para dark mode */}
              <img 
                src="/complete-logo.png" 
                alt="hunter" 
                className="w-auto h-70 object-contain absolute -translate-y-1/5 left-1/2 -translate-x-1/2 dark:block hidden"
              />
              {/* Logo para light mode */}
              <img 
                src="/complete-logo-black.png" 
                alt="hunter" 
                className="w-auto h-70 object-contain absolute -translate-y-1/5 left-1/2 -translate-x-1/2 dark:hidden block"
              />
            </div>
            <h2 className="text-white text-3xl font-bold leading-tigh">
              Aplicación de Gerencia inmobiliaria
            </h2>
            <p className="text-slate-300 text-lg">
              Gestión de ventas y propiedades en tiempo real, con reportes personalizados.
            </p>
          </div>

          <PortfolioStats />
        </div>
        
        {/* Efecto de Fondo */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#b06372]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Panel Derecho - Formulario de Login */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-[#efefef] dark:bg-[#1a1a1a] px-6 py-12 relative">
        <div className="w-full max-w-md flex flex-col gap-3">
          {/* Logo Mobile */}
          <div className="md:hidden h-40 ">
            {/* Logo para dark mode */}
            <img 
              src="/complete-logo.png" 
              alt="hunter" 
              className="w-auto h-70 object-contain absolute -translate-y-1/5 left-1/2 -translate-x-1/2 dark:block hidden"
            />
            {/* Logo para light mode */}
            <img 
              src="/complete-logo-black.png" 
              alt="hunter" 
              className="w-auto h-70 object-contain absolute -translate-y-1/5 left-1/2 -translate-x-1/2 dark:hidden block"
            />
          </div>
          {/* Encabezado */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
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
              <a className="text-[#b06372] font-bold hover:underline ml-1" href="/auth/register">
                Solicita tu cuenta
              </a>
            </p>
          </div>
        </div>  

        <SocialMediaButtons/>
        <Footer />
      </div>
    </div>
  );
}
