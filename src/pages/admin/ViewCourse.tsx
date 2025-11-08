import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import type { Course, Module, Chapter, Resource, CourseLevel, CourseStatus, VerificationStatus } from "./types"; // Import your types

export default function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getCourseById({ id })).unwrap();
        setCourse(response.course);
      } catch (err) {
        toast.error("Failed to fetch course");
        navigate("/admin/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [dispatch, courseId, navigate]);

  if (loading) return <div className="py-12 text-center text-teal-500">Loading course details…</div>;
  if (!course) return null;

  // Utility label functions
  const courseLevelLabel = (level: CourseLevel) => ({
    [CourseLevel.Beginner]: "Beginner",
    [CourseLevel.Intermediate]: "Intermediate",
    [CourseLevel.Advanced]: "Advanced",
  }[level] || level);

  const courseStatusChip = (status: CourseStatus) => (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
      ${status === CourseStatus.Published
        ? "bg-teal-100 text-teal-700"
        : status === CourseStatus.Draft
        ? "bg-gray-100 text-gray-600"
        : "bg-red-100 text-red-700"}
    `}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const verificationChip = (status: VerificationStatus) => (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border
      ${status === VerificationStatus.Verified
        ? "bg-teal-100 text-teal-700 border-teal-200"
        : status === VerificationStatus.Rejected
        ? "bg-red-100 text-red-700 border-red-200"
        : status === VerificationStatus.UnderReview
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-gray-100 text-gray-700 border-gray-200"}
    `}>
      {status.replace(/_/g, " ").replace(/\b\w/g, (x) => x.toUpperCase())}
    </span>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-3">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-700 mb-1">{course.title}</h1>
          <div className="flex items-center gap-3">
            {courseStatusChip(course.status)}
            {verificationChip(course.verification.status)}
            <span className={`inline-block px-2 py-1 bg-teal-50 border border-teal-100 text-teal-600 rounded-full text-xs font-medium`}>
              {courseLevelLabel(course.level)}
            </span>
            {course.tags.map((tag) => (
              <span key={tag} className="inline-block mx-1 px-2 py-0.5 bg-gray-100 text-teal-700 text-xs rounded-full font-medium">{tag}</span>
            ))}
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-lg border border-teal-200 px-3 py-2 bg-white text-teal-700 hover:bg-teal-50 transition"
        >
          <X className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Course Core Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-xl border border-teal-100 shadow-sm p-6 mb-8">
        <div className="md:col-span-3 flex flex-col items-center gap-3">
          <img
            src={course.thumbnail || "/images/default-course.jpg"}
            alt={course.title}
            className="w-40 h-40 rounded-lg object-cover border"
          />
          {course.previewVideo && (
            <video controls className="rounded-lg border w-full">
              <source src={course.previewVideo} />
              Your browser does not support video preview.
            </video>
          )}
        </div>
        <div className="md:col-span-9 flex flex-col gap-3">
          <div className="text-sm text-gray-700 mb-2">{course.description}</div>
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-1 text-sm text-gray-700">
              <strong>Enrollments:</strong> {course.enrollmentCount}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-gray-700">
              <strong>Category:</strong> {course.categoryId}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-gray-700">
              <strong>Duration:</strong> {course.duration} min
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-gray-700">
              <strong>Instructor:</strong> {course.instructorId}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-gray-700">
              <strong>Price:</strong> ₹{course.price}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-gray-700">
              <strong>Ratings:</strong>{" "}
              {course.rating !== null ? `${course.rating}/5` : "--"}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-gray-700">
              <strong>Status:</strong> {course.isActive ? "Active" : "Blocked"}
            </span>
            {course.publishedAt && (
              <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                <strong>Published:</strong> {new Date(course.publishedAt).toLocaleDateString()}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-sm text-gray-700">
              <strong>Created:</strong> {new Date(course.createdAt).toLocaleDateString()}
            </span>
          </div>
          {course.verification.remarks && (
            <div className="mt-3 text-xs bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              <strong>Verification Remarks: </strong>{course.verification.remarks}
            </div>
          )}
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="mb-6 bg-teal-50 border border-teal-100 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-teal-700 mb-2">What You'll Learn</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-800">
          {course.whatYouWillLearn.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Modules & Curriculum */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-teal-700 mb-4">Curriculum</h2>
        <div className="space-y-4">
          {course.modules.length === 0 ? (
            <div className="text-gray-500 bg-gray-50 rounded-lg p-4 border border-gray-100">No modules yet.</div>
          ) : course.modules.map((module, i) => (
            <div key={module.id} className="bg-white border-l-4 border-teal-200 rounded-lg shadow-sm p-4">
              <h3 className="text-md font-bold text-teal-800">{i + 1}. {module.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{module.description}</p>
              <p className="text-sm text-gray-400">Duration: {module.duration} min</p>
              <ul className="list-inside mt-2 ml-2">
                {module.chapters.map((chapter, idx) => (
                  <li key={chapter.id} className="py-1 border-b last:border-b-0 border-gray-100">
                    <div className="font-medium text-gray-800">{idx + 1}. {chapter.title}</div>
                    <div className="text-xs text-gray-500">{chapter.description}</div>
                    <span className="text-xs text-teal-600">
                      Video duration: {chapter.duration} mins
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
