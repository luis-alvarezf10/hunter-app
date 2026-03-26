import RealtorDetailsPage from '@/features/realtors/pages/RealtorDetailsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalles | Go Hunter',
};

// Forzamos dynamic porque los detalles dependen de un ID que cambia
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  // En Next.js 15, params es una Promise
  const { id } = await params;

  // Le pasamos el ID al componente de tu feature
  return <RealtorDetailsPage realtorId={id} />;
}