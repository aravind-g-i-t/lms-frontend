import { ChevronDown } from "lucide-react";

type FilterDropdownProps<T extends string> = {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
};

export function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) {
  return (
    <div className="flex flex-col items-center min-w-[200px]">
      {/* Label */}
      <div className="text-sm font-medium text-gray-700 mb-2 text-center">
        {label}
      </div>

      {/* Dropdown wrapper */}
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full border border-gray-200 rounded-xl bg-white shadow-sm 
                     hover:border-gray-300 hover:shadow-md
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     transition-all duration-200 ease-in-out
                     py-3
                     text-sm font-medium text-gray-800
                     appearance-none cursor-pointer
                     bg-gradient-to-b from-white to-gray-50
                     text-center"   
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
}
