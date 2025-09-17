import { 
  Search,
} from 'lucide-react';

const InstructorMessages = () => {
  const conversations = [
    { name: 'Sarah Johnson', lastMessage: 'Thank you for the explanation about React hooks!', time: '2h ago', unread: 2, avatar: 'S' },
    { name: 'Mike Chen', lastMessage: 'When is the next JavaScript session?', time: '4h ago', unread: 0, avatar: 'M' },
    { name: 'Emma Davis', lastMessage: 'I completed all the assignments for this week', time: '1d ago', unread: 1, avatar: 'E' },
    { name: 'John Smith', lastMessage: 'Could you help me with the Node.js project?', time: '2d ago', unread: 3, avatar: 'J' }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="divide-y divide-gray-200">
          {conversations.map((conversation, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-semibold">{conversation.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{conversation.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500">{conversation.time}</p>
                      {conversation.unread > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-teal-600 text-white text-xs rounded-full">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InstructorMessages;