interface TitleViewProps {
  title: string;
  subtitle?: string;
}

export function TitleCard({ title, subtitle }: TitleViewProps) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
        {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
    </div>
    );
}