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
    <header className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white border-gray-300 dark:border-gray-600 border-b px-8 py-4 flex items-center lg:justify-between justify-end gap-5 sticky top-0 z-20">
      <div className="flex items-center ">
        <h2 className="text-xl font-bold tracking-tight">
          {getPageTitle()}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-600"></div>
        <div className="flex items-center gap-5 cursor-pointer pl-2">
          <div className="text-right hidden md:block ">
            <p className="font-bold text-black dark:text-white leading-none">
              {userName}
            </p>
            <p className="text-xs text-gray-800 dark:text-gray-400  leading-none mt-1">
              {userRole}
            </p>
          </div>
          <div 
            className="size-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: color }}
          >
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
