import { 
  Users, 
  Star,
  Clock,
  BookOpen,
  CheckCircle,
  PlayCircle,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  BarChart3,
  Award,
  Eye,
  Edit,
  Archive
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import type { AppDispatch } from '../../redux/store';
import { getCourseDetails } from '../../redux/services/instructorServices';
import { toast } from 'react-toastify';

// ✅ Replace enums with union types
export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseStatus = "draft" | "under_review" | "published" | "archived";

export type ResourceType = "pdf" | "docs" | "exe" | "zip" | "other";

export interface Chapter {
  title: string;
  description: string;
  thumbnail: string;
  video: string;
  duration: number;
  resources: Resource[];
}

export interface Resource {
  title: string;
  file: string;
  size: number;
  type: ResourceType;
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
    id:string,
    name:string
  };
  enrollmentCount: number;
  instructor: {
    id:string;
    name:string;
    profilePic:string|null
  };
  whatYouWillLearn:string[]|null
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
}

const ViewCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  console.log(courseId);
  const dispatch= useDispatch<AppDispatch>()
  
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [showPreview, setShowPreview] = useState(false);

  // Mock course data - replace with actual API call
  // const course: Course = {
  //   id: '1',
  //   title: 'Complete React Development Masterclass 2025',
  //   description: 'Master React.js from beginner to advanced level. Learn hooks, context API, Redux, TypeScript integration, testing, performance optimization, and real-world project development. Build production-ready applications with modern React patterns and best practices.',
  //   prerequisites: ['Basic JavaScript', 'HTML & CSS', 'ES6+ Features'],
  //   categoryId: 'web-development',
  //   enrollmentCount: 1247,
  //   instructorId: 'instructor-123',
  //   level: 'intermediate',
  //   duration: 42,
  //   tags: ['React', 'JavaScript', 'Frontend', 'Web Development', 'TypeScript'],
  //   totalRatings: 892,
  //   isActive: true,
  //   status: 'published',
  //   createdAt: new Date('2024-01-15'),
  //   updatedAt: new Date('2024-10-20'),
  //   thumbnail: 'https://via.placeholder.com/1200x600?text=React+Masterclass',
  //   previewVideo: 'https://www.example.com/preview.mp4',
  //   price: 79.99,
  //   rating: 4.7,
  //   publishedAt: new Date('2024-02-01'),
  //   modules: [
  //     {
  //       title: 'Getting Started with React',
  //       description: 'Introduction to React fundamentals and setup',
  //       duration: 180,
  //       chapters: [
  //         {
  //           title: 'Introduction to React',
  //           description: 'Understanding what React is and why to use it',
  //           thumbnail: 'https://via.placeholder.com/300x200',
  //           video: 'https://example.com/video1.mp4',
  //           duration: 15,
  //           resources: [
  //             {
  //               title: 'React Cheat Sheet',
  //               file: 'react-cheatsheet.pdf',
  //               size: 2.5,
  //               type: 'pdf'
  //             },
  //             {
  //               title: 'Setup Guide',
  //               file: 'setup-guide.pdf',
  //               size: 1.2,
  //               type: 'pdf'
  //             }
  //           ]
  //         },
  //         {
  //           title: 'Setting Up Development Environment',
  //           description: 'Install Node.js, npm, and create-react-app',
  //           thumbnail: 'https://via.placeholder.com/300x200',
  //           video: 'https://example.com/video2.mp4',
  //           duration: 20,
  //           resources: [
  //             {
  //               title: 'Installation Scripts',
  //               file: 'install-scripts.zip',
  //               size: 0.5,
  //               type: 'zip'
  //             }
  //           ]
  //         },
  //         {
  //           title: 'Your First React Component',
  //           description: 'Create and understand React components',
  //           thumbnail: 'https://via.placeholder.com/300x200',
  //           video: 'https://example.com/video3.mp4',
  //           duration: 25,
  //           resources: []
  //         }
  //       ]
  //     },
  //     {
  //       title: 'React Hooks Deep Dive',
  //       description: 'Master all React hooks with practical examples',
  //       duration: 240,
  //       chapters: [
  //         {
  //           title: 'useState Hook',
  //           description: 'Managing state in functional components',
  //           thumbnail: 'https://via.placeholder.com/300x200',
  //           video: 'https://example.com/video4.mp4',
  //           duration: 30,
  //           resources: [
  //             {
  //               title: 'useState Examples',
  //               file: 'usestate-examples.zip',
  //               size: 3.2,
  //               type: 'zip'
  //             }
  //           ]
  //         },
  //         {
  //           title: 'useEffect Hook',
  //           description: 'Side effects and lifecycle management',
  //           thumbnail: 'https://via.placeholder.com/300x200',
  //           video: 'https://example.com/video5.mp4',
  //           duration: 35,
  //           resources: []
  //         },
  //         {
  //           title: 'Custom Hooks',
  //           description: 'Creating reusable custom hooks',
  //           thumbnail: 'https://via.placeholder.com/300x200',
  //           video: 'https://example.com/video6.mp4',
  //           duration: 40,
  //           resources: [
  //             {
  //               title: 'Custom Hooks Library',
  //               file: 'custom-hooks.zip',
  //               size: 5.8,
  //               type: 'zip'
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       title: 'State Management with Redux',
  //       description: 'Learn Redux for complex state management',
  //       duration: 300,
  //       chapters: [
  //         {
  //           title: 'Redux Fundamentals',
  //           description: 'Actions, reducers, and store',
  //           thumbnail: 'https://via.placeholder.com/300x200',
  //           video: 'https://example.com/video7.mp4',
  //           duration: 45,
  //           resources: [
  //             {
  //               title: 'Redux Documentation',
  //               file: 'redux-docs.pdf',
  //               size: 4.5,
  //               type: 'pdf'
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // };

  const [course, setCourse] = useState<Course >({
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
      modules: []
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
      case 'under_review':
        return { label: 'Under Review', className: 'bg-yellow-100 text-yellow-800', icon: Clock };
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

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'pdf':
      case 'docs':
        return FileText;
      case 'zip':
      case 'exe':
        return Download;
      default:
        return FileText;
    }
  };

  const formatFileSize = (size: number) => {
    return size >= 1 ? `${size.toFixed(1)} MB` : `${(size * 1024).toFixed(0)} KB`;
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Thumbnail */}
      <div className="relative bg-gray-900 text-white">
        {course.thumbnail && (
          <div className="absolute inset-0 opacity-30">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
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
                  <span>{course.duration} hours total</span>
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
                  <div className="relative aspect-video bg-gray-200">
                    {!showPreview ? (
                      <div 
                        className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gray-900 bg-opacity-50"
                        onClick={() => setShowPreview(true)}
                      >
                        <div className="text-center">
                          <PlayCircle className="w-16 h-16 text-white mx-auto mb-2" />
                          <span className="text-white font-medium">Preview This Course</span>
                        </div>
                      </div>
                    ) : (
                      <video controls className="w-full h-full">
                        <source src={course.previewVideo} type="video/mp4" />
                      
                      </video>
                    )}
                  </div>
                )}
                
                <div className="p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-4">
                    ${course.price}
                  </div>
                  
                  <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors mb-3">
                    Enroll Now
                  </button>
                  
                  <button className="w-full border-2 border-teal-600 text-teal-600 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
                    Add to Wishlist
                  </button>

                  <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span>24-hour money-back guarantee</span>
                    </div>
                  </div>
                </div>
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
                  {course.modules.length} modules • {getTotalChapters()} chapters • {course.duration}h total
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
                        {Math.floor(module.duration / 60)}h {module.duration % 60}m
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
                                  
                                  {chapter.resources.length > 0 && (
                                    <div className="mt-3 ml-6 space-y-2">
                                      {chapter.resources.map((resource, resIndex) => {
                                        const ResourceIcon = getResourceIcon(resource.type);
                                        return (
                                          <div key={resIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                            <ResourceIcon className="w-4 h-4" />
                                            <span>{resource.title}</span>
                                            <span className="text-xs text-gray-500">
                                              ({resource.type.toUpperCase()}, {formatFileSize(resource.size)})
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600 ml-4">
                                  {chapter.duration} min
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
                      {course.duration}h
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
                  {/* <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="text-gray-900 mt-1 flex items-center">
                      {course.isActive ? (
                        <><CheckCircle className="w-4 h-4 text-green-500 mr-1" /> Active</>
                      ) : (
                        <><span className="w-4 h-4 mr-1">•</span> Inactive</>
                      )}
                    </p>
                  </div> */}
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
