import React from "react";

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
};

export function Table<T>({ columns, data, loading = false }: TableProps<T>) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gradient-to-r from-teal-50 via-teal-100 to-teal-50">
              {columns.map((col, index) => (
                <th
                  key={col.header}
                  className={`px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider ${index === 0 ? "pl-6" : ""
                    } ${index === columns.length - 1 ? "pr-6" : ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-teal-400"></div>
                  </div>
                  <p className="mt-2 text-xs text-teal-500">Loading...</p>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="transition-colors duration-150 hover:bg-teal-50"
                >
                  {columns.map((col, index) => (
                    <td
                      key={col.header}
                      className={`px-4 py-3 text-sm text-gray-700 ${index === 0 ? "pl-6 font-medium" : ""
                        } ${index === columns.length - 1 ? "pr-6" : ""}`}
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor
                          ? (row[col.accessor] as React.ReactNode)
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="mb-2 h-10 w-10 text-teal-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-sm font-semibold text-teal-700">No data available</p>
                    <p className="mt-1 text-xs text-gray-500">
                      There are no records to display at this time.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
