export function StatCardSkeleton() {
  return (
    <div className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 md:p-4 overflow-hidden shadow-sm dark:border-t-1 border-t-white/10 flex flex-col gap-4 animate-pulse">
      {/* Fila Superior: Icono y Badge de tendencia */}
      <div className="flex items-center justify-between relative z-10">
        {/* Icono Skeleton */}
        <div className="w-12 h-12 bg-gray-200 dark:bg-white/5 rounded-2xl" />

        {/* Trend Badge Skeleton */}
        <div className="w-14 h-6 bg-gray-200 dark:bg-white/5 rounded-full" />
      </div>

      {/* Fila Inferior: Texto y Números */}
      <div className="flex flex-col gap-2 relative z-10">
        {/* Label Skeleton */}
        <div className="h-3 w-24 bg-gray-200 dark:bg-white/5 rounded" />

        <div className="flex items-baseline gap-2">
          {/* Value (Número grande) Skeleton */}
          <div className="h-8 w-12 bg-gray-200 dark:bg-white/10 rounded-md" />

          {/* Description Skeleton */}
          <div className="h-3 w-20 bg-gray-100 dark:bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}