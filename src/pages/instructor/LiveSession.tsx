import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import LiveSessionsList from "../../components/instructor/LiveSessionsList";
import ScheduleSessionModal from "../../components/instructor/ScheduleSessionModal";
import { GetLiveSessionsForInstructor } from "../../services/instructorServices";


type LiveSessionStatus = "scheduled" | "live" | "ended" | "cancelled";

export interface LiveSession {
  id: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  description: string;
  status: LiveSessionStatus;
  scheduledAt: Date;
  startedAt: Date | null;
  cancelledAt: Date | null;
  endedAt: Date | null;
  durationInMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

// export interface RecordedSession {
//   id: string;
//   course: {
//     id: string;
//     title: string;
//     thumbnail: string;
//   };
//   instructor: {
//     id: string;
//     name: string;
//   };
//   description: string;
//   recordingURI: string;
//   durationInMinutes: number;
//   views: number;
//   recordedAt: Date;
//   isPublished: boolean;
// }

const InstructorLiveSessions = () => {
  const dispatch = useDispatch<AppDispatch>();

  // const [activeTab, setActiveTab] = useState<"live" | "recorded">("live");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("")

  // Live sessions
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [livePage, setLivePage] = useState(1);
  const [liveTotalPages, setLiveTotalPages] = useState(1);
  const [liveLoading, setLiveLoading] = useState(false);

  // Recordings
  // const [recordings, setRecordings] = useState<RecordedSession[]>([]);
  // const [recordedPage, setRecordedPage] = useState(1);
  // const [recordedTotalPages, setRecordedTotalPages] = useState(1);
  // const [recordedLoading, setRecordedLoading] = useState(false);

  const fetchLiveSessions = useCallback(async () => {
    setLiveLoading(true);
    const res = await dispatch(
      GetLiveSessionsForInstructor({ page: livePage, limit: 5, search })
    ).unwrap();
    setLiveSessions(res.data.sessions);
    setLiveTotalPages(res.data.totalPages);
    setLiveLoading(false);
  }, [dispatch, livePage, search]);

  // const fetchRecordedSessions = async () => {
  //   setRecordedLoading(true);
  //   const res = await dispatch(
  //     getRecordedSessions({ page: recordedPage, limit: 6 })
  //   ).unwrap();
  //   setRecordings(res.sessions);
  //   setRecordedTotalPages(res.totalPages);
  //   setRecordedLoading(false);
  // };

  useEffect(() => {
    const timeout = setTimeout(() => {
    fetchLiveSessions();
  }, 400);

  return () => clearTimeout(timeout);
  }, [livePage, fetchLiveSessions]);

  // useEffect(() => {
  //   if (activeTab === "recorded") fetchRecordedSessions();
  // }, [activeTab, recordedPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Session Management
            </h1>
            <p className="text-gray-600">
              Manage your live sessions and recordings
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Schedule New Session
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setLivePage(1);      // reset pagination
              setSearch(e.target.value);
            }}
            placeholder="Search by course title or description..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>


        {/* Tabs */}
        {/* <div className="flex gap-4 mb-8 bg-white rounded-xl p-1.5 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-6 py-2.5 rounded-lg font-medium ${
              activeTab === "live"
                ? "bg-teal-600 text-white"
                : "text-gray-600"
            }`}
          >
            <Radio className="w-4 h-4 mr-2 inline" />
            Live Sessions
          </button>

          <button
            onClick={() => setActiveTab("recorded")}
            className={`px-6 py-2.5 rounded-lg font-medium ${
              activeTab === "recorded"
                ? "bg-indigo-600 text-white"
                : "text-gray-600"
            }`}
          >
            <Video className="w-4 h-4 mr-2 inline" />
            Recordings
          </button>
        </div> */}

        {/* Content */}

        <LiveSessionsList
          sessions={liveSessions}
          loading={liveLoading}
          page={livePage}
          totalPages={liveTotalPages}
          onPageChange={setLivePage}
          onRefresh={fetchLiveSessions}
        />

        {/* {activeTab === "live" ? (
          
        ) : (
          <RecordedSessionsList
            sessions={recordings}
            loading={recordedLoading}
            page={recordedPage}
            totalPages={recordedTotalPages}
            onPageChange={setRecordedPage}
          />
        )} */}

        <ScheduleSessionModal
          isOpen={open}
          onClose={() => {
            setOpen(false);
            fetchLiveSessions();
          }}
        />
      </div>
    </div>
  );
};

export default InstructorLiveSessions;
