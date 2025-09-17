
import { 
  Users, 
  BookOpen, 
  Award,
  Target,
  Download,
  Clock,
  CheckCircle,
  Star,
  UserPlus,
  PieChart,
  Activity
} from 'lucide-react';


const BusinessDashboard = () => {
  const companyStats = [
    { 
      title: 'Active Learners', 
      value: '245', 
      subtitle: 'Out of 280 employees',
      icon: Users,
      color: 'text-blue-600',
      change: '+12%'
    },
    { 
      title: 'Courses Completed', 
      value: '1,847', 
      subtitle: 'This month',
      icon: CheckCircle,
      color: 'text-green-600',
      change: '+28%'
    },
    { 
      title: 'Learning Hours', 
      value: '3,240', 
      subtitle: 'Total this quarter',
      icon: Clock,
      color: 'text-purple-600',
      change: '+15%'
    },
    { 
      title: 'Skills Acquired', 
      value: '156', 
      subtitle: 'New certifications',
      icon: Award,
      color: 'text-orange-600',
      change: '+22%'
    }
  ];

  const topCourses = [
    { title: 'Advanced React Development', enrolled: 45, completion: 78, rating: 4.8 },
    { title: 'Data Analytics with Python', enrolled: 38, completion: 85, rating: 4.9 },
    { title: 'Cloud Architecture Fundamentals', enrolled: 42, completion: 65, rating: 4.7 },
    { title: 'Product Management Essentials', enrolled: 29, completion: 92, rating: 4.6 }
  ];

  const departmentProgress = [
    { department: 'Engineering', members: 85, progress: 78, color: 'bg-blue-500' },
    { department: 'Marketing', members: 32, progress: 92, color: 'bg-green-500' },
    { department: 'Sales', members: 48, progress: 65, color: 'bg-purple-500' },
    { department: 'HR', members: 15, progress: 88, color: 'bg-orange-500' },
    { department: 'Design', members: 22, progress: 85, color: 'bg-pink-500' }
  ];

  const recentActivities = [
    { user: 'Sarah Johnson', action: 'completed', item: 'React Fundamentals', time: '2 hours ago' },
    { user: 'Mike Chen', action: 'enrolled in', item: 'Data Science Bootcamp', time: '4 hours ago' },
    { user: 'Engineering Team', action: 'achieved', item: '80% completion milestone', time: '1 day ago' },
    { user: 'Lisa Wang', action: 'earned', item: 'AWS Solutions Architect certification', time: '2 days ago' }
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Learning Dashboard</h2>
        <p className="text-gray-600 mt-1">Track your organization's learning progress and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {companyStats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <div className="space-y-1">
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Department Progress */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-500" />
              Department Progress
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Details
            </button>
          </div>
          <div className="space-y-4">
            {departmentProgress.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 ${dept.color} rounded-full`}></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                    <p className="text-sm text-gray-600">{dept.members} members</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${dept.color} h-2 rounded-full`}
                      style={{ width: `${dept.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">{dept.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              Recent Activity
            </h3>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
            Most Popular Courses
          </h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Courses
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topCourses.map((course, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900 text-sm">{course.title}</h4>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                  {course.rating}
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600 mb-3">
                <span>{course.enrolled} enrolled</span>
                <span>{course.completion}% completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${course.completion}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <UserPlus className="w-5 h-5 mr-2" />
            Add Team Members
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <BookOpen className="w-5 h-5 mr-2" />
            Browse Courses
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Target className="w-5 h-5 mr-2" />
            Create Learning Path
          </button>
          <button className="flex items-center justify-center p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
            <Download className="w-5 h-5 mr-2" />
            Export Reports
          </button>
        </div>
      </div>
    </>
  );
};

export default BusinessDashboard;