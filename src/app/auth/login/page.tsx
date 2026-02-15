import { LoginPage } from '@/features/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Go Hunter',
};

export default function Login() {
  return <LoginPage />;
}
