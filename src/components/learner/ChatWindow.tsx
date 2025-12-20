// import { ArrowLeft, BookOpen, MoreVertical, Paperclip, Send, Smile, User } from "lucide-react";
// import type { Conversation, Message } from "../../pages/learner/Messages";
// import { useNavigate } from "react-router-dom";
// import { MessageBubble } from "./MessageBubble";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../redux/store";
// import { useEffect, useRef, useState } from "react";
// import { useSocket } from "../../hooks/useChat";

// const ChatWindow: React.FC<{
//   conversation: Conversation;
//   messages: Message[];
//   showMobileChat:boolean;
//   setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
//   setShowMobileChat: React.Dispatch<React.SetStateAction<boolean>>;
// }> = ({ messages, conversation,showMobileChat ,setMessages,setShowMobileChat}) => {
//   const {id}=useSelector((state:RootState)=>state.learner)
//   const navigate = useNavigate();

//   const socket =useSocket(id,"learner")

//   const [messageInput, setMessageInput] = useState('');
  

//   const messagesEndRef = useRef<HTMLDivElement>(null);
  
//     const scrollToBottom = () => {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };
  
//     useEffect(() => {
//       scrollToBottom();
//     }, [messages]);


//   const sendMessage = () => {
//         if (!socket || !messageInput.trim()) return;
        
//         socket.emit('sendMessage', {
//             receiverId: 'receiver123',
//             message: { 
//               content: messageInput.trim(),
//               attachments:[]
//             }
//         },
//         (response:{success:boolean,message:Message,error?:string})=>{
//           if(response.success){
//             console.log("Message delivered");
//             setMessages(prev => [...prev,response. message]);
//             setMessageInput('');
//           }else{
//             console.log("Message failed",response.error);
//           }
//         }
//       );
//     };


//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };


//   const getMessageDateLabel = (date: Date) => {
//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);

//   if (date.toDateString() === today.toDateString()) return 'Today';
//   if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
//   return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
// };

//   const renderMessageGroups = () => {
//     const groups: { date: string; messages: Message[] }[] = [];
//     let currentDate = '';

//     messages.forEach(message => {
//       const messageDate = getMessageDateLabel(message.createdAt);
//       if (messageDate !== currentDate) {
//         currentDate = messageDate;
//         groups.push({ date: messageDate, messages: [message] });
//       } else {
//         groups[groups.length - 1].messages.push(message);
//       }
//     });

//     return groups.map((group, groupIdx) => (
//       <div key={groupIdx}>
//         <div className="flex justify-center my-4">
//           <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
//             {group.date}
//           </span>
//         </div>
//         {group.messages.map((message, idx) => {
//           const isOwn = message.senderId === id;
//           const prevMessage = idx > 0 ? group.messages[idx - 1] : null;
//           const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

//           return (
//             <MessageBubble
//               key={message.id}
//               message={message}
//               isOwn={isOwn}
//               showAvatar={showAvatar}
//               senderName={conversation?.instructor.name}
//               senderAvatar={isOwn ? undefined : conversation?.instructor.profilePic}
//             />
//           );
//         })}
//       </div>
//     ));
//   };
//   return (
//     <div className={`flex-1 flex flex-col bg-white ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
//       {conversation ? (
//         <>
//           <div className="p-4 border-b border-gray-200 bg-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setShowMobileChat(false)}
//                   className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
//                 >
//                   <ArrowLeft size={20} />
//                 </button>

//                 <img
//                   src={conversation.instructor.profilePic}
//                   alt={conversation.instructor.name}
//                   className="w-10 h-10 rounded-full object-cover"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.instructor.name)}&background=14B8A6&color=fff`;
//                   }}
//                 />

//                 <div>
//                   <h2 className="font-semibold text-gray-900">
//                     {conversation.instructor.name}
//                   </h2>
//                   <div className="flex items-center gap-2 text-sm text-gray-500">
//                     <span>{conversation.course.name}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Profile">
//                   <User size={20} className="text-gray-600" />
//                 </button>
//                 <button
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Go to Course">
//                   <BookOpen size={20} className="text-gray-600" />
//                 </button>
//                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="More">
//                   <MoreVertical size={20} className="text-gray-600" />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between">
//               <div className="flex items-center gap-2 text-sm text-teal-900">
//                 <BookOpen size={16} />
//                 <span>Course: <strong>{conversation.course.name}</strong></span>
//               </div>
//               <button
//                 onClick={() => navigate(`/learner/courses/${conversation.course.id}/learn`)}
//                 className="text-teal-600 hover:text-teal-700 font-medium text-sm">
//                 Go to Course
//               </button>
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
//             {renderMessageGroups()}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="p-4 border-t border-gray-200 bg-white">
//             <div className="flex items-end gap-2">
//               <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
//                 <Paperclip size={20} className="text-gray-600" />
//               </button>
//               <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
//                 <Smile size={20} className="text-gray-600" />
//               </button>

//               <div className="flex-1 relative">
//                 <textarea
//                   value={messageInput}
//                   onChange={(e) => setMessageInput(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Type your message..."
//                   rows={1}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
//                   style={{ minHeight: '40px', maxHeight: '120px' }}
//                 />
//               </div>

//               <button
//                 onClick={sendMessage}
//                 disabled={!messageInput.trim()}
//                 className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
//               >
//                 <Send size={20} />
//               </button>
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-teal-50/30 to-white">
//           <div className="text-8xl mb-4">💬</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Learning!</h2>
//           <p className="text-gray-500 max-w-md">
//             Select a conversation to chat with your instructors about your courses.
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ChatWindow
