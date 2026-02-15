import { DashboardPage } from '@/features/dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel de control | Go Hunter',
};

export default function Dashboard() {
  return <DashboardPage />;
}
