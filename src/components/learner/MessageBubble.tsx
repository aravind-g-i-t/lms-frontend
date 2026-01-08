import { Check, CheckCheck } from "lucide-react";
import type { Message } from "../../pages/learner/Messages";
import { AttachmentPreview } from "./AttachmentPreview";

export const MessageBubble: React.FC<{
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  senderName?: string;
  senderAvatar?: string;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (messageId: string) => void;


}> = ({ message, isOwn, showAvatar, senderName, senderAvatar, isSelectionMode, isSelected, onToggleSelect }) => {


  const formatMessageTime = (date: Date | string | null) => {
    if (!date) return '';

    const d = date instanceof Date ? date : new Date(date);

    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };


  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      onClick={() => {
        if (isSelectionMode) {
          onToggleSelect(message.id)
        }
      }}
      className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}
  ${isSelected ? 'bg-teal-50 ring-1 ring-teal-300 rounded-lg p-2' : ''}
`}
    >

      {isSelectionMode && (
        <input
          type="checkbox"
          checked={isSelected}
          className={`mt-2 ${isOwn ? 'ml-2' : 'mr-2'}`}
        />
      )}
      {!isOwn && (
        <div className={`flex-shrink-0`}>
          {senderAvatar ? (
            <img
              src={senderAvatar}
              alt={senderName || 'User'}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName || 'User')}&background=14B8A6&color=fff`;
              }}
            />
          ) : (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${isOwn ? 'bg-gradient-to-br from-teal-500 to-teal-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
              }`}>
              {getInitials(senderName || 'User')}
            </div>
          )}
        </div>
      )}

      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {showAvatar && !isOwn && (
          <span className="text-xs text-gray-600 mb-1 ml-1">{senderName}</span>
        )}

        <div className={`rounded-2xl px-4 py-2 ${isOwn
          ? 'bg-teal-600 text-white rounded-tr-sm'
          : 'bg-gray-100 text-gray-900 rounded-tl-sm'
          }`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

          {message.attachments.length > 0 && (
            <div className="space-y-2">
              {message.attachments.map(attachment => (
                <AttachmentPreview key={attachment.id} attachment={attachment} />
              ))}
            </div>
          )}
        </div>

        <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-gray-400">
            {formatMessageTime(message.createdAt)}
          </span>
          {isOwn && (
            <span className={message.isRead ? 'text-teal-500' : 'text-gray-400'}>
              {message.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};