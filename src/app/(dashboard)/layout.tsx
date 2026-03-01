'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/core/config';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, Header } from '@/features/dashboard/components';
import { NavigationProvider, useNavigation } from '@/features/dashboard/context/NavigationContext';
import { LoadingPage } from '@/shared/pages/LoadingPage';
import { PageTransition } from '@/shared/components/transitions';

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
  const pathname = usePathname();
  const isHomePage = pathname === '/dashboard';
  
  const roleLabel = stakeholder.role === 'manager' ? 'Gerente' : 'Asesor';
  const fullName = stakeholder.lastname
    ? `${stakeholder.name} ${stakeholder.lastname}`
    : stakeholder.name;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Sidebar flotante superpuesto */}
      <div 
        className={`p-4 fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar userRole={stakeholder.role as 'realtor' | 'manager'} />
      </div>

      {/* Mobile Menu Button - Hamburger animado */}
      <button
        className="lg:hidden fixed top-4 left-4 w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[60] bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg border border-gray-300/50 dark:border-gray-600/50 transition-colors hover:bg-white/90 dark:hover:bg-black/90 shadow-lg"
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
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        />
      )}

      {/* Fondo con gradiente difuminado - solo en inicio */}
      {isHomePage && (
        <>
          <div className="fixed inset-0 bg-gradient-to-b from-[#770f09] via-[#9e1e11]/60 via-[#c52e1a]/30 to-[#0d0d0d] blur-3xl" />
          <div className="fixed inset-0 bg-gradient-to-b from-[#c52e1a]/40 via-[#9e1e11]/20 to-transparent blur-2xl" />
        </>
      )}
      
      {/* Main Content */}
      <main className={`relative w-full h-full flex flex-col ${
        isHomePage 
          ? 'bg-white/50 dark:bg-black/50 backdrop-blur-sm' 
          : 'bg-[#0d0d0d]'
      }`}>
        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto lg:ml-[272px]">
          {/* Header fijo dentro del contenedor con scroll */}
          <div className="sticky top-0 z-30 h-[72px]">
            <Header
              userName={fullName}
              userRole={roleLabel}
              color={stakeholder.ui_color}
            />
          </div>
          
          <PageTransition>
            {children}
          </PageTransition>
        </div>
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
