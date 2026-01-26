// import { Eye, EyeOff, PlayCircle, Trash2, Users } from "lucide-react";
// import type { RecordedSession } from "../../pages/instructor/LiveSession";

// interface Props {
//   sessions: RecordedSession[];
//   loading: boolean;
//   page: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// const RecordedSessionsList = ({
//   sessions,
//   loading,
//   page,
//   totalPages,
//   onPageChange,
// }: Props) => {
//   if (loading) return <div>Loading recordings...</div>;
//   if (sessions.length === 0) return <div>No recordings</div>;

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {sessions.map(session => (
//           <div
//             key={session.id}
//             className="bg-white border rounded-2xl overflow-hidden"
//           >
//             <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//               <PlayCircle className="w-16 h-16 text-white" />
//             </div>

//             <div className="p-4">
//               <h3 className="font-bold mb-2">{session.course.title}</h3>
//               <p className="text-sm text-gray-600 mb-3">
//                 {session.description}
//               </p>

//               <div className="flex justify-between items-center">
//                 <span className="text-sm flex items-center">
//                   <Users className="w-4 h-4 mr-1" />
//                   {session.instructor.name}
//                 </span>

//                 <button className="p-2">
//                   {session.isPublished ? <Eye /> : <EyeOff />}
//                 </button>

//                 <button className="p-2 text-red-600">
//                   <Trash2 />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center gap-4 mt-6">
//         <button
//           disabled={page === 1}
//           onClick={() => onPageChange(page - 1)}
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           disabled={page === totalPages}
//           onClick={() => onPageChange(page + 1)}
//         >
//           Next
//         </button>
//       </div>
//     </>
//   );
// };

// export default RecordedSessionsList;
