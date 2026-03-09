export function LoadingPage() {
  return (
    <div className="relative flex items-center justify-center h-screen w-full bg-slate-50 dark:bg-[#0a0a0a] overflow-hidden">
      
      {/* Luces de fondo decorativas (Glow effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6b1e2e]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6b1e2e]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Contenedor del Spinner */}
        <div className="relative mb-6">
          {/* Sombra difusa debajo del spinner */}
          <div className="absolute inset-0 rounded-full bg-[#6b1e2e]/20 blur-md animate-pulse" />
          
          {/* Spinner principal */}
          <div className="relative h-16 w-16 animate-spin rounded-full bg-gradient-to-tr from-wine-red via-primary/50 to-transparent p-[3px]">
            {/* El centro del spinner */}
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
            </div>
          </div>
        </div>

        {/* Texto de carga con estilo moderno */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-2xl tracking-tighter text-slate-900 dark:text-white flex items-center">
            GO HUNTER
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold lowercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Cargando
            </span>
            <span className="flex gap-1">
              <span className="h-1 w-1 rounded-full bg-[#6b1e2e] animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-1 w-1 rounded-full bg-[#6b1e2e] animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-1 w-1 rounded-full bg-[#6b1e2e] animate-bounce"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}