'use client';

interface HeaderProps {
  userName: string;
  userRole: string;
}

export function Header({ userName, userRole }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#6b1e2e] text-2xl">
          analytics
        </span>
        <h2 className="text-xl font-bold text-[#1c2b36] tracking-tight">
          Panel de Control - Gerencia
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-[#6b1e2e]/20"
            placeholder="Buscar por cliente o vendedor..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="size-10 flex items-center justify-center rounded-lg hover:bg-gray-100 relative text-[#1c2b36]">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-[#6b1e2e] rounded-full border-2 border-white"></span>
          </button>
          <button className="size-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#1c2b36]">
            <span className="material-symbols-outlined">help</span>
          </button>

          <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

          <div className="flex items-center gap-3 cursor-pointer pl-2">
            <div className="text-right">
              <p className="text-xs font-bold text-[#1c2b36] leading-none">
                {userName}
              </p>
              <p className="text-[10px] text-gray-500 leading-none mt-1">
                {userRole}
              </p>
            </div>
            <div className="size-9 rounded-full bg-[#6b1e2e] flex items-center justify-center text-white text-sm font-bold">
              {userName.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
