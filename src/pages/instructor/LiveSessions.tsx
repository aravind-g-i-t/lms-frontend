import { 
  Users, 
  Video, 
  Settings,
  Calendar,
  Clock,
  Plus,
  Play,

} from 'lucide-react';


const InstructorLiveSessions = () => {
  const sessions = [
    { title: 'React Fundamentals - Advanced Hooks', date: '2024-09-15', time: '10:00 AM', duration: '2h', students: 23, status: 'Upcoming' },
    { title: 'JavaScript Advanced - Async Programming', date: '2024-09-15', time: '2:00 PM', duration: '1.5h', students: 18, status: 'Upcoming' },
    { title: 'Node.js Basics - Express Setup', date: '2024-09-16', time: '4:00 PM', duration: '2h', students: 15, status: 'Scheduled' },
    { title: 'Python Basics - Data Structures', date: '2024-09-14', time: '3:00 PM', duration: '1h', students: 32, status: 'Completed' }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Live Sessions</h1>
        <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Schedule Session
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sessions.map((session, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {session.date} at {session.time}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {session.duration}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {session.students} students
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  session.status === 'Upcoming' 
                    ? 'bg-orange-100 text-orange-800'
                    : session.status === 'Scheduled'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {session.status}
                </span>
                {session.status === 'Upcoming' && (
                  <button className="flex items-center px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm">
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </button>
                )}
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};


export default InstructorLiveSessions;