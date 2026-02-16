'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/core/config';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  Header,
  StatCards,
  SalesChart,
  AppointmentsList,
  SalesTable,
} from '../components';
import { NavigationProvider } from '../context/NavigationContext';
import { LoadingPage } from '@/shared/pages/LoadingPage';

interface Stakeholder {
  id: string;
  national_id: string | null;
  name: string;
  lastname: string | null;
  nickname: string | null;
  id_company: string | null;
  ui_color: string;
  role: string;
  created_at: string;
  image_profile: string | null;
}

export function DashboardPage() {
  const [stakeholder, setStakeholder] = useState<Stakeholder | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        // Verificar que el usuario existe en stakeholders
        const { data: stakeholderData, error } = await supabase
          .from('stakeholders')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error || !stakeholderData) {
          // Usuario no autorizado
          console.error('Stakeholder not found:', error);
          await supabase.auth.signOut();
          router.push('/auth/login');
          return;
        }

        setStakeholder(stakeholderData);
      } catch (error) {
        console.error('Error loading user data:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [router, supabase]);

  if (loading) {
    return (
      <LoadingPage/>
    );
  }

  if (!stakeholder) {
    return null;
  }

  const roleLabel = stakeholder.role === 'manager' ? 'Gerente' : 'Asesor';
  const fullName = stakeholder.lastname 
    ? `${stakeholder.name} ${stakeholder.lastname}` 
    : stakeholder.name;

  return (
    <NavigationProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar userRole={stakeholder.role as 'advisor' | 'manager'} />

        <main className="flex-1 flex flex-col h-full overflow-y-auto">
          <Header userName={fullName} userRole={roleLabel} />

          <div className="p-8 space-y-8">
            <StatCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <SalesChart />
              </div>
              <AppointmentsList />
            </div>

            <SalesTable />
          </div>
        </main>
      </div>
    </NavigationProvider>
  );
}
