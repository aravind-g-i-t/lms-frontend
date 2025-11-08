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
        <div className="flex items-center gap-2">
            {/* Label */}
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                {label}:
            </label>

            {/* Dropdown wrapper */}
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value as T)}
                    className="appearance-none w-full min-w-[140px] px-3 py-2 pr-8
                        border border-gray-200 rounded-lg bg-white shadow-sm
                        text-sm text-gray-800
                        hover:border-teal-400 hover:shadow
                        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                        transition-all cursor-pointer"
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                {/* Dropdown arrow */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-teal-500" />
                </div>
            </div>
        </div>
    );
}
