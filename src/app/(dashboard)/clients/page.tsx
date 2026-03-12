import { ClientsPage } from '@/features/clients';
import type { Metadata } from 'next'; 

export const metadata: Metadata = {
  title: 'Clientes | Go Hunter',
};

export default function Clients() {
  return <ClientsPage />;
}
