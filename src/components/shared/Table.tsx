// import type{ ReactNode } from "react";

// interface Column<T> {
//   key: keyof T;
//   label: string;
//   render?: (row: T) => ReactNode; 
// }

// interface TableProps<T> {
//   columns: Column<T>[];
//   data: T[];
// }

// function Table<T extends { id: string | number }>({ columns, data }: TableProps<T>) {
//   return (
//     <div className="overflow-x-auto shadow rounded-lg">
//       <table className="min-w-full divide-y divide-gray-200 bg-white">
//         <thead className="bg-gray-100">
//           <tr>
//             {columns.map((col) => (
//               <th
//                 key={String(col.key)}
//                 className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
//               >
//                 {col.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan={columns.length}
//                 className="px-6 py-4 text-center text-gray-500"
//               >
//                 No records found
//               </td>
//             </tr>
//           ) : (
//             data.map((row) => (
//               <tr key={row.id} className="hover:bg-gray-50">
//                 {columns.map((col) => (
//                   <td
//                     key={String(col.key)}
//                     className="px-6 py-4 text-sm text-gray-700"
//                   >
//                     {col.render ? col.render(row) : String(row[col.key])}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Table;


// components/common/Table.tsx
import React from "react";

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

export function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <table className="w-full border border-gray-200 rounded-lg shadow-sm">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col.header} className="px-4 py-2 text-left font-semibold">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, i) => (
            <tr key={i} className="border-t">
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-2">
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
            <td colSpan={columns.length} className="text-center py-4 text-gray-500">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
