import { ReportsPage } from '@/features/reports';
import type { Metadata } from 'next'; 

export const metadata: Metadata = {
  title: 'Reportes | Go Hunter',
};

export default function Schedule() {
  return <ReportsPage />;
}
