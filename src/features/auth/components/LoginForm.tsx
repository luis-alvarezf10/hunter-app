'use client';

import { FormEvent } from 'react';

export function LoginForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí irá la lógica de autenticación
    console.log('Login submitted');
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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
        />
      </div>

      <div className="flex items-center">
        <input
          className="w-4 h-4 rounded border-slate-300 text-[#6b1e2e] focus:ring-[#6b1e2e]"
          id="remember"
          name="remember"
          type="checkbox"
        />
        <label className="ml-2 text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">
          Mantener sesión iniciada
        </label>
      </div>

      <button
        className="w-full h-12 bg-[#6b1e2e] hover:bg-[#6b1e2e]/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#6b1e2e]/20"
        type="submit"
      >
        <span>Iniciar Sesión</span>
      </button>
    </form>
  );
}
