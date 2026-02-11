import { redirect } from 'next/navigation';
import { ROUTES } from '@/core/config';

export default function Home() {
  redirect(ROUTES.AUTH.LOGIN);
}
