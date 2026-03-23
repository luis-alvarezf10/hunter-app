import { CompaniesPage } from '@/features/companies';
import type { Metadata } from 'next'; 

export const metadata: Metadata = {
  title: 'Empresas | Go Hunter',
};

export default function Schedule() {
  return <CompaniesPage />;
}
