import { useState, useRef } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
    value: string;
    placeholder?: string;
    onSearch: (query: string) => void;
    debounce?: number;
};

export function SearchBar({
    value = "",
    placeholder = "Search...",
    onSearch,
    debounce = 500,
}: SearchBarProps) {
    const [query, setQuery] = useState(value);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleChange = (value: string) => {
        setQuery(value);

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            onSearch(value);
        }, debounce);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (timerRef.current) clearTimeout(timerRef.current);
            onSearch(query);
        }
    };

    return (
        <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 w-full max-w-md bg-white shadow-sm focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
            <Search className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
            <input
                type="text"
                value={query}
                placeholder={placeholder}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none text-sm bg-transparent text-gray-800 placeholder-gray-400"
            />
        </div>
    );
}
