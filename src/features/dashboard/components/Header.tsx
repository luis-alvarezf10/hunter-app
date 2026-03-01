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
    <header className="sticky top-0 z-20 flex items-center lg:justify-between justify-end gap-5 px-8 py-4 h-[72px] transition-all duration-300 bg-gradient-to-b from-[#1a1a1a]/70 via-[#1a1a1a]/30 to-transparent backdrop-blur-md backdrop-saturate-150">
      {/* Nota: He bajado la opacidad a /70 y añadido backdrop-blur-md 
        para lograr el efecto de cristal estilo Apple. 
      */}
      
      <div className="flex items-center">
        <h2 className="text-xl font-bold tracking-tight text-black dark:text-white">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Separador visual sutil */}
        <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-600/50"></div>
        
        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
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
              boxShadow: `0 0 15px ${color}40` // Añade un brillo suave del color del avatar
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}