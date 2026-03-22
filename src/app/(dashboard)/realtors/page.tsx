import { RealtorsPage } from '@/features/realtors';
import type { Metadata } from 'next'; 

export const metadata: Metadata = {
  title: 'Agentes | Go Hunter',
};

export default function Schedule() {
  return <RealtorsPage />;
}
