import type { Conversation } from "../../pages/learner/Messages";

export const ConversationListItem: React.FC<{
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}> = ({ conversation, isActive, onClick }) => {

  const formatTimeAgo = (date: Date | string | null) => {
    if (!date) return '';

    const d = date instanceof Date ? date : new Date(date);
    const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 172800) return 'Yesterday';

    return d.toLocaleDateString();
  };


  // const getCourseColor = (courseId: string) => {
  //   const colors = ['#14B8A6', '#0D9488', '#0F766E', '#115E59', '#134E4A'];
  //   const index = courseId.charCodeAt(courseId.length - 1) % colors.length;
  //   return colors[index];
  // };


  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer border-l-4 transition-colors ${isActive
        ? 'bg-teal-50 border-teal-500'
        : 'border-transparent hover:bg-gray-50'
        }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={conversation.instructor.profilePic}
            alt={conversation.instructor.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.instructor.name)}&background=14B8A6&color=fff`;
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{conversation.instructor.name}</h3>
            </div>
            {conversation.learnerUnreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-teal-500 text-white text-xs font-bold rounded-full flex-shrink-0">
                {conversation.learnerUnreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-1">
            {conversation.isOnline && (<span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: '#14B8A6' }}
            ></span>)}
            <span className="text-xs text-gray-600 truncate">{conversation.course.name}</span>
          </div>

          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessageContent || 'No messages yet'}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {formatTimeAgo(conversation.lastMessageAt)}
          </p>
        </div>
      </div>
    </div>
  );
};