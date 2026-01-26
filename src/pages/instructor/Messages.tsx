import { useEffect, useRef, useState } from 'react';
import { Search, Send, Paperclip, ChevronLeft, ChevronRight, BookOpen, Users, ArrowLeft, CheckCheck, Check, SquareCheckBigIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { deleteInstructorMessages, getInstructorConversations, getInstructorMessages } from '../../services/instructorServices';
import { Video, Phone } from "lucide-react";
import { useSocket } from '../../hooks/useSocket';
import { uploadAttachmentToS3 } from '../../config/s3Config';
import { AttachmentPreview } from '../../components/learner/AttachmentPreview';
import { DeleteMessageModal } from '../../components/shared/DeleteMessageModal';



export interface Conversation {
  id: string | null;
  course: {
    name: string;
    id: string;
  };
  learner: {
    name: string;
    id: string;
    profilePic: string;
  };
  lastMessageContent: string | null;
  lastMessageAt: Date | null;
  instructorUnreadCount: number;
  isOnline: boolean;
}

interface Attachment {
  id: string | null;
  fileName: string;
  fileUrl: string | null;
  fileType: string;
  fileSize: number;
}

interface StoredAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

type AttachmentDraft = {
  file: File;
  fileUrl: string;
  fileType: string;
  fileName: string;
  fileSize: number
};


export interface Message {
  id: string;
  senderId: string;
  content: string;
  attachments: StoredAttachment[];
  createdAt: Date;
  isRead: boolean;
  readAt: Date | null;
  isDeletedForEveryone: boolean;
}

interface Course {
  title: string;
  id: string;
}



const InstructorMessagesPage = () => {
  const { state } = useLocation();
  const learnerId = state?.learnerId;
  const courseId = state?.courseId;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.chat);
  const socket = useSocket();



  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [courses, setCourses] = useState<Course[]>([])
  const [messageInput, setMessageInput] = useState("");
  // const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
  const [search, setSearch] = useState("")
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // const [incomingCall, setIncomingCall] = useState<{
  //   conversationId: string;
  //   callerId: string;
  //   callerRole: "learner" | "instructor";
  // } | null>(null);

  // const [activeCall, setActiveCall] = useState<{
  //   roomId: string;
  // } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachmentDrafts, setAttachmentDrafts] = useState<AttachmentDraft[]>([]);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const DELETE_WINDOW_MS = 10 * 60 * 1000;








  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);


  useEffect(() => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages]);

  const conversationsPerPage = 5;

  const canDeleteForEveryone =
    selectedMessageIds.length > 0 &&
    selectedMessageIds.every(messageId => {
      const msg = messages.find(m => m.id === messageId);
      if (!msg) return false;

      const isOwnMessage = msg.senderId === id;
      const isWithinTimeWindow =
        Date.now() - new Date(msg.createdAt).getTime() <= DELETE_WINDOW_MS;

      return isOwnMessage && isWithinTimeWindow;
    });




  useEffect(() => {
    const fetchConverations = async () => {
      try {

        const result = await dispatch(getInstructorConversations({
          courseId,
          learnerId,
          limit: conversationsPerPage,
          page: currentPage,
          search: search.trim() || undefined,
          selectedCourse: selectedCourse === "all" ? undefined : selectedCourse
        })).unwrap();
        console.log(result);

        const convs: Conversation[] = result.data.conversations;
        setConversations(convs);
        setMessages(result.data.messages);
        setCourses(result.data.courses);
        setTotalPages(result.data.totalPages)

        if (courseId) {
          const conv = convs.find(c => c.course.id === courseId && c.learner.id === learnerId);

          if (conv) {
            setActiveConversation(conv);
            setShowMobileChat(true);
            navigate(location.pathname, { replace: true, state: null });
          }
        }
      } catch (error) {
        toast.error(error as string)
      }
    }
    fetchConverations()


  }, [courseId, learnerId, currentPage, dispatch, navigate, search, selectedCourse]);

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
  }, [socket, activeConversation?.id]);



  useEffect(() => {
    if (!socket) return;

    const handler = (data: { message: Message, conversationId: string }) => {
      if (data.conversationId !== activeConversation?.id) return;

      setMessages(prev => {
        if (prev.some(m => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
      socket.emit("markMessagesRead", {
        conversationId: activeConversation.id
      })
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
    console.log("learnerStatus changed");


    const handleLearnerStatus = (data: {
      learnerId: string;
      isOnline: boolean;
    }) => {
      console.log("learnerStatus changed");
      setConversations(prev =>
        prev.map(conv =>
          conv.learner.id === data.learnerId
            ? {
              ...conv,
              isOnline: data.isOnline
            }
            : conv
        )
      );
    };

    socket.on("learnerStatusChanged", handleLearnerStatus);

    return () => {
      socket.off("learnerStatusChanged", handleLearnerStatus);
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


        setMessages(prev =>
          prev.map(msg =>
            msg.senderId !== data.readerId && !msg.isRead
              ? { ...msg, isRead: true, readAt: data.readAt }
              : msg
          )
        );

        setActiveConversation(c => c ? { ...c, instructorUnreadCount: 0 } : c)

      }
      setConversations(prev =>
        prev.map(c =>
          c.id === data.conversationId
            ? { ...c, instructorUnreadCount: 0 }
            : c
        )
      );
    };

    socket.on("messagesRead", handler);

    return () => {
      socket.off("messagesRead", handler);
    };
  }, [socket, activeConversation?.id, id]);




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
          getInstructorMessages({
            conversationId: activeConversation.id,
            offset,
            limit: 20
          })
        ).unwrap();




        setMessages(prev => [...result.data.messages, ...prev]);
        setHasMoreMessages(result.data.hasMore);

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
      userId: string;
      isTyping: boolean;
    }) => {
      // ignore your own typing
      if (data.userId === id) return;

      setIsTyping(data.isTyping);
    };

    socket.on("userTyping", handler);

    return () => {
      socket.off("userTyping", handler);
    };
  }, [socket, id]);



  useEffect(() => {
    if (!socket) return;

    const handleMessageDeleted = ({ messageIds }: { messageIds: string[] }) => {
      setMessages(prev =>
        prev.map(m =>
          messageIds.includes(m.id)
            ? {
              ...m,
              content: "",
              attachments: [],
              isDeletedForEveryone: true,
            }
            : m
        )
      );
    };

    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket]);


  const handleSendMessage = async () => {
    if (!socket || !messageInput.trim() && attachmentDrafts.length === 0) return;
    socket.emit("typing", {
      conversationId: activeConversation?.id,
      isTyping: false
    });

    const attachments: Attachment[] = await Promise.all(
      attachmentDrafts.map(async (draft) => {
        const key = await uploadAttachmentToS3(draft.file);

        return {
          id: null,
          fileName: draft.fileName,
          fileSize: draft.fileSize,
          fileType: draft.fileType,
          fileUrl: key
        };
      })
    );



    socket.emit('sendMessage', {
      receiverId: activeConversation?.learner.id,
      conversationId: activeConversation?.id,
      message: {
        content: messageInput.trim(),
        attachments,
      },
      courseId: activeConversation?.course.id
    },
      (response: { success: boolean, message: Message, error?: string, conversationId: string }) => {
        console.log(response);

        if (response.success) {
          console.log("Message delivered");
          setMessages(prev => [...prev, response.message]);
          setMessageInput('');
          setAttachmentDrafts([]);
          if (activeConversation && !activeConversation.id) {
            setActiveConversation({ ...activeConversation, id: response.conversationId });
            console.log("resp.convId", response.conversationId);
            setConversations(prev =>
              prev.map(c =>
                c.course.id === activeConversation.course.id &&
                  c.learner.id === activeConversation.learner.id
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

  const handleTyping = (value: string) => {
    setMessageInput(value);

    if (!socket || !activeConversation?.id) return;

    socket.emit("typing", {
      conversationId: activeConversation.id,
      isTyping: true
    });

    // clear old timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        conversationId: activeConversation.id,
        isTyping: false
      });
    }, 1500);
  };

  const handleDeleteForMe = async () => {
    await dispatch(deleteInstructorMessages({
      messageIds: selectedMessageIds,
      scope: "ME"
    })).unwrap()
    console.log("Delete for me:", selectedMessageIds);

    setMessages(prev =>
      prev.filter(m => !selectedMessageIds.includes(m.id))
    );


    setSelectedMessageIds([]);
    setIsSelectionMode(false);
    setShowDeleteModal(false);
  };

  const handleDeleteForEveryone = async () => {
    await dispatch(deleteInstructorMessages({
      messageIds: selectedMessageIds,
      scope: "EVERYONE"
    })).unwrap()
    console.log("Delete for everyone:", selectedMessageIds);

    setMessages(prev =>
      prev.map(m =>
        selectedMessageIds.includes(m.id)
          ? { ...m, content: "", attachments: [], isDeletedForEveryone: true }
          : m
      )
    );
    socket?.emit("deleteMessage", {
      conversationId: activeConversation?.id,
      messageIds: selectedMessageIds
    })

    setSelectedMessageIds([]);
    setIsSelectionMode(false);
    setShowDeleteModal(false);
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setActiveConversation(null);
    setShowMobileChat(false);
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setCurrentPage(1);
    setActiveConversation(null);
    setShowMobileChat(false);
  };

  const handleSelectConversation = async (conv: Conversation) => {
    setActiveConversation(conv);
    setMessages([])
    setHasMoreMessages(true)
    setShowMobileChat(true);
    if (conv.id) {
      const result = await dispatch(getInstructorMessages({
        conversationId: conv.id
      })).unwrap();
      console.log("messages:", result);
      setMessages(result.data.messages);
      setHasMoreMessages(result.data.hasMore)

    }
  };

  const handleVideoCall = () => {
    if (!socket || !activeConversation?.id) return;

    socket.emit("startCall", {
      receiverId: activeConversation.learner.id,
      conversationId: activeConversation.id,
      type: "video"
    });
  };

  const handleAudioCall = () => {
    if (!socket || !activeConversation?.id) return;

    socket.emit("startCall", {
      receiverId: activeConversation.learner.id,
      conversationId: activeConversation.id,
      type: "audio"
    });


  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const drafts: AttachmentDraft[] = Array.from(files).map(file => ({
      file,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size
    }));

    setAttachmentDrafts(prev => [...prev, ...drafts]);
  };


  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessageIds(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  // const handleDeleteSelectedMessages = () => {
  //   console.log("Delete:", selectedMessageIds);

  //   // later:
  //   // socket.emit("deleteMessages", { messageIds: selectedMessageIds })

  //   setSelectedMessageIds([]);
  //   setIsSelectionMode(false);
  // };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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



  const renderMessageGroups = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    if (!activeConversation) {
      return
    }

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
        {group.messages.map((msg) => {
          const isSelected = selectedMessageIds.includes(msg.id)
          const isOwn = msg.senderId === id;


          if (msg.isDeletedForEveryone) {

            return (
              <div
                key={msg.id}
                className={`flex gap-3 mb-4 ${isOwn ? "flex-row-reverse" : "flex-row"
                  }`}
              >
                <div
                  className={`flex flex-col max-w-[70%] ${isOwn ? "items-end" : "items-start"
                    }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 italic text-sm ${isOwn
                      ? "bg-teal-100 text-teal-700 rounded-tr-sm"
                      : "bg-gray-100 text-gray-500 rounded-tl-sm"
                      }`}
                  >
                    {isOwn
                      ? "You deleted this message"
                      : "This message was deleted"}
                  </div>

                  <div
                    className={`text-xs text-gray-400 mt-1 ${isOwn ? "text-right" : "text-left"
                      }`}
                  >
                    {formatMessageTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            );
          }


          return (
            <div
              onClick={() => {
                if (isSelectionMode) {
                  toggleMessageSelection(msg.id)
                }
              }}
              className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'} ${isSelected ? 'bg-teal-50 ring-1 ring-teal-300 rounded-lg p-2' : ''}`}>
              {isSelectionMode && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  className={`mt-2 ${isOwn ? 'ml-2' : 'mr-2'}`}
                />
              )}
              {!isOwn && (
                <div className={`flex-shrink-0 `}>
                  {activeConversation.learner.profilePic ? (
                    <img
                      src={activeConversation.learner.profilePic}
                      alt={activeConversation.learner.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.learner.profilePic || 'User')}&background=14B8A6&color=fff`;
                      }}
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${isOwn ? 'bg-gradient-to-br from-teal-500 to-teal-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}>
                      {getInitials(activeConversation.learner.name || 'User')}
                    </div>
                  )}
                </div>
              )}

              <div
                className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                {activeConversation.learner.profilePic && !isOwn && (
                  <span className="text-xs text-gray-600 mb-1 ml-1">{activeConversation.learner.name}</span>
                )}

                <div className={`rounded-2xl px-4 py-2 ${isOwn
                  ? 'bg-teal-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                  }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>

                  {msg.attachments.length > 0 && (
                    <div className="space-y-2">
                      {msg.attachments.map((attachment) => (
                        <AttachmentPreview key={attachment.id} attachment={attachment} />
                      ))}
                    </div>
                  )}
                </div>

                <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-xs text-gray-400">
                    {formatMessageTime(msg.createdAt)}
                  </span>
                  {isOwn && (
                    <span className={msg.isRead ? 'text-teal-500' : 'text-gray-400'}>
                      {msg.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Sidebar */}
      <div className={`w-full md:w-96 bg-white border-r border-gray-200 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="bg-teal-600 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-white">Messages</h1>
            {unreadCount > 0 && (
              <span className="bg-white text-teal-600 text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>
        </div>

        {/* Course Filter */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <BookOpen className="w-4 h-4 mr-2 text-teal-600" />
            Filter by Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value={"all"}>All</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setFilterTab('all'); setCurrentPage(1); }}
            className={`flex-1 py-3 text-sm font-medium ${filterTab === 'all'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            All
          </button>
          <button
            onClick={() => { setFilterTab('unread'); setCurrentPage(1); }}
            className={`flex-1 py-3 text-sm font-medium ${filterTab === 'unread'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            Unread {totalUnread > 0 && `(${totalUnread})`}
          </button>
        </div> */}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${activeConversation?.id === conv.id
                  ? 'bg-teal-50 border-l-4 border-l-teal-600'
                  : conv.instructorUnreadCount
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : 'hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.learner.profilePic}
                      alt={conv.learner.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.learner.name)}&background=14B8A6&color=fff`;
                      }}
                    />

                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold text-gray-900 truncate ${conv.instructorUnreadCount ? 'font-bold' : ''}`}>
                        {conv.learner.name}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{conv.lastMessageAt &&
                        formatTimeAgo(conv.lastMessageAt)}</span>
                    </div>
                    <div className="flex items-center text-xs text-teal-700 mb-1">
                      {conv.isOnline && (<span
                        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#14B8A6' }}
                      ></span>)}
                      &ensp;
                      {/* <BookOpen className="w-3 h-3 mr-1" /> */}
                      <span className="truncate">{conv.course.name}</span>
                    </div>
                    <p className={`text-sm text-gray-600 truncate ${conv.instructorUnreadCount ? 'font-semibold' : ''}`}>
                      {conv.lastMessageContent}
                    </p>
                  </div>
                  {conv.instructorUnreadCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-teal-500 text-white text-xs font-bold rounded-full flex-shrink-0">
                      {conv.instructorUnreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <Users className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-center">No conversations found for the selected filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <span className="text-sm text-gray-700">
                <span className="hidden sm:inline">Page </span>{currentPage}<span className="hidden sm:inline"> of {totalPages}</span>
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            {/* <div className="mt-2 text-xs text-center text-gray-500">
              Showing {currentPage} of {totalPages}
            </div> */}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowMobileChat(false);
                      setActiveConversation(null)
                    }}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <img
                    src={activeConversation.learner.profilePic}
                    alt={activeConversation.learner.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.learner.name)}&background=14B8A6&color=fff`;
                    }}
                  />
                  <div>
                    <h2 className="font-semibold text-gray-900">{activeConversation.learner.name}</h2>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{activeConversation.course.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAudioCall}
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
                  {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Profile">
                    <User className="w-5 h-5 text-gray-600" />
                  </button> */}
                  {isSelectionMode ? (
                    <button
                      onClick={() => {
                        setIsSelectionMode(false);
                        setSelectedMessageIds([]);
                      }}
                      className="text-sm text-red-600"
                    >
                      Cancel
                    </button>
                  ) : (

                    <button
                      onClick={() => setIsSelectionMode(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <SquareCheckBigIcon size={16} className="w-5 h-5 text-teal-600" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-teal-900">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Course: </span>
                  <strong className="truncate">{activeConversation.course.name}</strong>
                </div>
                <button className="text-teal-600 hover:text-teal-700 font-medium text-sm whitespace-nowrap">
                  View Course
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {renderMessageGroups()}
              <div ref={messagesEndRef} />
            </div>
            {attachmentDrafts.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-2 overflow-x-auto">
                  {attachmentDrafts.map((draft, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 rounded-lg bg-white border border-gray-300 flex items-center justify-center overflow-hidden"
                    >
                      {/* Image preview */}
                      {draft.fileType.startsWith("image/") ? (
                        <img
                          src={draft.fileUrl}
                          alt={draft.fileName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        /* Non-image preview */
                        <div className="flex flex-col items-center justify-center text-xs text-gray-600 px-2 text-center">
                          <Paperclip className="w-5 h-5 mb-1 text-gray-500" />
                          <span className="truncate w-full">{draft.fileName}</span>
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        onClick={() =>
                          setAttachmentDrafts(prev =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isTyping && (
              <div className="px-4 pb-2">
                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-xs text-gray-600">
                  <span>
                    {activeConversation?.learner?.name || "User"} is typing
                  </span>
                  <span className="flex gap-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
                </div>
              </div>
            )}


            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {selectedMessageIds.length > 0 ? (
                <div className="flex items-center justify-between">
                  {/* Left: Cancel */}
                  <button
                    onClick={() => {
                      setSelectedMessageIds([]);
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    ✕
                    <span className="text-sm">Clear</span>
                  </button>

                  {/* Center: count */}
                  <span className="text-sm font-medium text-gray-700">
                    {selectedMessageIds.length} selected
                  </span>

                  {/* Right: Delete */}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2 rounded-full hover:bg-red-50 text-red-600"
                  >
                    🗑
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileSelect}
                  />

                  {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 hidden sm:block">
                  <Smile className="w-5 h-5 text-gray-600" />
                </button> */}
                  <textarea
                    value={messageInput}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-teal-50/30 to-white">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Teaching!</h2>
            <p className="text-gray-600 text-center max-w-md">
              Select a conversation to chat with your students about their courses and answer their questions.
            </p>
          </div>
        )}
      </div>
      {/* {incomingCall && (
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
      )} */}

      {/* {activeCall && (
        <VideoCallModal
          open={true}
          roomId={activeCall.roomId}
          userId={id as string}
          userName={name as string}
          role="instructor"
          onClose={() => setActiveCall(null)}
        />
      )} */}

      <DeleteMessageModal
        open={showDeleteModal}
        canDeleteForEveryone={canDeleteForEveryone}
        onClose={() => setShowDeleteModal(false)}
        onDeleteForMe={handleDeleteForMe}
        onDeleteForEveryone={handleDeleteForEveryone}
      />



    </div>
  );
};

export default InstructorMessagesPage;