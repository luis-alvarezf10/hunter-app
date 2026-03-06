interface TitleViewProps {
  color?: string;
  title: string;
  subtitle?: string;
}

export function TitleView({ color = '#cc2d19', title, subtitle }: TitleViewProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div 
          className="w-2 h-10 rounded-full shadow-lg shadow-red-300 dark:shadow-red-700" 
          style={{ backgroundColor: color }}
        ></div>
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>
      </div>
      
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}