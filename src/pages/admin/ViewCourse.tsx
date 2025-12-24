import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import { formatDuration } from "../../utils/formats";
import {

  Star,
  CheckCircle,
  Clock,
  BarChart3,
  PlayCircle,
  Users,
  ChevronDown,
  ChevronUp,
  Award,

  ShieldCheck,
  Ban,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { getCourseDetailsForAdmin, updateCourseVerification } from "../../services/adminServices";

type CourseStatus = "draft" | "published" | "archived";
type VerificationStatus =
  | "not_verified"
  | "under_review"
  | "verified"
  | "rejected"
  | "blocked";
type CourseLevel = "beginner" | "intermediate" | "advanced";

interface Resource {
  id: string;
  name: string;
  file: string;
  size: number;
}
interface Chapter {
  id: string;
  title: string;
  description: string;
  video: string;
  duration: number;
  resources: Resource[];
}
interface Module {
  id: string;
  title: string;
  description: string;
  duration: number;
  chapters: Chapter[];
}
interface Course {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  category: { id: string; name: string };
  instructor: { id: string; name: string; profilePic: string | null };
  enrollmentCount: number;
  modules: Module[];
  level: CourseLevel;
  duration: number;
  tags: string[];
  whatYouWillLearn: string[];
  totalRatings: number;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
  thumbnail: string | null;
  previewVideo: string | null;
  price: number;
  rating: number | null;
  verification: {
    status: VerificationStatus;
    reviewedAt: Date | null;
    submittedAt: Date | null;
    remarks: string | null;
  };
  publishedAt: Date | null;
}

const ViewCourseForAdmin = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"approve" | "reject" | "block" | "unblock" | null>(null);
  const [remarks, setRemarks] = useState(""); 


  const [course, setCourse] = useState<Course>({
    id: "",
    title: "",
    description: "",
    prerequisites: [],
    category: { id: "", name: "" },
    instructor: { id: "", name: "", profilePic: null },
    enrollmentCount: 0,
    modules: [],
    level: "beginner",
    duration: 0,
    tags: [],
    whatYouWillLearn: [],
    totalRatings: 0,
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: null,
    previewVideo: null,
    price: 0,
    rating: null,
    publishedAt: null,
    verification: {
      status: "not_verified",
      reviewedAt: null,
      submittedAt: null,
      remarks: null,
    },
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        if (!courseId) return;
        const response = await dispatch(getCourseDetailsForAdmin(courseId)).unwrap();
        setCourse(response.data);
      } catch (err) {
        toast.error(err as string);
      }
    };
    fetchCourseDetails();
  }, [dispatch, courseId]);


  const handleCourseApporval = async () => {
    try {
      if (!modalType) return;

      const statusMap = {
        approve: "verified",
        reject: "rejected",
        block: "blocked",
        unblock: "verified",
      } as const;

      const result = await dispatch(
        updateCourseVerification({
          courseId: course.id,
          status: statusMap[modalType],
          remarks: remarks.trim() || null,
        })
      ).unwrap();

      setCourse((prev) =>
        prev ? ({ ...prev, verification: result.verification } as Course) : prev
      );

      setModalOpen(false);
      setRemarks("");
      setModalType(null);
      toast.success(`Course ${modalType.replace("_", " ")+"ed"} successfully.`);
    } catch (error) {
      toast.error(error as string);
    }
  };




  const statusLabel: Record<CourseStatus, string> = {
    "archived": "Archived",
    "draft": "Draft",
    "published": "Published"
  };

  const verStatusLabel: Record<VerificationStatus, string> = {
    "not_verified": "Not Verified",
    "under_review": "Under Review",
    "rejected": "Rejected",
    "verified": "Verified",
    "blocked": "Blocked"
  }

  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) newExpanded.delete(index);
    else newExpanded.add(index);
    setExpandedModules(newExpanded);
  };

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case "beginner":
        return "bg-blue-100 text-blue-800";
      case "intermediate":
        return "bg-purple-100 text-purple-800";
      case "advanced":
        return "bg-orange-100 text-orange-800";
    }
  };

  const getVerificationColor = (status: VerificationStatus) => {
    switch (status) {
      case "not_verified":
        return "bg-gray-100 text-gray-800";
      case "under_review":
        return "bg-amber-100 text-amber-800";
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "blocked":
        return "bg-black text-white";
    }
  };

  const formatDate = (date: Date | null) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      : "N/A";

  // const getTotalChapters = () =>
  //   course.modules.reduce((total, m) => total + m.chapters.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Go Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Go Back</span>
        </button>


      </div>
      {/* Header */}
      <div className="relative bg-gray-900 text-white">
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-wrap justify-between items-start gap-8">
            {/* Left: Course Info */}
            <div className="space-y-4 flex-1 min-w-[60%]">
              <div className="flex gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}
                >
                  {course.level}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getVerificationColor(
                    course.verification.status
                  )}`}
                >
                  {verStatusLabel[course.verification.status]}
                </span>
              </div>

              <h1 className="text-4xl font-bold">{course.title}</h1>

              {/* ✅ Price */}
              <p className="text-2xl font-semibold text-teal-400">
                ₹{course.price.toLocaleString()}
              </p>

              <p className="text-lg text-gray-300 max-w-3xl">{course.description}</p>

              <div className="text-gray-300 text-sm flex flex-wrap gap-6">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" /> {course.enrollmentCount} enrolled
                </span>
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {course.rating ?? "N/A"} ({course.totalRatings} ratings)
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatDuration(course.duration)}
                </span>
              </div>
            </div>

            {/* ✅ Right: Preview Video (fixed overflow) */}
            {course.previewVideo && (
              <div className="w-full sm:w-[350px] md:w-[400px] lg:w-[420px] bg-white rounded-lg shadow overflow-hidden mt-6 lg:mt-0">
                <div className="relative aspect-video">
                  <video
                    controls={showPreview}
                    poster={course.thumbnail || undefined}
                    className="w-full h-full object-cover"
                  >
                    {showPreview && <source src={course.previewVideo} type="video/mp4" />}
                  </video>

                  {!showPreview && (
                    <div
                      onClick={() => setShowPreview(true)}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 cursor-pointer transition hover:bg-black/60"
                    >
                      <PlayCircle className="w-16 h-16 text-white mb-2" />
                      <span className="text-white font-medium">Preview Video</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-8">
          {/* Verification Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">Verification Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <p><strong>Status:</strong> {verStatusLabel[course.verification.status]}</p>
              <p><strong>Submitted:</strong> {formatDate(course.verification.submittedAt)}</p>
              <p><strong>Reviewed:</strong> {formatDate(course.verification.reviewedAt)}</p>
              {course.verification.remarks && (
                <p className="col-span-2"><strong>Remarks:</strong> {course.verification.remarks}</p>
              )}
            </div>
          </div>

          {/* What You'll Learn */}
          {course.whatYouWillLearn.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
              <ul className="space-y-2">
                {course.whatYouWillLearn.map((point, i) => (
                  <li key={i} className="flex items-start text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites */}
          {course.prerequisites.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
              <ul className="space-y-2">
                {course.prerequisites.map((p, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <Award className="w-5 h-5 text-teal-600 mr-2" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Modules & Chapters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">Modules & Chapters</h2>
            <div className="space-y-4">
              {course.modules.map((m, i) => (
                <div key={m.id} className="border rounded-xl overflow-hidden">
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(i)}
                    className="flex justify-between items-center w-full p-4 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      {expandedModules.has(i) ? (
                        <ChevronUp className="w-5 h-5 text-teal-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-teal-600" />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          Module {i + 1}: {m.title}
                        </h3>
                        <p className="text-sm text-gray-600">{m.description}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDuration(m.duration)}
                    </span>
                  </button>

                  {/* Chapters (collapsible) */}
                  {expandedModules.has(i) && (
                    <div className="bg-white border-t divide-y">
                      {m.chapters.map((c, j) => (
                        <ExpandableChapter key={c.id} chapter={c} index={j} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>



          {/* Tags */}
          {course.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((t, i) => (
                  <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-1 space-y-6">
          {/* Admin Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Admin Actions</h3>
            <div className="space-y-2">
              {course.verification.status === "under_review" && (
                <>
                  <button
                    onClick={() => { setModalType("approve"); setModalOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 rounded-lg py-2 hover:bg-green-100"
                  >
                    <ShieldCheck className="w-4 h-4" /> Approve
                  </button>

                  <button
                    onClick={() => { setModalType("reject"); setModalOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-700 rounded-lg py-2 hover:bg-red-100"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>

                </>
              )}

              {course.verification.status === "verified" && (
                <button
                onClick={() => { setModalType("block"); setModalOpen(true); }}
                 className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-800 rounded-lg py-2 hover:bg-gray-200">
                  <Ban className="w-4 h-4" /> Block Course
                </button>
              )}

              {course.verification.status === "blocked" && (
                <button 
                onClick={() => { setModalType("unblock"); setModalOpen(true); }}
                className="w-full flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 rounded-lg py-2 hover:bg-yellow-100">
                  <ShieldCheck className="w-4 h-4" /> Unblock Course
                </button>
              )}

              {/* <Link
                to={`/admin/courses/${course.id}/edit`}
                className="block text-center py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
              >
                <Edit className="inline w-4 h-4 mr-1" /> Edit Course
              </Link> */}
              <Link
                to={`/admin/courses/${course.id}/analytics`}
                className="block text-center py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100"
              >
                <BarChart3 className="inline w-4 h-4 mr-1" /> View Analytics
              </Link>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Course Metadata</h3>
            <p><strong>Category:</strong> {course.category.name}</p>
            <p><strong>Instructor:</strong> {course.instructor.name}</p>
            <p><strong>Status:</strong> {statusLabel[course.status]}</p>
            <p><strong>Created:</strong> {formatDate(course.createdAt)}</p>
            <p><strong>Updated:</strong> {formatDate(course.updatedAt)}</p>
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-2 capitalize">
              {modalType === "approve" && "Approve Course"}
              {modalType === "reject" && "Reject Course"}
              {modalType === "block" && "Block Course"}
              {modalType === "unblock" && "Unblock Course"}
            </h3>
            <p className="mb-4">
              {modalType === "approve"
                ? "Are you sure you want to approve this course?"
                : modalType === "reject"
                ? "Please provide a reason for rejection."
                : modalType === "block"
                ? "Please provide a reason for blocking this course."
                : "Are you sure you want to unblock this course?"}
            </p>

            {(modalType === "reject" || modalType === "block") && (
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows={3}
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setRemarks("");
                  setModalType(null);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCourseApporval}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                disabled={
                  (modalType === "reject" || modalType === "block") && remarks.trim() === ""
                }
              >
                {modalType === "approve"
                  ? "Yes, Approve"
                  : modalType === "reject"
                  ? "Reject"
                  : modalType === "block"
                  ? "Block"
                  : "Unblock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ExpandableChapter = ({
  chapter,
  index,
}: {
  chapter: Chapter;
  index: number;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full text-left"
      >
        <div className="flex items-center gap-3">
          {open ? (
            <ChevronUp className="w-4 h-4 text-teal-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-teal-600" />
          )}
          <div>
            <h4 className="font-medium text-gray-800">
              {index + 1}. {chapter.title}
            </h4>
            <p className="text-sm text-gray-600">{chapter.description}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {formatDuration(chapter.duration)}
        </span>
      </button>

      {/* Expandable Video Section */}
      {open && chapter.video && (
        <div className="mt-3 ml-7 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <video
            controls
            className="w-full rounded-lg"
            preload="metadata"
          >
            <source src={chapter.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}



    </div>
  );
};


export default ViewCourseForAdmin;
