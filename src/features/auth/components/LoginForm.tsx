'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/core/config';
import { ROUTES } from '@/core/config';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push(ROUTES.DASHBOARD.HOME);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div>
        <label 
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" 
          htmlFor="email"
        >
          Correo Electrónico
        </label>
        <input
          className="w-full h-12 px-4 rounded-lg bg-white dark:bg-[#231f20] border border-slate-300 dark:border-[#4c4244] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#b06372]/50 focus:border-[#b06372] outline-none transition-all placeholder:text-slate-400"
          id="email"
          name="email"
          placeholder="nombre@empresa.com"
          type="email"
          required
          disabled={loading}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label 
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300" 
            htmlFor="password"
          >
            Contraseña
          </label>
          <a className="text-sm font-medium text-[#b06372] hover:underline" href="/auth/forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <input
          className="w-full h-12 px-4 rounded-lg bg-white dark:bg-[#231f20] border border-slate-300 dark:border-[#4c4244] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#b06372]/50 focus:border-[#b06372] outline-none transition-all placeholder:text-slate-400"
          id="password"
          name="password"
          placeholder="••••••••"
          type="password"
          required
          disabled={loading}
        />
      </div>

      <div className="flex items-center">
        <input
          className="w-4 h-4 rounded border-slate-300 text-[#6b1e2e] focus:ring-[#6b1e2e]"
          id="remember"
          name="remember"
          type="checkbox"
          disabled={loading}
        />
        <label className="ml-2 text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">
          Mantener sesión iniciada
        </label>
      </div>

      <button
        className="w-full h-12 bg-[#6b1e2e] hover:bg-[#6b1e2e]/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#6b1e2e]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
      </button>
    </form>
  );
}
