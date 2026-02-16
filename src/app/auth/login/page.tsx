import { LoginPage } from '@/features/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Go Hunter',
};

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default function Login() {
  return <LoginPage />;
}
