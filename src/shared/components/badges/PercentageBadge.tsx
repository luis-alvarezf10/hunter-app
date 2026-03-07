interface PercentageBadgeProps {
  percentage: number;
}

export function PercentageBadge({ percentage }: PercentageBadgeProps) {
    return (
        <div
            className="text-xs font-medium px-2 py-0.5 rounded-full border  border-gray-300/50 dark:border-gray-700/50"
        >
            {percentage}%
        </div>
    );
}