'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/core/config';
import { useRouter } from 'next/navigation';
import { Sidebar, Header } from '@/features/dashboard/components';
import { NavigationProvider, useNavigation } from '@/features/dashboard/context/NavigationContext';
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

function DashboardLayoutContent({
  children,
  stakeholder,
}: {
  children: React.ReactNode;
  stakeholder: Stakeholder;
}) {
  const { isSidebarOpen, setIsSidebarOpen } = useNavigation();
  const roleLabel = stakeholder.role === 'manager' ? 'Gerente' : 'Asesor';
  const fullName = stakeholder.lastname
    ? `${stakeholder.name} ${stakeholder.lastname}`
    : stakeholder.name;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Menu Button - Hamburger animado */}
      <button
        className="lg:hidden fixed top-4 left-4 w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[60] bg-[#efefef] dark:bg-[#1a1a1a] rounded-lg  transition-colors hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        <span 
          className={`block w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
            isSidebarOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span 
          className={`block w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
            isSidebarOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
          }`}
        />
        <span 
          className={`block w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
            isSidebarOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar Container con efecto flotante */}
      <div 
        className={`p-2 lg:bg-[#0d0d0d] fixed lg:relative h-full z-40 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar userRole={stakeholder.role as 'realtor' | 'manager'} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#efefef] dark:bg-[#1a1a1a]">
        <Header
          userName={fullName}
          userRole={roleLabel}
          color={stakeholder.ui_color}
        />
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

        const { data: stakeholderData, error } = await supabase
          .from('stakeholders')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error || !stakeholderData) {
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
    return <LoadingPage />;
  }

  if (!stakeholder) {
    return null;
  }

  return (
    <NavigationProvider>
      <DashboardLayoutContent stakeholder={stakeholder}>
        {children}
      </DashboardLayoutContent>
    </NavigationProvider>
  );
}
