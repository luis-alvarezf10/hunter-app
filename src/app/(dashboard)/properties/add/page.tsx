import { AddPropertyPage } from '@/features/properties';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agregar Propiedad | Go Hunter',
};

export const dynamic = 'force-dynamic';

export default function AddProperty() {
  return <AddPropertyPage />;
}
