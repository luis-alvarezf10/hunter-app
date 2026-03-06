interface FilledIconProps {
  icon: React.ReactNode;
  backgroundColor?: string;
  iconColor: string; // Recibe "text-emerald-500"
  color: string;     // Recibe "#10b981"
  size?: number;
}

export function FilledIcon({ icon, backgroundColor, iconColor, color, size = 12 }: FilledIconProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`
          ${backgroundColor} 
          w-${size} h-${size} 
          flex items-center justify-center rounded-2xl 
          transition-all duration-300 
          border-b border-solid dark:border-t border-transparent 
          group-hover:scale-110 
          group-hover:border-b-[var(--card-color)] 
          group-hover:dark:border-t-white/10
        `}
        style={{ '--card-color': color } as React.CSSProperties}
      >
        <span className={`material-symbols-outlined text-2xl ${iconColor}`}>
          {icon}
        </span>
      </div>
    </div>
  );
}