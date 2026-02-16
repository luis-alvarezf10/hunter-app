'use client';
import { HiOutlineHome, HiOutlineChartBar, HiOutlineUserGroup, HiOutlineChartPie, HiOutlineClock, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";

import { LogoImage } from '@/shared/components/images/LogoImage';
import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

interface SidebarProps {
  userRole: 'advisor' | 'manager';
}

export function Sidebar({ userRole }: SidebarProps) {
  const { activeItem, setActiveItem } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  
  const generalMenuItems = [
    { id: 'settings', label: 'Configuración', icon: <HiOutlineCog className="text-xl" /> },
    { id: 'logout', label: 'Cerrar Sesión', icon: <HiOutlineLogout className="text-xl" /> }
  ];

  const advisorItems = [
    { id: 'home', label: 'Inicio', icon: <HiOutlineHome className="text-xl" /> },
    { id: 'schedule', label: 'Agenda', icon: <HiOutlineClock className="text-xl" /> },
    { id: 'reports', label: 'Reportes', icon: <HiOutlineChartPie className="text-xl" /> },
    { id: 'sales', label: 'Ventas', icon: <HiOutlineChartBar className="text-xl" /> },
    { id: 'clients', label: 'Clientes', icon: <HiOutlineUserGroup className="text-xl" /> },
  ];

  const managerItems = [
    { id: 'home', label: 'Inicio', icon: <HiOutlineHome className="text-xl" /> },
    { id: 'panel', label: 'Panel de control', icon: <HiOutlineChartBar className="text-xl" /> },
    { id: 'stats', label: 'Estadísticas', icon: <HiOutlineChartPie className="text-xl" /> },
    { id: 'advisors', label: 'Asesores', icon: <HiOutlineUserGroup className="text-xl" /> },
    { id: 'properties', label: 'Propiedades en Venta', icon: <HiOutlineChartBar className="text-xl" /> },
    { id: 'settings', label: 'Configuración', icon: <HiOutlineCog className="text-xl" /> },
  ];

  const menuItems = userRole === 'manager' ? managerItems : advisorItems;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 size-10 flex items-center justify-center bg-[#efefef] dark:bg-[#1a1a1a] text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-600"
      >
        <span className="material-symbols-outlined">
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-white dark:bg-[#1a1a1a] flex flex-col shrink-0 h-full border-r border-gray-300 dark:border-gray-600
          fixed lg:relative z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-20">
          <LogoImage className="h-30 absolute left-15"/>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <div className="space-y-1">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                setIsOpen(false); // Cerrar menú en mobile al seleccionar
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-400/10 ${
                activeItem === item.id
                  ? 'text-black dark:text-white font-semibold bg-gray-400/10'
                  : 'text-gray-800 dark:text-gray-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
          </div>
          {/* Separador */}
          <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>
          <div className="space-y-1">
            {generalMenuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-400/10 ${
                  activeItem === item.id
                    ? 'text-white font-semibold bg-gray-400/10'
                    : item.id == "logout" ? 'text-red-800 dark:text-white dark:bg-red-800/30 hover:text-white' : 
                    'text-gray-800 dark:text-gray-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-4">
          <button className="w-full flex items-center justify-center gap-2 bg-[#6b1e2e] hover:bg-[#6b1e2e]/90 text-white py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-black/20">
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Exportar Reporte</span>
          </button>
        </div>
      </aside>
    </>
  );
}
