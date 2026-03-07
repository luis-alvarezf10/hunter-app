interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      aria-label="Icon button"
    >
      {icon}
    </button>
  );
};
