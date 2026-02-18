import { PropertiesPage } from '@/features/properties';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Propiedades | Go Hunter',
};

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default function Properties() {
  return <PropertiesPage />;
}
