import { motion } from "framer-motion";

interface ViewToggleProps {
  // Ahora aceptamos cualquier string para saber cuál está activo
  activeMode: string; 
  firstButton: string;
  onClickFirst: () => void;
  secondButton: string;
  onClickSecond: () => void;
}

const ViewToggle = ({ 
  activeMode, 
  firstButton, 
  onClickFirst, 
  secondButton, 
  onClickSecond 
}: ViewToggleProps) => {
  return (
    <div className="flex w-full md:inline-flex gap-1 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border-y border-y-white/30 p-1">
      <ToggleButton
        // Comparamos el texto o una prop dedicada para saber si brilla
        active={activeMode === firstButton}
        onClick={onClickFirst}
        text={firstButton}
      />
      <ToggleButton
        active={activeMode === secondButton}
        onClick={onClickSecond}
        text={secondButton}
      />
    </div>
  );
};

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  text: string;
}

const ToggleButton = ({ active, onClick, text }: ToggleButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 px-4 py-2 text-sm font-medium transition-colors duration-300 flex items-center justify-center cursor-pointer rounded-2xl ${
        active 
          ? "text-white" 
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <span className="relative z-20">{text}</span>

      {active && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-gradient-to-b from-gray-300 dark:from-gray-400 to-gray-400 dark:to-white/30 rounded-xl"
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        />
      )}
    </button>
  );
};

export default ViewToggle;