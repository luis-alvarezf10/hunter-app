interface TitleViewProps {
  title: string;
  subtitle?: string;
  color?: string;
  showDivider?: boolean;
}

export function TitleCard({ title, subtitle, color = "#cc2d19", showDivider }: TitleViewProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        {showDivider && (
          <div 
              className="w-2 h-10 rounded-full shadow-lg shadow-red-300 dark:shadow-red-700" 
              style={{ backgroundColor: color }}
            ></div>
        )
        }
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
        {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
    </div>
    );
}