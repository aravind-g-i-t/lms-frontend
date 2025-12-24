import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, Paperclip, ArrowLeft, User, BookOpen, Phone, Video } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { MessageBubble } from '../../components/learner/MessageBubble';
import { ConversationListItem } from '../../components/learner/ConversationList';
import LearnerNav from '../../components/learner/LearnerNav';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLearnerConversations, getLearnerMessages } from '../../services/learnerServices';
import { toast } from 'react-toastify';
import { useSocket } from '../../hooks/useChat';
import { VideoCallModal } from '../../components/shared/VideoCall';

export interface Conversation {
  id: string | null;
  course: {
    name: string;
    id: string;
  };
  instructor: {
    name: string;
    id: string;
    profilePic: string;
  };
  lastMessageContent: string | null;
  lastMessageAt: Date | null;
  learnerUnreadCount: number;
  isOnline: boolean
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  attachments: Attachment[];
  createdAt: Date;
  isRead: boolean;
  readAt: Date | null;
}






const getMessageDateLabel = (date: Date | string) => {
  const messageDate = date instanceof Date ? date : new Date(date);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) return 'Today';
  if (messageDate.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return messageDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};




const getCourseColor = (courseId: string) => {
  const colors = ['#14B8A6', '#0D9488', '#0F766E', '#115E59', '#134E4A'];
  const index = courseId.charCodeAt(courseId.length - 1) % colors.length;
  return colors[index];
};





const LearnerMessagesPage = () => {
  const { state } = useLocation();
  const courseId = state?.courseId;
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { id,name } = useSelector((state: RootState) => state.learner);
  const socket = useSocket(id, "learner")

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [incomingCall, setIncomingCall] = useState<{
    conversationId: string;
    callerId: string;
    callerRole: "learner" | "instructor";
  } | null>(null);
  const [activeCall, setActiveCall] = useState<{
    roomId: string;
  } | null>(null);

  const isInitialLoadRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const fetchConverations = async () => {
      try {
        const result = await dispatch(getLearnerConversations({ courseId })).unwrap();
        const convs: Conversation[] = result.conversations;
        console.log(result);

        setConversations(convs);

        if (courseId) {
          const conv = convs.find(c => c.course.id === courseId);

          if (conv) {
            setActiveConversation(conv);
            setShowMobileChat(true);
            setMessages(result.messages); // Set messages from initial fetch
            setHasMoreMessages(true);
            isInitialLoadRef.current = true; // Mark as initial load
            navigate(location.pathname, { replace: true, state: null });
          }
        }
      } catch (error) {
        toast.error(error as string);
      }
    };
    fetchConverations();
  }, [courseId, dispatch, navigate]);


  useEffect(() => {
    if (!socket || !activeConversation?.id) return;

    socket.emit("joinChat", activeConversation.id);
    console.log("joinChat", activeConversation.id);

    return () => {
      socket.emit("leaveChat", activeConversation.id);
      console.log("leaveChat", activeConversation.id);
    };
  }, [socket, activeConversation?.id]);







  useEffect(() => {
    if (!socket || !activeConversation?.id) return;

    console.log("emitting markMessagesRead");

    socket?.emit("markMessagesRead", {
      conversationId: activeConversation.id
    })
  }, [socket, activeConversation?.id, messages.length]);


  useEffect(() => {
    if (!socket) return;

    const handler = (data: { message: Message, conversationId: string }) => {
      if (data.conversationId !== activeConversation?.id) return;

      setMessages(prev => {
        if (prev.some(m => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
    };

    socket.on("receiveMessage", handler);

    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [socket, activeConversation?.id]);


  useEffect(() => {
    if (!socket) return;

    const handler = (data: { conversation: Conversation }) => {
      setConversations(prev => {
        const index = prev.findIndex(
          c => c.id === data.conversation.id
        );
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            ...data.conversation,
          };
          return [updated[index], ...updated.filter((_, i) => i !== index)];
        }
        return [data.conversation, ...prev];
      });
    };

    socket.on("conversationUpdated", handler);

    return () => {
      socket.off("conversationUpdated", handler);
    };
  }, [socket]);


  useEffect(() => {
    if (!socket) return;

    const handleInstructorStatus = (data: {
      instructorId: string;
      isOnline: boolean;
    }) => {
      setConversations(prev =>
        prev.map(conv =>
          conv.instructor.id === data.instructorId
            ? {
              ...conv,
              isOnline: data.isOnline
            }
            : conv
        )
      );
    };



    socket.on("instructorStatusChanged", handleInstructorStatus);

    return () => {
      socket.off("instructorStatusChanged", handleInstructorStatus);
    };
  }, [socket]);



  useEffect(() => {
    if (!socket) return;

    const handler = (data: {
      conversationId: string;
      readerId: string;
      readAt: Date;
    }) => {
      if (data.conversationId === activeConversation?.id) {

        console.log("message read status updated");

        setMessages(prev =>
          prev.map(msg =>
            msg.senderId !== data.readerId && !msg.isRead
              ? { ...msg, isRead: true, readAt: data.readAt }
              : msg
          )
        );

        setActiveConversation(c => c ? { ...c, learnerUnreadCount: 0 } : c)

      }
      setConversations(prev =>
        prev.map(c =>
          c.id === data.conversationId
            ? { ...c, learnerUnreadCount: 0 }
            : c
        )
      );
    };

    socket.on("messagesRead", handler);

    return () => {
      socket.off("messagesRead", handler);
    };
  }, [socket, activeConversation?.id, messages.length]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const onScroll = async () => {
      if (
        container.scrollTop === 0 &&
        hasMoreMessages &&
        activeConversation?.id
      ) {
        const prevScrollHeight = container.scrollHeight;

        const offset = messages.length;

        const result = await dispatch(
          getLearnerMessages({
            conversationId: activeConversation.id,
            offset,
            limit: 20
          })
        ).unwrap();

        setMessages(prev => [...result.messages, ...prev]);
        setHasMoreMessages(result.hasMore);

        requestAnimationFrame(() => {
          container.scrollTop =
            container.scrollHeight - prevScrollHeight;
        });
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [hasMoreMessages, activeConversation?.id, dispatch, messages.length]);

  useEffect(() => {
    if (!socket) return;

    const handler = (data: {
      conversationId: string;
      callerId: string;
      callerRole: "learner" | "instructor";
    }) => {
      setIncomingCall(data);
    };

    socket.on("incomingVideoCall", handler);

    return () => {
      socket.off("incomingVideoCall", handler);
    };
  }, [socket]);


  useEffect(() => {
    if (!socket) return;

    socket.on("videoCallAccepted", ({ conversationId }) => {
      setActiveCall({ roomId: conversationId })
    });

    socket.on("videoCallRejected", () => {
      toast.info("Call rejected");
    });

    return () => {
      socket.off("videoCallAccepted");
      socket.off("videoCallRejected");
    };
  }, [socket]);


  const acceptCall = () => {
    if (!socket || !incomingCall) return;

    socket.emit("acceptVideoCall", {
      conversationId: incomingCall.conversationId,
      callerId: incomingCall.callerId,
    });

    setActiveCall({ roomId: incomingCall.conversationId });
    setIncomingCall(null);
  };


  const rejectCall = () => {
    if (!incomingCall || !socket) return;

    socket.emit("rejectVideoCall", {
      callerId: incomingCall.callerId,
    });

    setIncomingCall(null);
  };





  const sendMessage = () => {
    if (!socket || !messageInput.trim()) return;
    console.log("sendmsg", activeConversation);

    socket.emit('sendMessage', {
      receiverId: activeConversation?.instructor.id,
      conversationId: activeConversation?.id,
      message: {
        content: messageInput.trim(),
        attachments: [],
      },
      courseId: activeConversation?.course.id
    },
      (response: { success: boolean, message: Message, error?: string, conversationId: string }) => {
        console.log(response);

        if (response.success) {
          console.log("Message delivered");
          setMessages(prev => [...prev, response.message]);
          setMessageInput('');
          if (activeConversation && !activeConversation.id) {
            setActiveConversation({ ...activeConversation, id: response.conversationId });
            console.log("resp.convId", response.conversationId);
            setConversations(prev =>
              prev.map(c =>
                c.id === null
                  ? { ...c, id: response.conversationId }
                  : c
              )
            );
          }
        } else {
          console.log("Message failed", response.error);
        }
      }
    );
    console.log("activeConv", activeConversation);

  };




  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVideoCall = () => {
    if (!socket || !activeConversation?.id) return;

    socket.emit("startVideoCall", {
      receiverId: activeConversation.instructor.id,
      conversationId: activeConversation.id,
    });

    setActiveCall({ roomId: activeConversation.id });

  };

  const handleSelectConversation = async (conv: Conversation) => {
    // If this is being called right after initial load for the same conversation, skip
    if (isInitialLoadRef.current && activeConversation?.id === conv.id) {
      isInitialLoadRef.current = false;
      return;
    }

    isInitialLoadRef.current = false;
    setActiveConversation(conv);
    setShowMobileChat(true);
    setMessages([]);
    setHasMoreMessages(true);

    if (conv.id) {
      const result = await dispatch(getLearnerMessages({
        conversationId: conv.id
      })).unwrap();
      setMessages(result.messages);
      setHasMoreMessages(result.hasMore);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchQuery === '' ||
      conv.course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterTab === 'all' || (filterTab === 'unread' && conv.learnerUnreadCount > 0);

    return matchesSearch && matchesFilter;
  });

  const groupedConversations = filteredConversations.reduce((acc, conv) => {
    if (!acc[conv.course.id]) {
      acc[conv.course.id] = {
        courseName: conv.course.name,
        courseColor: getCourseColor(conv.course.id),
        conversations: []
      };
    }
    acc[conv.course.id].conversations.push(conv);
    return acc;
  }, {} as Record<string, { courseName: string; courseColor: string; conversations: Conversation[] }>);

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.learnerUnreadCount, 0);

  const renderMessageGroups = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';

    messages.forEach(message => {
      const messageDate = getMessageDateLabel(message.createdAt);
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: messageDate, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups.map((group, groupIdx) => (
      <div key={groupIdx}>
        <div className="flex justify-center my-4">
          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
            {group.date}
          </span>
        </div>
        {group.messages.map((message, idx) => {
          const isOwn = message.senderId === id;
          const prevMessage = idx > 0 ? group.messages[idx - 1] : null;
          const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={isOwn}
              showAvatar={showAvatar}
              senderName={activeConversation?.instructor.name}
              senderAvatar={isOwn ? undefined : activeConversation?.instructor.profilePic}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <>
      <LearnerNav />
      <div className="flex h-screen bg-gray-50">
        <div className={`w-full md:w-96 bg-white border-r border-gray-200 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 bg-teal-500 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Messages</h1>
              {totalUnread > 0 && (
                <span className="bg-white text-teal-600 text-xs font-bold px-2 py-1 rounded-full">
                  {totalUnread}
                </span>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-200" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-teal-400 rounded-lg bg-teal-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>

          <div className="flex gap-2 p-4 bg-white border-b border-gray-200">
            <button
              onClick={() => setFilterTab('all')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterTab === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTab('unread')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterTab === 'unread'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Unread {totalUnread > 0 && `(${totalUnread})`}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {Object.entries(groupedConversations).map(([courseId, group]) => (
              <div key={courseId}>

                {/* <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: group.courseColor }}
                  ></div>
                  <span className="text-sm font-semibold text-gray-700">{group.courseName}</span>
                </div>
              </div> */}
                {group.conversations.map(conv => (
                  <ConversationListItem
                    key={conv.id}
                    conversation={conv}
                    isActive={activeConversation?.id === conv.id}
                    onClick={() => handleSelectConversation(conv)}
                  />
                ))}
              </div>
            ))}

            {filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations found</h3>
                <p className="text-sm text-gray-500">
                  {searchQuery ? 'Try adjusting your search' : 'Your messages will appear here'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col bg-white ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ArrowLeft size={20} />
                    </button>

                    <img
                      src={activeConversation.instructor.profilePic}
                      alt={activeConversation.instructor.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.instructor.name)}&background=14B8A6&color=fff`;
                      }}
                    />

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {activeConversation.instructor.name}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{activeConversation.course.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Audio Call"
                    >
                      <Phone className="w-5 h-5 text-teal-600" />
                    </button>

                    <button
                      onClick={handleVideoCall}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Video Call"
                    >
                      <Video className="w-5 h-5 text-teal-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Profile">
                      <User size={20} className="text-gray-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Go to Course">
                      <BookOpen size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="More">
                      <MoreVertical size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-teal-900">
                    <BookOpen size={16} />
                    <span>Course: <strong>{activeConversation.course.name}</strong></span>
                  </div>
                  <button
                    onClick={() => navigate(`/learner/courses/${activeConversation.course.id}/learn`)}
                    className="text-teal-600 hover:text-teal-700 font-medium text-sm">
                    Go to Course
                  </button>
                </div>
              </div>

              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                {renderMessageGroups()}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                    <Paperclip size={20} className="text-gray-600" />
                  </button>
                  {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                    <Smile size={20} className="text-gray-600" />
                  </button> */}
                  <div></div>

                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      style={{ minHeight: '40px', maxHeight: '120px' }}
                    />
                  </div>

                  <button
                    onClick={sendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-teal-50/30 to-white">
              <div className="text-8xl mb-4">💬</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Learning!</h2>
              <p className="text-gray-500 max-w-md">
                Select a conversation to chat with your instructors about your courses.
              </p>
            </div>
          )}
        </div>
        {incomingCall && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-80">
              <h2 className="text-lg font-semibold mb-2">Incoming Video Call</h2>
              <p className="text-sm text-gray-600 mb-4">
                From {incomingCall.callerRole}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={acceptCall}
                  className="flex-1 bg-teal-600 text-white py-2 rounded-lg"
                >
                  Accept
                </button>
                <button
                  onClick={rejectCall}
                  className="flex-1 bg-gray-200 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
        {activeCall && (
          <VideoCallModal
            open={true}
            roomId={activeCall.roomId}
            userId={id as string}
            userName={name as string}
            role="learner"
            onClose={() => setActiveCall(null)}
          />
        )}

      </div>
    </>
  );
};

export default LearnerMessagesPage;