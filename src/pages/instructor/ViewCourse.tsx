import {
  Users,
  Star,
  Clock,
  BookOpen,
  CheckCircle,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  BarChart3,
  Award,
  Eye,
  Edit,
  Archive,
  ArrowLeft,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../redux/store';
import { getCourseDetails, submitCourseForReview, updateCourseStatus } from '../../redux/services/instructorServices';
import { toast } from 'react-toastify';
import { formatDuration } from '../../utils/formats';

// ✅ Replace enums with union types
export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseStatus = "draft" | "published" | "archived";

export type VerificationStatus = "not_verified" | "under_review" | "verified" | "rejected" | "blocked"


export interface Chapter {
  title: string;
  description: string;
  thumbnail: string;
  video: string;
  duration: number;
  resources: Resource[];
}

export interface Resource {
  id: string;
  name: string;
  file: string;
  size: number;
}

export interface Module {
  title: string;
  description: string;
  duration: number;
  chapters: Chapter[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  category: {
    id: string,
    name: string
  };
  enrollmentCount: number;
  instructor: {
    id: string;
    name: string;
    profilePic: string | null
  };
  whatYouWillLearn: string[] | null
  modules: Module[];
  level: CourseLevel;
  duration: number;
  tags: string[];
  totalRatings: number;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
  thumbnail: string | null;
  previewVideo: string | null;
  price: number;
  rating: number | null;
  publishedAt: Date | null;
  verification: {
    status: VerificationStatus;
    reviewedAt: Date | null;
    submittedAt: Date | null;
    remarks: string | null;
  };
}



const ViewCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  console.log(courseId);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [showPreview, setShowPreview] = useState(false);
  const [showRemarks, setShowRemarks] = useState(false);




  const [course, setCourse] = useState<Course>({
    id: '',
    title: '',
    description: "",
    prerequisites: [],
    category: {
      id: "",
      name: ""
    },
    enrollmentCount: 0,
    instructor: {
      id: "",
      name: "",
      profilePic: null
    },
    level: 'beginner',
    duration: 0,
    tags: [],
    whatYouWillLearn: [],
    totalRatings: 0,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: null,
    previewVideo: null,
    price: 0,
    rating: null,
    publishedAt: null,
    modules: [],
    verification: {
      status: "not_verified",
      submittedAt: null,
      reviewedAt: null,
      remarks: null
    }
  });

  useEffect(() => {

    const fetchCourseDetails = async () => {
      try {
        if (!courseId) {
          return
        }
        const response = await dispatch(getCourseDetails(courseId)).unwrap();
        console.log(response.data);
        setCourse(response.data)

      } catch (err) {
        toast.error(err as string);
      }
    };

    fetchCourseDetails();
  }, [dispatch, courseId]);




  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedModules(newExpanded);
  };

  const getStatusConfig = (status: CourseStatus) => {
    switch (status) {
      case 'draft':
        return { label: 'Draft', className: 'bg-gray-100 text-gray-800', icon: Edit };
      case 'published':
        return { label: 'Published', className: 'bg-green-100 text-green-800', icon: Eye };
      case 'archived':
        return { label: 'Archived', className: 'bg-red-100 text-red-800', icon: Archive };
    }
  };

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
    }
  };



  // const formatFileSize = (size: number) => {
  //   return size >= 1 ? `${size.toFixed(1)} MB` : `${(size * 1024).toFixed(0)} KB`;
  // };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTotalChapters = () => {
    return course.modules.reduce((total, module) => total + module.chapters.length, 0);
  };

  const statusConfig = getStatusConfig(course.status);
  const StatusIcon = statusConfig.icon;


  const handleSubmitForVerification = async () => {
    try {
      await dispatch(submitCourseForReview({ courseId: course.id })).unwrap();

      setCourse(prev =>
        prev ? ({ ...prev, verification: { ...course.verification, status: "under_review" } } as Course) : prev
      );
      toast.success("Course submitted for verification.")
    } catch (error) {
      toast.error(error as string)
    }


  }

  const handlePublish = async () => {
    try {
      await dispatch(updateCourseStatus({
        courseId: course.id,
        status: "published"
      })).unwrap();

      setCourse(prev =>
        prev ? ({ ...prev, status: "published" } as Course) : prev
      );
      toast.success("Course published successfully.")
    } catch (error) {
      toast.error(error as string)
    }
  }

  const handleArchive = async () => {
    try {
      await dispatch(updateCourseStatus({
        courseId: course.id,
        status: "archived"
      })).unwrap();

      setCourse(prev =>
        prev ? ({ ...prev, status: "archived" } as Course) : prev
      );
      toast.success("Course archived successfully.")
    } catch (error) {
      toast.error(error as string)
    }
  }

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

        {/* Right Action Button */}
        {(course.verification.status === "not_verified" || course.verification.status === "rejected") && (
          <button
            onClick={handleSubmitForVerification}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Submit for Verification
          </button>
        )}
        {(course.verification.status === "verified" &&
          course.status !== "published") && (
            <button
              onClick={handlePublish}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Publish Course
            </button>
          )}
        {(course.verification.status === "verified" &&
          course.status === "published") && (
            <button
              onClick={handleArchive}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Archive Course
            </button>
          )}
      </div>
      {/* Hero Section with Thumbnail */}
      <div className="relative bg-gray-900 text-white">

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusConfig.className}`}>
                  <StatusIcon className="w-4 h-4 mr-1" />
                  {statusConfig.label}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-2xl font-semibold text-teal-400 mb-4">
                ₹{course.price.toLocaleString()}
                {/* <span className="text-sm text-gray-300 ml-2 font-normal">one-time payment</span> */}
              </p>
              <p className="text-xl text-gray-300 mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-semibold mr-1">{course.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-gray-300">({course.totalRatings} ratings)</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="w-5 h-5 mr-1" />
                  <span>{course.enrollmentCount.toLocaleString()} students enrolled</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>{formatDuration(course.duration)} total</span>
                </div>
              </div>

              <div className="mt-6 flex items-center text-gray-300 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Created {formatDate(course.createdAt)}</span>
                {course.publishedAt && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Published {formatDate(course.publishedAt)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Right: Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                {course.previewVideo && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Build modern React applications from scratch',
                  'Master React Hooks and functional components',
                  'Implement state management with Redux',
                  'Create responsive and accessible UIs',
                  'Write clean and maintainable code',
                  'Deploy production-ready applications'
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Award className="w-5 h-5 text-teal-600 mr-2" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                <div className="text-sm text-gray-600">
                  {course.modules.length} modules • {getTotalChapters()} chapters • {formatDuration(course.duration)} total
                </div>
              </div>

              <div className="space-y-3">
                {course.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleModule(moduleIndex)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {expandedModules.has(moduleIndex) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">
                            Module {moduleIndex + 1}: {module.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDuration(module.duration)}
                      </div>
                    </button>

                    {expandedModules.has(moduleIndex) && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        {module.chapters.map((chapter, chapterIndex) => (
                          <div key={chapterIndex} className="border-b border-gray-200 last:border-b-0">
                            <div className="p-4 pl-12">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <PlayCircle className="w-4 h-4 text-teal-600" />
                                    <h4 className="font-medium text-gray-900">
                                      {chapterIndex + 1}. {chapter.title}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-gray-600 ml-6">{chapter.description}</p>

                                  {/* {chapter.resources.length > 0 && (
                                    <div className="mt-3 ml-6 space-y-2">

                                      {chapter.resources.map((resource, resIndex) => {
                                        const ext = resource.name.split(".").pop()?.toLowerCase() || "";


                                        const Icon = (() => {
                                          if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return ImageIcon;
                                          if (["mp4", "mov", "webm", "mkv"].includes(ext)) return VideoIcon;
                                          if (["zip", "rar", "7z"].includes(ext)) return Archive;
                                          if (["pdf"].includes(ext)) return FileText;
                                          return FileText; 
                                        })();

                                        return (
                                          <div
                                            key={resIndex}
                                            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition"
                                          >
                                      
                                            <div className="flex items-center gap-3 overflow-hidden">
                                              <div className="flex items-center justify-center w-9 h-9 bg-gray-100 border border-gray-300 rounded-md">
                                                <Icon className="w-5 h-5 text-gray-700" />
                                              </div>

                                              <div className="flex flex-col overflow-hidden">
                                                <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                  {resource.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                  {(resource.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                              </div>
                                            </div>

                                      
                                            <a
                                              href={resource.file}
                                              download
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-teal-600 hover:text-teal-700 p-1"
                                              title="Download"
                                            >
                                              <Download className="w-5 h-5" />
                                            </a>
                                          </div>
                                        );
                                      })}

                                    </div>
                                  )} */}


                                </div>
                                <div className="text-sm text-gray-600 ml-4">
                                  {formatDuration(chapter.duration)}
                                </div>
                              </div>
                            </div>
                          </div>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Course Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Enrolled
                    </span>
                    <span className="font-semibold text-gray-900">
                      {course.enrollmentCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Ratings
                    </span>
                    <span className="font-semibold text-gray-900">
                      {course.totalRatings}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Modules
                    </span>
                    <span className="font-semibold text-gray-900">
                      {course.modules.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Chapters
                    </span>
                    <span className="font-semibold text-gray-900">
                      {getTotalChapters()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Duration
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatDuration(course.duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Course Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Course ID:</span>
                    <p className="font-mono text-gray-900 mt-1">{course.id}</p>
                  </div>

                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="text-gray-900 mt-1">{course.category.name}</p>
                  </div>

                  <div>
                    <span className="text-gray-600">Instructor:</span>
                    <p className="font-mono text-gray-900 mt-1">{course.instructor.name}</p>
                  </div>

                  {/* ✅ Verification Status with expandable remarks */}
                  <div>
                    <span className="text-gray-600">Verification Status:</span>
                    <div className="mt-1 flex items-center gap-2">
                      <p
                        className={`font-semibold capitalize ${course.verification.status === "verified"
                          ? "text-green-600"
                          : course.verification.status === "under_review"
                            ? "text-amber-600"
                            : course.verification.status === "rejected"
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                      >
                        {course.verification.status.replace("_", " ")}
                      </p>

                      {/* ⬇️ Show arrow only if remarks exist */}
                      {course.verification.remarks && (
                        <button
                          onClick={() => setShowRemarks((prev) => !prev)}
                          className="flex items-center text-gray-500 hover:text-gray-700 transition"
                        >
                          {showRemarks ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* 🧾 Remarks content */}
                    {showRemarks && course.verification.remarks && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200 text-gray-700">
                        <p className="text-sm whitespace-pre-line">
                          {course.verification.remarks}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <p className="text-gray-900 mt-1">{formatDate(course.updatedAt)}</p>
                  </div>
                </div>
              </div>


              {/* Action Buttons (for instructors) */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Instructor Actions</h3>
                <div className="space-y-2">
                  <Link
                    to={`/instructor/courses/${course.id}/edit`}
                    className="flex items-center justify-center w-full px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Course
                  </Link>
                  <Link
                    to={`/instructor/courses/${course.id}/analytics`}
                    className="flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCoursePage;
