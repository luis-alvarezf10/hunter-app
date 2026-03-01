'use client';
import { HiOutlineHome, HiOutlineChartBar, HiOutlineUserGroup, HiOutlineChartPie, HiOutlineClock, HiOutlineCog, HiOutlineLogout, HiOutlineCollection } from "react-icons/hi";

import { LogoImage } from '@/shared/components/images/LogoImage';
import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { ConfirmDialog } from '@/shared/components/dialogs';
import { createClient } from '@/core/config';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/core/config';

interface SidebarProps {
  userRole: 'realtor' | 'manager';
}

export function Sidebar({ userRole }: SidebarProps) {
  const { activeItem, setActiveItem, isSidebarOpen, setIsSidebarOpen } = useNavigation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(ROUTES.AUTH.LOGIN);
  };

  const handleMenuClick = (itemId: string, route?: string) => {
    if (itemId === 'logout') {
      setShowLogoutDialog(true);
    } else {
      setActiveItem(itemId);
      setIsSidebarOpen(false);
      if (route) {
        router.push(route);
      }
    }
  };

  const generalMenuItems = [
    { id: 'settings', label: 'Configuración', icon: <HiOutlineCog className="text-xl" /> },
    { id: 'logout', label: 'Cerrar Sesión', icon: <HiOutlineLogout className="text-xl" /> }
  ];

  const realtorItems = [
    { id: 'home', label: 'Inicio', icon: <HiOutlineHome className="text-xl" />, route: '/dashboard' },
    { id: 'properties', label: 'Propiedades', icon: <HiOutlineCollection className="text-xl" />, route: '/properties' },
    { id: 'schedule', label: 'Agenda', icon: <HiOutlineClock className="text-xl" />, route: '/schedule' },
    { id: 'clients', label: 'Clientes', icon: <HiOutlineUserGroup className="text-xl" />, route: '/clients' },
    { id: 'reports', label: 'Reportes', icon: <HiOutlineChartPie className="text-xl" /> },
    { id: 'sales', label: 'Ventas', icon: <HiOutlineChartBar className="text-xl" /> },
  ];

  const managerItems = [
    { id: 'home', label: 'Inicio', icon: <HiOutlineHome className="text-xl" />, route: '/dashboard' },
    { id: 'panel', label: 'Panel de control', icon: <HiOutlineChartBar className="text-xl" /> },
    { id: 'stats', label: 'Estadísticas', icon: <HiOutlineChartPie className="text-xl" /> },
    { id: 'advisors', label: 'Asesores', icon: <HiOutlineUserGroup className="text-xl" /> },
    { id: 'properties', label: 'Propiedades en Venta', icon: <HiOutlineChartBar className="text-xl" /> },
  ];

  const menuItems = userRole === 'manager' ? managerItems : realtorItems;

  return (
    <>
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] flex flex-col shrink-0 h-full rounded-2xl overflow-y-auto">
        {/* <div className="h-25 flex items-center justify-center px-4 pointer-events-none">
          <LogoImage className="h-40"/>
        </div> */}

        <div className="h-25 flex flex-col items-center justify-center gap-3">
          <h1 className="text-2xl text-center"><span className="font-semibold text-[#c52e1a]">Go</span> Hunter</h1>
          <p className="text-sm text-gray-400">App {userRole}</p>
        </div>

        {/* --- SECCIÓN DE MENÚ PRINCIPAL --- */}
        <nav className="flex-1 py-4 space-y-1">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleMenuClick(item.id, item.route)}
                  className={`flex items-center gap-1 rounded-lg cursor-pointer group transition-all duration-300 px-2 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {/* Indicador Lateral */}
                  <div className={`relative -left-2 w-1 h-7 rounded-r-full transition-all duration-500 transform ${isActive ? 'bg-[#c52e1a] translate-x-0 opacity-100 scale-y-100' : 'bg-transparent -translate-x-2 opacity-0 scale-y-0'
                    }`} />

                  {/* Contenedor Principal */}
                  <div className={`group relative overflow-hidden flex items-center gap-3 w-full py-2 px-2 rounded-xl transition-all duration-300 border ${isActive
                      ? 'bg-gradient-to-b dark:from-[#333333] dark:to-[#333333]/10 border-transparent border-l-[#c52e1a] border-t-white/30'
                      : 'dark:bg-[#1a1a1a] bg-[#efefef] border-transparent'
                    }`}>
                    <div className={`absolute left-0 w-20 inset-y-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'} bg-gradient-to-r from-[#c52e1a]/20 via-[#c52e1a]/10 to-transparent`} />
                    <div className={`group-hover:scale-110 duration-300 p-1 z-10 rounded-full ${isActive ? '' : ' bg-[#333333]/50 ' }`}>{item.icon}</div>
                    <span className={`z-10 transition-all duration-300 ${isActive ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* --- SECCIÓN DE MENÚ GENERAL (AJUSTADA) --- */}
        <div className="py-4 border-t border-white/10 flex flex-col gap-4">
          <div className="space-y-1">
            {generalMenuItems.map((item) => {
              const isActive = activeItem === item.id;
              const isLogout = item.id === "logout";

              return (
                <div
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`flex items-center gap-1 rounded-lg cursor-pointer group transition-all duration-300 px-2 ${isActive ? 'text-white' : isLogout ? 'text-red-500' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {/* Indicador Lateral replicado */}
                  <div className={`relative -left-2 w-1 h-7 rounded-r-full transition-all duration-500 transform ${isActive ? 'bg-[#c52e1a] translate-x-0 opacity-100 scale-y-100' : 'bg-transparent -translate-x-2 opacity-0 scale-y-0'
                    }`} />

                  {/* Contenedor Principal replicado para mantener simetría */}
                  <div className={`relative overflow-hidden flex items-center gap-3 w-full py-2 px-2 rounded-xl transition-all duration-300 border ${isActive
                      ? 'bg-gradient-to-b dark:from-[#333333] dark:via-[#333333]/10 border-transparent border-t-white/30 border-l-[#c52e1a]'
                      : isLogout ? 'dark:bg-red-800/10 hover:bg-red-800/20 border-transparent' : ' border-transparent'
                    }`}>
                      <div className={`absolute left-0 w-20 inset-y-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'} bg-gradient-to-r from-[#c52e1a]/20 via-[#c52e1a]/10 to-transparent`} />
                    <div className="group-hover:scale-110 duration-300 p-1 z-10">{item.icon}</div>
                    <span className={`z-10 transition-all duration-300 ${isActive ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="¿Cerrar sesión?"
        message="¿Estás seguro que deseas cerrar sesión?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        confirmColor="bg-[#6b1e2e] hover:bg-[#6b1e2e]/90"
      />
    </>
  );
}
