import { 
  Users, 
  Plus,
  Edit,
  Star,
  BarChart3,

} from 'lucide-react';


const InstructorCourses = () => {
  const courses = [
    { 
      title: 'React Fundamentals', 
      students: 23, 
      rating: 4.8, 
      status: 'Active',
      progress: 75,
      revenue: 1250
    },
    { 
      title: 'JavaScript Advanced', 
      students: 18, 
      rating: 4.9, 
      status: 'Active',
      progress: 60,
      revenue: 980
    },
    { 
      title: 'Node.js Basics', 
      students: 15, 
      rating: 4.7, 
      status: 'Draft',
      progress: 30,
      revenue: 750
    },
    { 
      title: 'Python for Beginners', 
      students: 32, 
      rating: 4.6, 
      status: 'Active',
      progress: 90,
      revenue: 1600
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.students} students
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {course.rating}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                course.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {course.status}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-900 font-medium">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Revenue</span>
              <span className="text-lg font-semibold text-gray-900">${course.revenue}</span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InstructorCourses;