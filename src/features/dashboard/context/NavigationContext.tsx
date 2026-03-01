'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  activeItem: string;
  setActiveItem: (item: string) => void;
  getPageTitle: () => string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const pageTitles: Record<string, string> = {
  // Advisor pages
  home: 'Inicio',
  schedule: 'Agenda',
  reports: 'Reportes',
  sales: 'Ventas',
  clients: 'Clientes',
  properties: 'Propiedades',
  // Manager pages
  panel: 'Panel de Control',
  stats: 'Estadísticas',
  advisors: 'Asesores',
  // General pages
  settings: 'Configuración',
  logout: 'Cerrar Sesión',
};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getPageTitle = () => {
    return pageTitles[activeItem] || 'Dashboard';
  };

  return (
    <NavigationContext.Provider value={{ activeItem, setActiveItem, getPageTitle, isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
