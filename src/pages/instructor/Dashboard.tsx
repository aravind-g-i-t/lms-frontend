import {
    BookOpen,
    Video,
    MessageSquare,
    Clock,
    Award,
    Users,
    TrendingUp,
    Calendar
} from 'lucide-react';
const InstructorDashboard = () => {


  const statsCards = [
        {
            title: 'Active Courses',
            value: '4',
            subtitle: 'Currently teaching',
            icon: BookOpen,
            color: 'text-blue-600'
        },
        {
            title: 'Total Students',
            value: '76',
            subtitle: 'Enrolled students',
            icon: Users,
            color: 'text-green-600'
        },
        {
            title: 'Completion Rate',
            value: '87%',
            subtitle: 'Course completion',
            icon: TrendingUp,
            color: 'text-purple-600'
        },
        {
            title: 'Upcoming Sessions',
            value: '12',
            subtitle: 'This week',
            icon: Calendar,
            color: 'text-orange-600'
        }
    ];

    const recentActivities = [
        { type: 'message', content: 'New message from Sarah Johnson', time: '2 hours ago' },
        { type: 'enrollment', content: 'Mike Chen enrolled in React Fundamentals', time: '4 hours ago' },
        { type: 'completion', content: 'Emma Davis completed JavaScript Basics', time: '6 hours ago' },
        { type: 'session', content: 'Live session scheduled for tomorrow 3 PM', time: '1 day ago' }
    ];

    const upcomingSessions = [
        { course: 'React Fundamentals', time: '10:00 AM', students: 23, date: 'Today' },
        { course: 'JavaScript Advanced', time: '2:00 PM', students: 18, date: 'Today' },
        { course: 'Node.js Basics', time: '4:00 PM', students: 15, date: 'Tomorrow' }
    ];
  return (
    <>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="text-gray-500 text-sm">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                Upcoming Live Sessions
              </h2>
              <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.course}</h3>
                      <p className="text-sm text-gray-600">{session.date} at {session.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{session.students}</p>
                    <p className="text-sm text-gray-600">students</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-500" />
                Recent Activity
              </h2>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{activity.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors">
              <BookOpen className="w-5 h-5 mr-2" />
              Create New Course
            </button>
            <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <Video className="w-5 h-5 mr-2" />
              Schedule Live Session
            </button>
            <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <MessageSquare className="w-5 h-5 mr-2" />
              Message Students
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default InstructorDashboard
