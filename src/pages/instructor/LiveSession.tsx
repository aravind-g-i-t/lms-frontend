import { Ban, Calendar, Clock, Play, Plus, Radio, Settings, Users, Video } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import ScheduleSessionModal from "../../components/instructor/ScheduleSessionModal";
import { cancelLiveSession, GetLiveSessionsForInstructor, startLiveSession } from "../../services/instructorServices";
import { useSocket } from "../../hooks/useSocket";
import { useLiveSession } from "../../hooks/useLiveSession";
import { toast } from "react-toastify";


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

const InstructorLiveSessions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket()
  const { startSession } = useLiveSession()

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("")

  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [livePage, setLivePage] = useState(1);
  const [liveTotalPages, setLiveTotalPages] = useState(1);
  const [liveLoading, setLiveLoading] = useState(false);


  const fetchLiveSessions = useCallback(async () => {
    setLiveLoading(true);
    const res = await dispatch(
      GetLiveSessionsForInstructor({ page: livePage, limit: 5, search })
    ).unwrap();
    setLiveSessions(res.data.sessions);
    setLiveTotalPages(res.data.totalPages);
    setLiveLoading(false);
  }, [dispatch, livePage, search]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchLiveSessions();
    }, 400);

    return () => clearTimeout(timeout);
  }, [livePage, fetchLiveSessions]);

  const handleStartSession = async (sessionId: string, courseId: string) => {
    if (!socket) return
    try {
      const result = await dispatch(startLiveSession({ sessionId })).unwrap();
      console.log("result", result.roomId);

      socket.emit("startLiveSession", {
        sessionId,
        courseId,
      });
      setLiveSessions(prev =>
        prev.map(session =>
          session.id === sessionId
            ? { ...session, status: "live", startedAt: new Date() }
            : session
        )
      );

      startSession({
        roomId: result.data.roomId,
        sessionId
      })

    } catch (error) {
      toast.error(error as string)
    }
  }

  const handleRejoinSession = async (sessionId: string) => {
    if (!socket) return
    try {
      const result = await dispatch(startLiveSession({ sessionId })).unwrap();
      console.log("result", result.roomId);

      startSession({
        roomId: result.data.roomId,
        sessionId
      })

    } catch (error) {
      toast.error(error as string)
    }
  }

  useEffect(() => {
    if (!socket) return;

    const handleLiveEnded = ({
      sessionId,
      endedAt,
    }: {
      sessionId: string;
      endedAt: string;
    }) => {

      setLiveSessions(prev =>
        prev.map(session =>
          session.id === sessionId
            ? {
              ...session,
              status: "ended",
              endedAt: new Date(endedAt),
            }
            : session
        )
      );

      toast.info("Live session ended!");
    };

    socket.on("liveSessionEnded", handleLiveEnded);

    return () => {
      socket.off("liveSessionEnded", handleLiveEnded);
    };
  }, [socket]);

  const handleCancelSession = async (sessionId: string, courseId: string) => {
    if (!socket) return
    try {
      const result = await dispatch(cancelLiveSession({ sessionId })).unwrap();
      const updatedLiveSession = result.data.liveSession;
      setLiveSessions(sessions => {
        return sessions.map(session => {
          if (session.id === sessionId) {
            return updatedLiveSession;
          }
          return session;
        })
      })

      socket.emit("cancelLiveSession", {
        sessionId,
        courseId,
      });

    } catch (error) {
      toast.error(error as string)
    }
  }


  const statusBadge = (status: LiveSession["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "live":
        return "bg-red-100 text-red-700 border border-red-200 animate-pulse";
      case "ended":
        return "bg-green-100 text-green-700 border border-green-200";
      case "cancelled":
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  if (liveLoading) return <div>Loading live sessions...</div>;

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
              setLivePage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search by course title or description..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-4">
          {liveSessions.map(session => {
            const isStartEnabled =
              session.status === "scheduled" &&
              new Date() >= new Date(session.scheduledAt);

            return (
              <div
                key={session.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  {/* Left */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                      <Video className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {session.courseTitle}
                      </h3>

                      {session.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {session.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1.5 text-teal-600" />
                          {new Date(session.scheduledAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>

                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5 text-teal-600" />
                          {session.durationInMinutes} mins
                        </span>

                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1.5 text-teal-600" />
                          {session.instructorName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3 ml-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusBadge(
                        session.status
                      )}`}
                    >
                      {session.status === "live" && (
                        <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-1.5 animate-pulse" />
                      )}
                      {session.status.toUpperCase()}
                    </span>

                    {session.status === "scheduled" && (
                      <>
                        <button
                          disabled={!isStartEnabled}
                          onClick={() => handleStartSession(session.id, session.courseId)}
                          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm
                        ${isStartEnabled
                              ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          <Play className="w-4 h-4 mr-1.5" />
                          Start
                        </button>

                        <button
                          onClick={() => handleCancelSession(session.id, session.courseId)}
                          className="flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
                        >
                          <Ban className="w-4 h-4 mr-1.5" />
                          Cancel
                        </button>
                      </>
                    )}

                    {session.status === "live" && (
                      <button
                        onClick={() => handleRejoinSession(session.id)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-sm">
                        <Radio className="w-4 h-4 mr-1.5" />
                        Join Live
                      </button>
                    )}

                    {session.status === "cancelled" && (
                      <div className="flex items-center text-gray-500 text-sm px-2">
                        <Ban className="w-4 h-4 mr-1.5" />
                        Cancelled
                      </div>
                    )}

                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {!!liveTotalPages && <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={livePage === 1}
              onClick={() => setLivePage(livePage - 1)}
              className={`px-4 py-2 rounded-lg border text-sm
            ${livePage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100"
                }`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {livePage} of {liveTotalPages}
            </span>

            <button
              disabled={livePage === liveTotalPages}
              onClick={() => setLivePage(livePage + 1)}
              className={`px-4 py-2 rounded-lg border text-sm
            ${livePage === liveTotalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100"
                }`}
            >
              Next
            </button>
          </div>}
        </div>



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
