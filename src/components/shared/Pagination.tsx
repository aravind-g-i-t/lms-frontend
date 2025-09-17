// components/common/Pagination.tsx
import { getPaginationRange } from "../../utils/paginationRange";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex items-center gap-2 justify-center mt-4">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {"<"}
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2">...</span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-1 border rounded ${
              page === currentPage ? "bg-blue-500 text-white" : ""
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {">"}
      </button>
    </div>
  );
}
