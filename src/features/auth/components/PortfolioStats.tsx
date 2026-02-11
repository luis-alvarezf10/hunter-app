export function PortfolioStats() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-extrabold">
            Ingresos totales
          </p>
          <p className="text-2xl font-bold text-white">
            $4.2k <span className="text-emerald-400 text-sm font-bold">+12.4%</span>
          </p>
        </div>
        <span className="material-symbols-outlined text-white/50">trending_up</span>
      </div>
      
      {/* Gráfico de Barras */}
      <div className="h-32 w-full flex items-end gap-1">
        {[30, 45, 35, 60, 55, 80, 95].map((height, index) => (
          <div 
            key={index}
            className={`w-full rounded-t-sm ${
              index === 6 ? 'bg-[#b06372]' : 
              index === 5 ? 'bg-[#b06372]/80' : 
              'bg-[#b06372]/60'
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
