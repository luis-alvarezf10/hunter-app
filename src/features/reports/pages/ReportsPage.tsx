import { TitleView } from "@/shared/components/text/TitleView";
import { StatCards } from "../components/StatCards";
import LastOffers from "../components/LastOffers";
import LastSales from "../components/LastSales";

export default function ReportsPage() {
  return (
    <div className="p-8 space-y-6">
      <TitleView 
        title="Reportes" 
        subtitle="Métricas clave de tus ventas, propiedades y gestión de clientes"
      />
      <StatCards/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LastOffers/>
        <LastSales/>
      </div>
    </div>
  );
}
