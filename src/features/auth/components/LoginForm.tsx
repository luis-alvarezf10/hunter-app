'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/core/config';
import { ROUTES } from '@/core/config';
import { CustomField } from '@/shared/components/inputs/CustomField';
import { ActionButton } from '@/shared/components/buttons/ActionButton';
import { CustomCheckbox } from '@/shared/components/inputs/CustomCheckbox';
import { HiOutlineLockClosed, HiOutlineMail } from 'react-icons/hi';

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
        <CustomField
          icon={<HiOutlineMail />}
          id="email"
          label="Correo electrónico"
          name="email"
          placeholder="nombre@empresa.com"
          type="email"
          required
          disabled={loading}
        />
      </div>

      <div>
        <CustomField
        icon={<HiOutlineLockClosed />}
        id="password"
        label="Contraseña"
        name="password"
        placeholder="••••••••"
        type="password"
        required
        disabled={loading}
        />
      </div>

       {/* <a className="text-sm font-medium text-[#b06372] hover:underline" href="/auth/forgot-password">
            ¿Olvidaste tu contraseña?
      </a> */}

      <CustomCheckbox
        id="remember"
        label="Mantener sesión iniciada"
        disabled={loading}
        name="remember"
      />      
      <ActionButton className="w-full"
        type="submit"
        disabled={loading}
        size='lg'
      >
         <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
      </ActionButton>
    </form>
  );
}
