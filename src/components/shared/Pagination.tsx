import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginationRange } from "../../utils/paginationRange";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = getPaginationRange(currentPage, totalPages);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center gap-1">
            {/* Previous Button */}
            <button
                className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-teal-50 text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {pages.map((page, idx) =>
                page === "..." ? (
                    <span key={idx} className="px-3 py-2 text-gray-400 text-sm font-medium">
                        ...
                    </span>
                ) : (
                    <button
                        key={idx}
                        onClick={() => onPageChange(page as number)}
                        className={`min-w-[36px] px-3 py-2 text-sm font-semibold rounded-lg border transition-colors
                            ${
                                page === currentPage
                                    ? "bg-teal-600 text-white border-teal-600 hover:bg-teal-700"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-teal-50 focus:ring-2 focus:ring-teal-500"
                            }`}
                        aria-label={`Page ${page}`}
                        aria-current={page === currentPage ? "page" : undefined}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next Button */}
            <button
                className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-teal-50 text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next page"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
