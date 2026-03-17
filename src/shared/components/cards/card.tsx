interface CardProps {
  className?: string;
  children: React.ReactNode;
  showEffect?: boolean;
  showHoverEffect?: boolean;
}

export function Card({ className = "", children, showEffect, showHoverEffect }: CardProps) {
  const baseStyles = "group relative bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-default dark:border-t-1 border-t-white/30 flex flex-col gap-2";

  let cardEffect = "";

  let hoverEffect = "";
  
  if (showEffect) {
    cardEffect = " hover:bg-gradient-to-b hover:dark:from-white/10 hover:dark:to-[#1a1a1a]";
  }

  if (showHoverEffect){
    hoverEffect = " hover:-translate-y-1";
  }

  // 3. Combinamos todo de forma limpia
  const combinedClasses = `${baseStyles}${cardEffect} ${hoverEffect} ${className}`;

  return (
    <div className={combinedClasses}>
      {/* Si quieres el brillo que cruza, puedes dejarlo aquí también */}
      {showEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      )}
      
      {children}
    </div>
  );
}