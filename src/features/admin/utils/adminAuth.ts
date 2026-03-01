// Utilidades para autenticación de administradores

/**
 * Código de acceso especial para administradores
 * TODO: Mover esto a variables de entorno (.env.local)
 * Ejemplo: NEXT_PUBLIC_ADMIN_ACCESS_CODE=tu-codigo-secreto
 */
export const ADMIN_ACCESS_CODE = process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE || 'ADMIN2024';

/**
 * Verifica si un código de acceso es válido
 */
export function verifyAdminCode(code: string): boolean {
  return code === ADMIN_ACCESS_CODE;
}

/**
 * Verifica si un usuario tiene rol de administrador
 * TODO: Implementar con Supabase
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  // const { data } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('id', userId)
  //   .single();
  // 
  // return data?.role === 'admin';
  
  return false; // Temporal
}

/**
 * Roles disponibles en el sistema
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}
