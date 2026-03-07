import { motion } from "framer-motion";
import { HiViewGrid, HiViewList } from "react-icons/hi";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

const ViewToggle = ({ viewMode, setViewMode }: ViewToggleProps) => {
  return (
    <div className="inline-flex gap-1 bg-white dark:bg-[#1a1a1a] rounded-2xl transition-all shadow-sm hover:shadow-lg transition-all duration-300  dark:border-y-1 border-y-white/30 p-1">
      <ToggleButton
        active={viewMode === "grid"}
        onClick={() => setViewMode("grid")}
        icon={<HiViewGrid className="text-xl" />}
      />
      <ToggleButton
        active={viewMode === "list"}
        onClick={() => setViewMode("list")}
        icon={<HiViewList className="text-xl" />}
      />
    </div>
  );
};

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const ToggleButton = ({ active, onClick, icon }: ToggleButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative transition-colors duration-300 w-9 h-9 flex items-center justify-center cursor-pointer ${
        active 
          ? "text-white" 
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      {/* El icono siempre va encima */}
      <span className="relative z-20">{icon}</span>

      {/* La cápsula animada */}
      {active && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-gradient-to-b from-secondary to-wine-red rounded-2xl"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
};

export default ViewToggle;