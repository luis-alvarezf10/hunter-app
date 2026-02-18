import { DashboardPage } from '@/features/dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel de control | Go Hunter',
};

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default function Dashboard() {
  return <DashboardPage />;
}
