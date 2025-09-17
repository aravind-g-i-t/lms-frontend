import { useState, useRef } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
    value:string;
    placeholder?: string;
    onSearch: (query: string) => void;
    debounce?: number;
};

export function SearchBar({
    value="",
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
        <div className="flex items-center border rounded-lg px-3 py-2 w-full max-w-md bg-white shadow-sm">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
                type="text"
                value={query}
                placeholder={placeholder}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none" autoFocus
            />
        </div>
    );
}
