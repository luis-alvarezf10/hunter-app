export function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#efefef] dark:bg-[#1a1a1a] text-slate-900 dark:text-white">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="size-16 border-4 border-[#6b1e2e] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* TODO: para aplicar un logo o icono despues */}
          </div>
        </div>
        <h2 className="text-lg font-bold mb-2">
          Cargando ...
        </h2>
      </div>
    </div>
  );
}