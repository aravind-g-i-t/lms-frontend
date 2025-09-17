
import  { useState } from 'react';
import { 
  Users, 
  Search,
  Filter,
  Play,
  Clock,
  Star,
  Eye,
} from 'lucide-react';


const CourseCatalogPage = () => {
  const categories = ['All', 'Technology', 'Business', 'Design', 'Marketing', 'Leadership'];
  const [activeCategory, setActiveCategory] = useState('All');

  const courses = [
    { 
      title: 'Advanced React Development', 
      instructor: 'John Anderson', 
      rating: 4.8, 
      enrolled: 45, 
      duration: '12 hours',
      category: 'Technology',
      level: 'Advanced',
      price: 'Included'
    },
    { 
      title: 'Data Analytics with Python', 
      instructor: 'Sarah Chen', 
      rating: 4.9, 
      enrolled: 38, 
      duration: '16 hours',
      category: 'Technology',
      level: 'Intermediate',
      price: 'Included'
    },
    { 
      title: 'Product Management Essentials', 
      instructor: 'Mike Johnson', 
      rating: 4.6, 
      enrolled: 29, 
      duration: '8 hours',
      category: 'Business',
      level: 'Beginner',
      price: 'Included'
    },
    { 
      title: 'UI/UX Design Fundamentals', 
      instructor: 'Emma Wilson', 
      rating: 4.7, 
      enrolled: 33, 
      duration: '10 hours',
      category: 'Design',
      level: 'Beginner',
      price: 'Included'
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {course.rating}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.enrolled}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {course.category}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                  {course.level}
                </span>
              </div>
              <span className="text-sm font-semibold text-green-600">{course.price}</span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Play className="w-4 h-4 mr-1" />
                Assign to Team
              </button>
              <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};


export default CourseCatalogPage