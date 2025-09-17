import { useState } from 'react';
import { Search, ShoppingCart, Bell, User, Star, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { logout } from '../../redux/services/userAuthServices';
import toast from 'react-hot-toast';
import { clearLearner } from '../../redux/slices/learnerSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Home = () => {

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [currentSlide, setCurrentSlide] = useState(0);

  const tutors = [
    {
      name: "Theresa Webb",
      role: "Advanced Support Analyst",
      image: "/api/placeholder/60/60",
      rating: 4.9,
      reviews: 28,
      description: "Explore the benefits of algorithms, React, and a proven code structure."
    },
    {
      name: "Courtney Henry",
      role: "UI/UX Designer",
      image: "/api/placeholder/60/60",
      rating: 4.8,
      reviews: 32,
      description: "Latest engineering methods and tools, and exceptional techniques."
    },
    {
      name: "Albert Flores",
      role: "Senior UI Designer",
      image: "/api/placeholder/60/60",
      rating: 4.9,
      reviews: 45,
      description: "Delve deeper into Python and SQL basics."
    },
    {
      name: "Marvin McKinney",
      role: "Senior Software Engineer",
      image: "/api/placeholder/60/60",
      rating: 5.0,
      reviews: 67,
      description: "Explore JavaScript and the basics, challenges, and tools."
    }
  ];

  const courses = [
    {
      title: "Figma UI UX Design...",
      instructor: "Vako Shvili",
      instructorImage: "/api/placeholder/40/40",
      price: "₹3000",
      rating: 4.8,
      image: "/api/placeholder/300/200",
      tag: "DESIGN",
      description: "Use Figma to get a Job in Design. User Interface, User Experience design..."
    },
    {
      title: "Computer Science For...",
      instructor: "Jenny Wilson",
      instructorImage: "/api/placeholder/40/40",
      price: "₹3000",
      rating: 4.9,
      image: "/api/placeholder/300/200",
      tag: "CODE",
      description: "Design Web Sites and Mobile Apps that Your Users Love and Return to Again..."
    },
    {
      title: "JavaScript: Understanding...",
      instructor: "Esther Howard",
      instructorImage: "/api/placeholder/40/40",
      price: "₹3000",
      rating: 4.7,
      image: "/api/placeholder/300/200",
      tag: "DEVELOPMENT",
      description: "The Advanced JavaScript course for Everyone. Specific. JavaScript..."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % courses.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + courses.length) % courses.length);
  };



  const handleLogout = async () => {
    try {
      const response = await dispatch(logout()).unwrap();

      if (response.success) {
        toast.success("Logged out successfully");
        dispatch(clearLearner());
        navigate("/signin");
      } else {
        toast.error(response?.message || "Failed to log out from server");
        dispatch(clearLearner());
        navigate("/signin");
      }
    } catch (error: unknown) {
      let message = "Network error. Logging out locally.";
      console.error("Logout error:", error);

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      dispatch(clearLearner());
      navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">NlightN</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/learner/home"
                className="text-green-700 hover:text-gray-900 px-3 py-2"
              >
                Home
              </Link>
              <Link
                to="/learner/dashboard"
                className="text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                Dashboard
              </Link>
              <Link to="#" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                Explore
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Want to learn?"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer" />
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />

              {/* Profile Unit */}
              <Link
                to="/learner/profile"
                className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">Aravind</span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Welcome Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-teal-400 to-red-500 rounded-2xl overflow-hidden">
          <div className="flex">
            <div className="flex-1 p-8 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, Aravind</h1>
              <h2 className="text-4xl font-bold mb-4">Learn something new everyday.</h2>
              <p className="text-lg mb-6 opacity-90">
                Become professional and ready to join the world
              </p>
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Explore UI/UX
              </button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-l from-red-600 to-transparent"></div>
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-lg p-3 text-white">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                  <div>
                    <p className="text-sm font-semibold">Konnor Design's</p>
                    <p className="text-xs">UX/UX Course</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Tutors Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our popular tutors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            On Weekend UK, Instructors from all over the world instruct millions of students.
            We offer the knowledge and abilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((tutor, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3"
                />
                <h3 className="font-semibold text-gray-900 mb-1">{tutor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{tutor.role}</p>
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{tutor.rating}</span>
                  <span className="text-sm text-gray-500">({tutor.reviews})</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">{tutor.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
          </div>

          <blockquote className="text-2xl font-medium text-gray-900 mb-8">
            NlightN helped me transition into tech with structured courses and amazing mentor support. I landed my dream job within 3 months of completing my certification.
          </blockquote>

          <div className="flex items-center justify-center">
            <img
              src="/api/placeholder/60/60"
              alt="Jacob Jones"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold text-gray-900">Jacob Jones</p>
              <p className="text-sm text-gray-600">Senior Software Developer</p>
            </div>
          </div>
        </div>
      </div>

      {/* What to learn next Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-2">For you</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">What to learn next</h2>
          <p className="text-gray-600">Suggested courses based on your recent activity</p>
        </div>

        <div className="relative">
          <div className="flex space-x-6 overflow-hidden">
            {courses.map((course, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-80 bg-white rounded-xl shadow-sm overflow-hidden transition-transform duration-300 ${index === currentSlide ? 'transform scale-105' : ''
                  }`}
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white px-2 py-1 rounded text-xs font-semibold">
                      {course.tag}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Play className="w-8 h-8 text-white bg-black bg-opacity-50 rounded-full p-2 cursor-pointer" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{course.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={course.instructorImage}
                        alt={course.instructor}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-700">{course.instructor}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-teal-500">{course.price}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{course.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="text-center mt-8">
          <button className="bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600">
            View more
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="ml-2 text-xl font-bold">NlightN</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Top-quality online educational Online Alok was found all over the world.
              </p>
              <p className="text-gray-500 text-xs">© 2024 by Orix. All rights reserved.</p>
            </div>

            {/* Links columns */}
            <div>
              <h4 className="font-semibold mb-4">Overview</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">Business</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Categories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">General</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">About us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Events</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Terms</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;