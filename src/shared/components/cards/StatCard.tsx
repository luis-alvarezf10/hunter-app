import { HiMinus, HiOutlineTrendingDown, HiOutlineTrendingUp } from "react-icons/hi";

interface StatCardProp {
  gradient: string;
  color: string;
  iconBg: string;
  icon: React.ReactNode;
  iconColor: string;
  trend: string;
  label: string;
  value: string | number;
  description: string;
}

export function StatCard({
    gradient,
    color,
    iconBg,
    icon,
    iconColor,
    trend,
    label,
    value,
    description,
    ...props}: StatCardProp) {
  return (
    <div
      className="group relative bg-white dark:bg-[#1a1a1a] hover:bg-gradient-to-b hover:dark:from-white/10 hover:dark:to-[#1a1a1a] rounded-2xl p-5 md:p-3 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default dark:border-t-1 border-t-white/30 flex flex-col gap-2"
    >
      {/* Gradient background on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 `}
      ></div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] transition-transform duration-500 ease-in-out origin-center scale-x-0 group-hover:scale-x-100 z-20"
        style={{
          backgroundColor: color,
          boxShadow: `0 -4px 12px ${color}80`,
        }}
      />

      <div className="flex items-center justify-between relative z-10">
        <div
          className={`${iconBg} w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 border-b-1 dark:border-t-1 border-transparent group-hover:scale-110 group-hover:border-b-[var(--card-color)] group-hover:dark:border-t-white/10`}
          style={{ "--card-color": color } as React.CSSProperties}
        >
          <span
            className={`material-symbols-outlined text-2xl text-white dark:${iconColor}`}
          >
            {icon}
          </span>
        </div>
        <div
          className={`flex items-center gap-2 text-sm font-semibold px-2 py-1/2 rounded-full transition-colors duration-300 ${
            trend.startsWith("+")
              ? "bg-[#74f67b] text-[#1a1a1a] dark:bg-[#74f67b]/10 dark:text-[#74f67b] group-hover:dark:text-[#1a1a1a] group-hover:dark:bg-[#74f67b]"
              : trend.startsWith("-")
                ? "bg-[#f54942] text-white dark:bg-[#f54942]/10 dark:text-[#f54942] group-hover:dark:text-white group-hover:dark:bg-[#f54942]"
                : "bg-gray-500 text-white dark:bg-gray-500/20 dark:text-gray-300 group-hover:dark:text-white group-hover:dark:bg-gray-500"
          }`}
        >
          {trend.startsWith("+") ? (
            <HiOutlineTrendingUp className="w-5 h-5" />
          ) : trend.startsWith("-") ? (
            <HiOutlineTrendingDown className="w-5 h-5" />
          ) : (
            <HiMinus className="w-5 h-5" />
          )}
          {trend}
        </div>
      </div>
      <div className="flex flex-col items-baseline gap-2">
        <span className="text-sm md:text-xs">{label}</span>
        <div className="flex items-end gap-5">
          <span className="text-3xl font-semibold text-gray-900 dark:text-white">
            {value}
          </span>
          <span className="text-sm md:text-xs text-gray-400">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}
