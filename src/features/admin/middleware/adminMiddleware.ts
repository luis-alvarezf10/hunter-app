// Middleware para proteger rutas de administrador

/**
 * Verifica si el usuario actual tiene permisos de administrador
 * TODO: Implementar con Supabase y cookies/session
 */
export async function requireAdmin() {
  // const session = await getSession();
  // 
  // if (!session) {
  //   return { authorized: false, redirect: '/admin/login' };
  // }
  // 
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('id', session.user.id)
  //   .single();
  // 
  // if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
  //   return { authorized: false, redirect: '/admin/login' };
  // }
  // 
  // return { authorized: true, user: session.user, role: profile.role };
  
  return { authorized: false, redirect: '/admin/login' };
}
