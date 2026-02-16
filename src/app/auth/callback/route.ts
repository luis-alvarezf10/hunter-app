import { createClient } from '@/core/config';
import { NextResponse } from 'next/server';
import { ROUTES } from '@/core/config';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(ROUTES.DASHBOARD.HOME, requestUrl.origin));
}
