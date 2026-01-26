import { useState } from 'react';
import { Star, Clock, BookOpen, Users, ChevronRight, Play, Award } from 'lucide-react';
import LearnerNav from '../../components/learner/LearnerNav';
import { Link, useNavigate } from 'react-router-dom';

type CourseLevel = "beginner" | "intermediate" | "advanced";

interface EnrolledCourse {
  id: string;
  courseId:string;
  courseTitle: string;
  thumbnail: string;
  instructor: { id: string; name: string };
  duration: number;
  progressPercentage: number;
  completedChapters: number;
  totalChapters: number;
  lastAccessedAt: Date;
  enrolledAt:Date
}

interface Course {
  id: string,
  title: string,
  description: string,
  thumbnail: string,
  instructor: {
    id: string;
    name: string,
  },
  level: CourseLevel
  duration: number,
  totalChapters: number,
  totalModules: number,
  price: number,
  rating: number,
  totalRatings: number,
  enrollmentCount: number,
}

interface Instructor {
  id: string,
  name: string,
  designation: string,
  profilePic: string,
  expertise: string[],
}

const LearnerHome = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  // Mock data based on schemas
  const enrolledCourses: EnrolledCourse[] = [
    {
      id: '1',
      courseId:"c01",
      courseTitle: 'Advanced React Patterns',
      thumbnail: '/api/placeholder/400/250',
      instructor: { 
        id: "en1", 
        name: "Sarah Johnson" 
      },
      duration: 1800,
        progressPercentage: 65,
        completedChapters: 3,
        totalChapters: 42,
        lastAccessedAt: new Date('2024-01-24'),
        enrolledAt:new Date('2024-01-24')
    },
    {
      id: '2',
      courseId:"c02",
      courseTitle: 'UI/UX Design Masterclass',
      thumbnail: '/api/placeholder/400/250',
      instructor: { 
        id: "en1", 
        name: "Michael Chen" 
      },
      duration: 1440,
        progressPercentage: 32,
        completedChapters: 2,
        totalChapters: 38,
        lastAccessedAt: new Date('2024-01-23'),
        enrolledAt:new Date('2024-01-24')
    }
  ];

  const recommendedCourses: Course[] = [
    {
      id: '3',
      title: 'Full Stack Web Development',
      description: 'Master modern web development with React, Node.js, and MongoDB',
      thumbnail: '/api/placeholder/350/200',
      instructor: {
        id: "inst1",
        name: "gkjaskjf"
      },
      level: 'intermediate',
      duration: 2400,
      totalChapters: 42,
      totalModules: 8,
      price: 3999,
      rating: 4.8,
      totalRatings: 1247,
      enrollmentCount: 8432,
    },
    {
      id: '4',
      title: 'Data Science with Python',
      description: 'Learn data analysis, visualization, and machine learning fundamentals',
      thumbnail: '/api/placeholder/350/200',
      instructor: {
        id: "inst2",
        name: "fsafa",
      },
      level: 'beginner',
      duration: 2100,
      totalChapters: 38,
      totalModules: 7,
      price: 3499,
      rating: 4.9,
      totalRatings: 2156,
      enrollmentCount: 12340,
    },
    {
      id: '5',
      title: 'Advanced JavaScript Concepts',
      description: 'Deep dive into closures, prototypes, async patterns, and more',
      thumbnail: '/api/placeholder/350/200',
      instructor: {
        id: "inst3",
        name: "fsafafdfsd",
      },
      level: 'advanced',
      duration: 1800,
      totalChapters: 35,
      totalModules: 6,
      price: 4499,
      rating: 4.7,
      totalRatings: 892,
      enrollmentCount: 5621,
    },
    {
      id: '6',
      title: 'Mobile App Development',
      description: 'Build cross-platform mobile apps with React Native',
      thumbnail: '/api/placeholder/350/200',
      instructor: {
        id: "ins42",
        name: "fdjfmdslfk",
      },
      level: 'intermediate',
      duration: 2700,
      totalChapters: 48,
      totalModules: 9,
      price: 4299,
      rating: 4.6,
      totalRatings: 673,
      enrollmentCount: 4231,
    }
  ];

  const popularCourses = [
    {
      id: '3',
      title: 'Full Stack Web Development',
      description: 'Master modern web development with React, Node.js, and MongoDB',
      thumbnail: '/api/placeholder/350/200',
      instructor: {
        id: "inst1",
        name: "gkjaskjf"
      },
      level: 'intermediate',
      duration: 2400,
      totalChapters: 42,
      totalModules: 8,
      price: 3999,
      rating: 4.8,
      totalRatings: 1247,
      enrollmentCount: 8432,
    },
    {
      id: '4',
      title: 'Data Science with Python',
      description: 'Learn data analysis, visualization, and machine learning fundamentals',
      thumbnail: '/api/placeholder/350/200',
      instructor: {
        id: "inst2",
        name: "fsafa",
      },
      level: 'beginner',
      duration: 2100,
      totalChapters: 38,
      totalModules: 7,
      price: 3499,
      rating: 4.9,
      totalRatings: 2156,
      enrollmentCount: 12340,
    },
    {
      id: '5',
      title: 'Advanced JavaScript Concepts',
      description: 'Deep dive into closures, prototypes, async patterns, and more',
      thumbnail: '/api/placeholder/350/200',
      instructor: {
        id: "inst3",
        name: "fsafafdfsd",
      },
      level: 'advanced',
      duration: 1800,
      totalChapters: 35,
      totalModules: 6,
      price: 4499,
      rating: 4.7,
      totalRatings: 892,
      enrollmentCount: 5621,
    },
    {
      id: '6',
      title: 'Mobile App Development',
      description: 'Build cross-platform mobile apps with React Native',
      thumbnail: '/api/placeholder/350/200',
      instructor: {
        id: "ins42",
        name: "fdjfmdslfk",
      },
      level: 'intermediate',
      duration: 2700,
      totalChapters: 48,
      totalModules: 9,
      price: 4299,
      rating: 4.6,
      totalRatings: 673,
      enrollmentCount: 4231,
    }
  ]

  const topInstructors: Instructor[] = [
    {
      id: '1',
      name: 'Dr. Robert Martinez',
      designation: 'Senior Software Architect',
      profilePic: '/api/placeholder/80/80',
      expertise: ['Cloud Computing', 'System Design', 'Microservices'],

    },
    {
      id: '2',
      name: 'Emily Chang',
      designation: 'UX Design Lead',
      profilePic: '/api/placeholder/80/80',
      expertise: ['UI/UX Design', 'Product Design', 'Figma'],

    },
    {
      id: '3',
      name: 'James Anderson',
      designation: 'AI Research Scientist',
      profilePic: '/api/placeholder/80/80',
      expertise: ['Machine Learning', 'Deep Learning', 'AI'],

    }
  ];

  const categories = [
    { id: 'all', name: 'All Courses', count: 234 },
    { id: 'development', name: 'Development', count: 89 },
    { id: 'design', name: 'Design', count: 56 },
    { id: 'data-science', name: 'Data Science', count: 42 },
    { id: 'business', name: 'Business', count: 47 }
  ];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeSinceAccess = (date: Date) => {
    const now = Date.now();
    const diff = now - new Date(date).getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <LearnerNav />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-400 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                Welcome back, Aravind!
              </h1>
              <p className="text-xl mb-2 opacity-90">
                Continue your learning journey
              </p>
              <p className="text-lg mb-8 opacity-80">
                Pick up where you left off and master new skills
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/learner/dashboard")}
                  className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Continue Learning
                </button>
                <button 
                onClick={()=>navigate("/explore")}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors">
                  Explore Courses
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold">Your Active Courses</span>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Courses in Progress</span>
                    <span className="text-2xl font-bold">{enrolledCourses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chapters Completed</span>
                    <span className="text-2xl font-bold">
                      {enrolledCourses.reduce((sum, course) => sum + course.completedChapters, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Progress</span>
                    <span className="text-2xl font-bold">
                      {Math.round(enrolledCourses.reduce((sum, course) => sum + course.progressPercentage, 0) / enrolledCourses.length)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Continue Learning</h2>
          <Link to="/learner/dashboard" className="text-teal-500 hover:text-teal-600 font-semibold flex items-center">
            View All <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex">
                <div className="relative w-48 h-full">
                  <img src={course.thumbnail} alt={course.courseTitle} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{course.courseTitle}</h3>
                    <span className="text-xs text-gray-500">
                      Last accessed {getTimeSinceAccess(course.lastAccessedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">by {course.instructor.name}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatDuration(course.duration)}</span>
                    <BookOpen className="w-4 h-4 ml-3 mr-1" />
                    <span>{course.completedChapters} of {course.totalChapters} chapters</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-teal-600">{course.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors w-full">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white py-8 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${activeCategory === category.id
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {/* {activeCategory === 'all'
              ? 'Popular Courses'
              : `Popular ${categories.find(c => c.id === activeCategory)?.name} Courses`} */}
          </h2>

          <Link to={"/explore"} className="text-teal-500 hover:text-teal-600 font-semibold flex items-center">
            View All <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level as CourseLevel)}`}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{formatDuration(course.duration)}</span>
                  <BookOpen className="w-4 h-4 ml-3 mr-1" />
                  <span>{course.totalChapters} chapters</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold text-sm">{course.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({course.totalRatings})</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {course.enrollmentCount.toLocaleString()}
                  </div>
                </div>

                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="text-2xl font-bold text-teal-600">₹{course.price}</span>
                  <button className="bg-gradient-to-r from-teal-400 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-teal-500 hover:to-teal-700 transition-all text-sm font-semibold">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Recommended Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Recommended for You</h2>
          <p className="text-gray-600">Personalized course suggestions based on your interests</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level as CourseLevel)}`}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{formatDuration(course.duration)}</span>
                  <BookOpen className="w-4 h-4 ml-3 mr-1" />
                  <span>{course.totalChapters} chapters</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold text-sm">{course.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({course.totalRatings})</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {course.enrollmentCount.toLocaleString()}
                  </div>
                </div>

                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="text-2xl font-bold text-teal-600">₹{course.price}</span>
                  <button className="bg-gradient-to-r from-teal-400 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-teal-500 hover:to-teal-700 transition-all text-sm font-semibold">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-white text-teal-600 border-2 border-teal-600 px-8 py-3 rounded-lg hover:bg-teal-50 transition-colors font-semibold">
            Explore More Courses
          </button>
        </div>
      </div>

      {/* Top Instructors */}
      <div className="bg-gradient-to-br from-gray-50 to-teal-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Learn from Verified Experts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Industry professionals sharing their knowledge and experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topInstructors.map((instructor) => (
              <div key={instructor.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={instructor.profilePic}
                    alt={instructor.name}
                    className="w-20 h-20 rounded-full mx-auto"
                  />

                  <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-1">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-1">{instructor.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{instructor.designation}</p>

                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {instructor.expertise.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm">
                  View Profile →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <span className="ml-2 text-xl font-bold">NlightN</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Empowering learners worldwide with quality education and expert instruction.
              </p>
              <p className="text-gray-500 text-xs">© 2024 NlightN. All rights reserved.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">Browse Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Become Instructor</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearnerHome;