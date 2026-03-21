export function SidebarSkeleton() {
  return (
    <aside className="w-64 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md flex flex-col shrink-0 h-full rounded-2xl overflow-y-auto border border-white/10 shadow-2xl animate-pulse">
      
      {/* Logo Skeleton */}
      <div className="h-25 flex items-center justify-center px-4 mt-8">
        <div className="h-20 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>

      {/* Role Label Skeleton */}
      <div className="flex justify-center mt-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* --- SECCIÓN DE MENÚ PRINCIPAL --- */}
      <nav className="flex-1 py-8 space-y-4 px-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 w-full py-2">
            {/* Icon Circle */}
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
            {/* Text Line */}
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </nav>

      {/* --- SECCIÓN DE MENÚ GENERAL --- */}
      <div className="py-6 border-t border-white/10 px-4 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 w-full py-2">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </aside>
  );
}