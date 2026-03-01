'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: '', // Código de acceso especial para admins
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implementar lógica de autenticación de admin
      // 1. Verificar código de acceso especial
      // 2. Autenticar con Supabase
      // 3. Verificar que el usuario tenga rol de admin
      // 4. Redirigir a /admin
      
      console.log('Login admin:', formData);
      
      // Ejemplo temporal:
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email: formData.email,
      //   password: formData.password,
      // });
      // 
      // if (error) throw error;
      // 
      // // Verificar rol de admin
      // const { data: profile } = await supabase
      //   .from('profiles')
      //   .select('role')
      //   .eq('id', data.user.id)
      //   .single();
      // 
      // if (profile?.role !== 'admin') {
      //   throw new Error('No tienes permisos de administrador');
      // }
      // 
      // router.push('/admin');
      
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-400">
            Acceso restringido solo para administradores
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Código de acceso especial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Acceso
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa el código de administrador"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Código especial requerido para acceso administrativo
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@ejemplo.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Acceder al Panel'}
            </button>
          </form>

          {/* Link al login normal */}
          <div className="mt-6 text-center">
            <a
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ¿No eres administrador? Ir al login normal
            </a>
          </div>
        </div>

        {/* Advertencia de seguridad */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Todas las acciones son registradas y monitoreadas
          </p>
        </div>
      </div>
    </div>
  );
}
