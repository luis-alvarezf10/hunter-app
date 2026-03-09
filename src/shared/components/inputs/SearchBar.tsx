import { HiSearch } from "react-icons/hi";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
}) => {
  return (
    <div className="group w-full flex items-center bg-white dark:bg-[#1a1a1a] p-2 px-4 rounded-2xl transition-all shadow-sm hover:shadow-lg transition-all duration-300  dark:border-y-1 border-y-white/30">
      <HiSearch className="text-gray-400 text-lg 
        group-focus-within:text-primary 
        transition-colors duration-300" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent px-3 py-1 placeholder-gray-400 focus:outline-none "
      />
    </div>
  );
};