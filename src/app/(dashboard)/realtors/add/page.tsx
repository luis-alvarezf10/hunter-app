import { AddRealtorPage } from '@/features/realtors';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Agente | Go Hunter',
};

export default function AddSchedule() {
  return <AddRealtorPage />;
}
