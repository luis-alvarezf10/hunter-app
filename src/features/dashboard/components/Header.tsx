'use client';

import { useNavigation } from '../context/NavigationContext';

interface HeaderProps {
  userName: string;
  userRole: string;
  color: string
}

export function Header({ userName, userRole, color }: HeaderProps) {
  const { getPageTitle } = useNavigation();

  return (
    <header className="w-full h-full flex items-center justify-end lg:justify-between gap-5 px-8 py-4 transition-all duration-300 bg-[#1a1a1a]/80 backdrop-blur-md backdrop-saturate-150 border-b border-white/5 rounded-2xl border border-white/10 shadow-2xl">
      {/* Título de la página - solo visible en desktop */}
      <div className="lg:flex items-center">
        <h2 className="text-xl font-bold tracking-tight text-black dark:text-white">
          {getPageTitle()}
        </h2>
      </div>

      {/* Información del usuario */}
      <div className="flex items-center gap-4 pl-2 group cursor-pointer">
        {/* Separador - solo visible en desktop */}
        <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-600 hidden lg:block"></div>
        
        {/* Nombre y rol - solo visible en tablet y desktop */}
        <div className="text-right hidden md:block">
          <p className="font-bold text-black dark:text-white leading-none transition-colors group-hover:text-[#c52e1a]">
            {userName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-1.5 uppercase tracking-wider font-medium">
            {userRole}
          </p>
        </div>

        {/* Avatar con un pequeño anillo de resplandor */}
        <div 
          className="size-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-transform group-hover:scale-105 ring-2 ring-white/10"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 15px ${color}40`
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
