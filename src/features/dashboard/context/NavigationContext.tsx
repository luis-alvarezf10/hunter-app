'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

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
  agenda: 'Agenda',
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
  realtors: 'Agentes',
};

// Mapeo de rutas a IDs de navegación
const routeToItemId: Record<string, string> = {
  '/dashboard': 'home',
  '/properties': 'properties',
  '/schedule': 'agenda',
  '/clients': 'clients',
  '/reports': 'reports',
  '/sales': 'sales',
  '/panel': 'panel',
  '/stats': 'stats',
  '/realtors': 'realtors',
  '/settings': 'settings',
};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sincronizar activeItem con la ruta actual
  useEffect(() => {
    const itemId = routeToItemId[pathname] || 'home';
    setActiveItem(itemId);
  }, [pathname]);

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
