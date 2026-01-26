import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ChevronLeft,
  Video,
  Clock,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import {
  getLiveSessionsForLearner,
  joinLiveSession,
} from "../../services/learnerServices";
import { useLiveSession } from "../../hooks/useLiveSession";
import { useSocket } from "../../hooks/useSocket";

interface LiveSession {
  id: string;
  courseTitle: string;
  instructorName: string;
  description: string | null;
  scheduledAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
  durationInMinutes: number;
  status: "live" | "scheduled" | "cancelled"|"ended";
}



const CourseLiveSessionsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket()
  const { startSession } = useLiveSession();

  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (!courseId) return;
        setLoading(true);

        const response = await dispatch(
          getLiveSessionsForLearner({
            courseId,
            page,
            limit: 5,
          })
        ).unwrap();
        console.log(response);
        
        setSessions(response.data.sessions);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        toast.error(err as string);
        navigate(`/learner/courses/${courseId}/learn`);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [page, courseId, dispatch, navigate]);

  const formatDateTime = (date: Date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const handleJoinSession = async (sessionId: string) => {
    if(!socket) return 
    try {
      const result = await dispatch(
        joinLiveSession({ sessionId })
      ).unwrap();

      socket.emit("joinLiveSession", {
        sessionId,
      });

      startSession({
        roomId: result.data.roomId,
        sessionId,
      });
    } catch (error) {
      toast.error(error as string);
    }
  };

  const renderAction = (session: LiveSession) => {
    if (session.status === "live") {
      return (
        <button
          onClick={() => handleJoinSession(session.id)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Video className="w-4 h-4" />
          Join Live
        </button>
      );
    }

    return (
      <span className="text-xs text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
        {session.status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">
        Loading live sessions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center gap-4">
        <button
          onClick={() =>
            navigate(`/learner/courses/${courseId}/learn`)
          }
          className="text-gray-300 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Live Sessions</h1>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-4">
        {sessions.length === 0 ? (
          <p className="text-gray-400">
            No live sessions available for this course.
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`rounded-lg p-5 border flex items-center justify-between gap-6 ${
                session.status === "live"
                  ? "bg-gray-800 border-red-500/40"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              {/* Left */}
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{session.courseTitle}</h3>
                  {session.status === "live" && (
                    <span className="text-xs text-red-400 font-medium">
                      🔴 LIVE
                    </span>
                  )}
                </div>

                {session.description && (
                  <p className="text-sm text-gray-400">
                    {session.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDateTime(session.scheduledAt)}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.durationInMinutes} mins
                  </span>

                  <span className="flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4" />
                    {session.instructorName}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="flex-shrink-0">
                {renderAction(session)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-700 text-gray-300 disabled:opacity-40 hover:bg-gray-600"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 rounded text-sm ${
                  page === pageNum
                    ? "bg-teal-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-700 text-gray-300 disabled:opacity-40 hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseLiveSessionsPage;
