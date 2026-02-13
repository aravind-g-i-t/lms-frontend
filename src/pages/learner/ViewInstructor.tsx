import {
  Users,
  Star,
  BookOpen,
  Calendar,
  Globe,
  FileText,
  Mail,
  Briefcase,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';
import LearnerNav from '../../components/learner/LearnerNav';
// import { getInstructorDetailsForLearner } from '../../services/learnerServices';
import { formatDuration } from '../../utils/formats';

type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Instructor {
  id: string;
  name: string;
  email: string;
  joiningDate: Date;
  expertise: string[];
  designation: string | null;
  profilePic: string | null;
  resume: string | null;
  website: string | null;
  bio: string | null;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  enrollmentCount: number;
  instructorId: string;
  level: CourseLevel;
  duration: number;
  totalChapters: number;
  totalModules: number;
  tags: string[];
  thumbnail: string | null;
  price: number;
  rating: number | null;
  publishedAt: Date | null;
}

interface InstructorDetails extends Instructor {
  courses: Course[];
  totalStudents: number;
  totalCourses: number;
  averageRating: number | null;
}

// MOCK DATA FOR TESTING
const mockInstructorData: InstructorDetails = {
  id: 'inst_001',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@example.com',
  joiningDate: new Date('2020-03-15'),
  expertise: ['React', 'Node.js', 'TypeScript', 'System Design', 'Cloud Architecture', 'DevOps'],
  designation: 'Senior Software Architect & Tech Lead',
  profilePic: 'https://i.pravatar.cc/300?img=47',
  resume: 'https://example.com/resume.pdf',
  website: 'https://sarahjohnson.dev',
  bio: 'Passionate educator with 15+ years of experience in software development and architecture. I specialize in building scalable web applications and teaching modern development practices. My mission is to help developers master the art of writing clean, maintainable code while understanding the underlying principles that make great software.',
  totalStudents: 45678,
  totalCourses: 12,
  averageRating: 4.8,
  courses: [
    {
      id: 'course_001',
      title: 'Complete React Masterclass 2024',
      description: 'Master React from basics to advanced concepts including hooks, context, Redux, and performance optimization.',
      enrollmentCount: 12543,
      instructorId: 'inst_001',
      level: 'intermediate',
      duration: 2400, // 40 hours in minutes
      totalChapters: 156,
      totalModules: 18,
      tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
      thumbnail: 'https://picsum.photos/seed/react/400/225',
      price: 2999,
      rating: 4.9,
      publishedAt: new Date('2024-01-15'),
    },
    {
      id: 'course_002',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js, Express, MongoDB, and REST APIs.',
      enrollmentCount: 8765,
      instructorId: 'inst_001',
      level: 'intermediate',
      duration: 1800, // 30 hours
      totalChapters: 120,
      totalModules: 14,
      tags: ['Node.js', 'Express', 'MongoDB', 'Backend', 'API'],
      thumbnail: 'https://picsum.photos/seed/nodejs/400/225',
      price: 2499,
      rating: 4.7,
      publishedAt: new Date('2023-11-20'),
    },
    {
      id: 'course_003',
      title: 'TypeScript for Beginners',
      description: 'Learn TypeScript from scratch and add type safety to your JavaScript projects.',
      enrollmentCount: 15234,
      instructorId: 'inst_001',
      level: 'beginner',
      duration: 900, // 15 hours
      totalChapters: 78,
      totalModules: 10,
      tags: ['TypeScript', 'JavaScript', 'Programming'],
      thumbnail: 'https://picsum.photos/seed/typescript/400/225',
      price: 1999,
      rating: 4.8,
      publishedAt: new Date('2023-09-10'),
    },
    {
      id: 'course_004',
      title: 'Advanced System Design',
      description: 'Design scalable, fault-tolerant systems using industry-standard patterns and practices.',
      enrollmentCount: 6543,
      instructorId: 'inst_001',
      level: 'advanced',
      duration: 2100, // 35 hours
      totalChapters: 98,
      totalModules: 12,
      tags: ['System Design', 'Architecture', 'Scalability', 'Microservices'],
      thumbnail: 'https://picsum.photos/seed/systemdesign/400/225',
      price: 3499,
      rating: 4.9,
      publishedAt: new Date('2024-02-01'),
    },
    {
      id: 'course_005',
      title: 'Docker & Kubernetes Essentials',
      description: 'Master containerization and orchestration with Docker and Kubernetes.',
      enrollmentCount: 9876,
      instructorId: 'inst_001',
      level: 'intermediate',
      duration: 1500, // 25 hours
      totalChapters: 95,
      totalModules: 11,
      tags: ['Docker', 'Kubernetes', 'DevOps', 'Containers'],
      thumbnail: 'https://picsum.photos/seed/docker/400/225',
      price: 2799,
      rating: 4.7,
      publishedAt: new Date('2023-12-05'),
    },
    {
      id: 'course_006',
      title: 'Web Development Bootcamp',
      description: 'Complete web development course covering HTML, CSS, JavaScript, and modern frameworks.',
      enrollmentCount: 18765,
      instructorId: 'inst_001',
      level: 'beginner',
      duration: 3600, // 60 hours
      totalChapters: 245,
      totalModules: 24,
      tags: ['HTML', 'CSS', 'JavaScript', 'Web Development', 'Bootcamp'],
      thumbnail: 'https://picsum.photos/seed/webdev/400/225',
      price: 3999,
      rating: 4.8,
      publishedAt: new Date('2023-08-01'),
    },
    {
      id: 'course_007',
      title: 'AWS Cloud Practitioner',
      description: 'Get started with Amazon Web Services and prepare for the AWS certification.',
      enrollmentCount: 7234,
      instructorId: 'inst_001',
      level: 'beginner',
      duration: 1200, // 20 hours
      totalChapters: 86,
      totalModules: 9,
      tags: ['AWS', 'Cloud', 'Certification'],
      thumbnail: 'https://picsum.photos/seed/aws/400/225',
      price: 2299,
      rating: 4.6,
      publishedAt: new Date('2023-10-15'),
    },
    {
      id: 'course_008',
      title: 'GraphQL API Development',
      description: 'Build modern APIs with GraphQL, Apollo Server, and best practices.',
      enrollmentCount: 5432,
      instructorId: 'inst_001',
      level: 'advanced',
      duration: 1350, // 22.5 hours
      totalChapters: 67,
      totalModules: 8,
      tags: ['GraphQL', 'API', 'Apollo', 'Backend'],
      thumbnail: 'https://picsum.photos/seed/graphql/400/225',
      price: 2599,
      rating: 4.8,
      publishedAt: new Date('2024-01-10'),
    },
    {
      id: 'course_009',
      title: 'React Native Mobile Apps',
      description: 'Create cross-platform mobile applications using React Native.',
      enrollmentCount: 8934,
      instructorId: 'inst_001',
      level: 'intermediate',
      duration: 2700, // 45 hours
      totalChapters: 134,
      totalModules: 16,
      tags: ['React Native', 'Mobile', 'iOS', 'Android'],
      thumbnail: 'https://picsum.photos/seed/reactnative/400/225',
      price: 3299,
      rating: 4.7,
      publishedAt: new Date('2023-07-20'),
    },
    {
      id: 'course_010',
      title: 'JavaScript ES6+ Fundamentals',
      description: 'Deep dive into modern JavaScript features and best practices.',
      enrollmentCount: 11234,
      instructorId: 'inst_001',
      level: 'beginner',
      duration: 1050, // 17.5 hours
      totalChapters: 92,
      totalModules: 11,
      tags: ['JavaScript', 'ES6', 'Programming', 'Frontend'],
      thumbnail: 'https://picsum.photos/seed/javascript/400/225',
      price: 1799,
      rating: 4.9,
      publishedAt: new Date('2023-06-01'),
    },
    {
      id: 'course_011',
      title: 'MongoDB Database Design',
      description: 'Learn NoSQL database design patterns and MongoDB optimization techniques.',
      enrollmentCount: 6789,
      instructorId: 'inst_001',
      level: 'intermediate',
      duration: 1440, // 24 hours
      totalChapters: 88,
      totalModules: 10,
      tags: ['MongoDB', 'Database', 'NoSQL', 'Backend'],
      thumbnail: 'https://picsum.photos/seed/mongodb/400/225',
      price: 2199,
      rating: 4.6,
      publishedAt: new Date('2023-09-25'),
    },
    {
      id: 'course_012',
      title: 'Microservices Architecture',
      description: 'Design and implement microservices using modern patterns and technologies.',
      enrollmentCount: 4567,
      instructorId: 'inst_001',
      level: 'advanced',
      duration: 2550, // 42.5 hours
      totalChapters: 112,
      totalModules: 13,
      tags: ['Microservices', 'Architecture', 'Docker', 'Kubernetes', 'System Design'],
      thumbnail: 'https://picsum.photos/seed/microservices/400/225',
      price: 3799,
      rating: 4.9,
      publishedAt: new Date('2024-03-01'),
    },
  ],
};

const ViewInstructorPage = () => {
  const { instructorId } = useParams<{ instructorId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [instructor, setInstructor] = useState<InstructorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<'all' | CourseLevel>('all');

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      try {
        setLoading(true);
        if (!instructorId) {
          return;
        }

        // FOR TESTING: Use mock data
        // Comment out these lines and uncomment API call when ready
        setTimeout(() => {
          setInstructor(mockInstructorData);
          setLoading(false);
        }, 800);

        // PRODUCTION: Uncomment this block when API is ready
        /*
        const response = await dispatch(
          getInstructorDetailsForLearner({ instructorId })
        ).unwrap();

        console.log(response.data);
        setInstructor(response.data);
        setLoading(false);
        */
      } catch (err) {
        toast.error(err as string);
        setLoading(false);
      }
    };

    fetchInstructorDetails();
  }, [dispatch, instructorId]);

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
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

  const filteredCourses =
    selectedLevel === 'all'
      ? instructor?.courses || []
      : instructor?.courses.filter((c) => c.level === selectedLevel) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LearnerNav />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LearnerNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Instructor not found</h2>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-teal-600 hover:text-teal-700"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LearnerNav />

      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Instructor Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6 mb-6">
                {/* Profile Picture */}
                <div className="relative">
                  <img
                    src={instructor.profilePic || '/images/default-profile.jpg'}
                    alt={instructor.name}
                    className="w-32 h-32 rounded-full border-4 border-teal-300 object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-teal-500 rounded-full p-2">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Name & Designation */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{instructor.name}</h1>
                  {instructor.designation && (
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="w-5 h-5 text-teal-300" />
                      <span className="text-xl text-gray-300">{instructor.designation}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-300 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Teaching since {formatDate(instructor.joiningDate)}
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="font-semibold mr-1">
                        {instructor.averageRating?.toFixed(1) || 'N/A'}
                      </span>
                      <span className="text-gray-300">average rating</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="w-5 h-5 mr-1" />
                      <span>{instructor.totalStudents.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <BookOpen className="w-5 h-5 mr-1" />
                      <span>{instructor.totalCourses} courses</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {instructor.bio && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-teal-300">About</h3>
                  <p className="text-gray-300 leading-relaxed">{instructor.bio}</p>
                </div>
              )}

              {/* Expertise Tags */}
              {instructor.expertise.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 text-teal-300">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {instructor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-teal-600/30 text-teal-100 rounded-full text-sm font-medium border border-teal-500/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Contact & Links Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg overflow-hidden shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Connect</h3>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <a
                        href={`mailto:${instructor.email}`}
                        className="text-gray-900 hover:text-teal-600 break-all"
                      >
                        {instructor.email}
                      </a>
                    </div>
                  </div>

                  {/* Website */}
                  {instructor.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Website</p>
                        <a
                          href={instructor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 break-all"
                        >
                          Visit website →
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Resume */}
                  {instructor.resume && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Resume</p>
                        <a
                          href={instructor.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700"
                        >
                          Download CV →
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Courses</span>
                    <span className="font-bold text-gray-900">{instructor.totalCourses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Students</span>
                    <span className="font-bold text-gray-900">
                      {instructor.totalStudents.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Avg. Rating</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      {instructor.averageRating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Courses</h2>
              <p className="text-gray-600 mt-1">
                Explore {instructor.totalCourses} course{instructor.totalCourses !== 1 ? 's' : ''}{' '}
                by {instructor.name}
              </p>
            </div>

            {/* Level Filter */}
            <div className="flex gap-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedLevel === level
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/learner/courses/${course.id}`)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-gray-200 hover:border-teal-300"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-200">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-teal-400 to-cyan-600">
                        <BookOpen className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}

                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getLevelColor(
                          course.level
                        )}`}
                      >
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.enrollmentCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(course.duration)}
                        </span>
                      </div>
                    </div>

                    {/* Rating & Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-gray-900">
                          {course.rating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">₹{course.price}</div>
                    </div>

                    {/* Course Details */}
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                      <span>{course.totalModules} modules</span>
                      <span>•</span>
                      <span>{course.totalChapters} chapters</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">
                {selectedLevel === 'all'
                  ? 'This instructor has not published any courses yet.'
                  : `No ${selectedLevel} level courses available.`}
              </p>
            </div>
          )}
        </div>

        {/* Course Tags Section */}
        {instructor.courses.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Topics</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(
                new Set(instructor.courses.flatMap((course) => course.tags))
              ).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewInstructorPage;