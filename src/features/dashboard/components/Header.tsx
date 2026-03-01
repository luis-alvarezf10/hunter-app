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
    <header className="w-full h-full flex items-center lg:justify-between justify-end gap-5 px-8 py-4 transition-all duration-300 bg-[#1a1a1a]/80 backdrop-blur-md backdrop-saturate-150 border-b border-white/5 rounded-2xl border border-white/10 shadow-2xl">
      {/* Nota: He bajado la opacidad a /70 y añadido backdrop-blur-md 
        para lograr el efecto de cristal estilo Apple. 
      */}
      
      <div className="flex items-center">
        <h2 className="text-xl font-bold tracking-tight text-black dark:text-white">
          {getPageTitle()}
        </h2>
      </div>

  
        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
          <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-600"></div>
          <div className=" text-right hidden md:block">
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
    </header>
  );
}