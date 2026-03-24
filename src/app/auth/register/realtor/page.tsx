import RealtorRegistrationPage  from '@/features/auth/pages/realtor/Register';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro | Go Hunter',
  description: 'Página de registro para asesores inmobiliarios',
};

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default function Register() {
  return <RealtorRegistrationPage />;
}

