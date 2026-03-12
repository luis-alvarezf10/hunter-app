import { TitleView } from "@/shared/components/text/TitleView";
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineUserGroup, HiOutlineHome } from "react-icons/hi";

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-8">
      <TitleView 
        title="Reportes" 
        subtitle="Métricas clave de tus ventas, propiedades y gestión de clientes"
      />

      {/* 1. Métricas de Éxito (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ventas del Mes" value="$145,000" icon={<HiOutlineTrendingUp className="text-green-500" />} trend="+12%" />
        <StatCard title="Comisiones" value="$4,350" icon={<HiOutlineTrendingUp className="text-blue-500" />} trend="+5%" />
        <StatCard title="Nuevos Clientes" value="12" icon={<HiOutlineUserGroup className="text-purple-500" />} trend="+2" />
        <StatCard title="Propiedades Captadas" value="4" icon={<HiOutlineHome className="text-orange-500" />} trend="0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Sección de Pérdidas y Cancelaciones */}
        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-red-500/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-red-500">
            <HiOutlineTrendingDown className="text-xl" />
            <h3 className="font-semibold">Oportunidades Perdidas</h3>
          </div>
          <div className="space-y-3">
            <LossRow label="Ventas caídas en cierre" value="2" reason="Falta de crédito" />
            <LossRow label="Citas canceladas" value="8" reason="Último momento" />
            <LossRow label="Ofertas rechazadas" value="5" reason="Precio bajo" />
          </div>
        </div>

        {/* 3. Eficiencia de Agenda */}
        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 shadow-sm space-y-4">
          <h3 className="font-semibold">Embudo de Ventas (Funnel)</h3>
          <div className="space-y-4">
            <ProgressLabel label="Citas Realizadas" percentage={85} color="bg-blue-500" />
            <ProgressLabel label="Ofertas Recibidas" percentage={40} color="bg-yellow-500" />
            <ProgressLabel label="Cierres Exitosos" percentage={15} color="bg-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes pequeños de apoyo (puedes moverlos a archivos aparte)
function StatCard({ title, value, icon, trend }: any) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg">{icon}</div>
        <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded-full">{trend}</span>
      </div>
      <h4 className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{title}</h4>
      <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function LossRow({ label, value, reason }: any) {
  return (
    <div className="flex justify-between items-center p-3 bg-red-50/50 dark:bg-red-500/5 rounded-xl border border-red-500/10">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[10px] text-gray-500">Motivo: {reason}</p>
      </div>
      <span className="text-lg font-bold text-red-600">{value}</span>
    </div>
  );
}

function ProgressLabel({ label, percentage, color }: any) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="font-bold">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}