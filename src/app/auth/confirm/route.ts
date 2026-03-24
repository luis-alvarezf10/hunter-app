import { createClient } from '@/core/config' // Tu función de supabase
import { ROUTES } from '@/core/config/routes' // Importa tu objeto ROUTES
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  
  // Usamos tu objeto ROUTES para la redirección
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = ROUTES.AUTH.LOGIN // Mandamos al login tras confirmar
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // Si todo sale bien, al Login con un mensaje de éxito opcional
      return NextResponse.redirect(redirectTo)
    }
  }

  // Si algo falla (token expirado, etc), mándalo a una ruta segura o al login con error
  console.error("Error al confirmar el correo");
  redirectTo.pathname = ROUTES.AUTH.LOGIN
  return NextResponse.redirect(redirectTo)
}