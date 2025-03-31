import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessagesSkeleton from '../Skeletons/MessagesSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utilis';

const ChatContainer = () => {
  const {messages,getMessages,selectedUser,isMessagesLoading,subscribeToMessage,unsubscribeToMessage}=useChatStore();
  const {authUser}=useAuthStore();
  const messageEndRef= useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(selectedUser?._id){
    getMessages(selectedUser._id)
    }

    subscribeToMessage();

    return ()=>unsubscribeToMessage();
  },[selectedUser?._id,getMessages,subscribeToMessage,unsubscribeToMessage])

  useEffect(()=>{
    if(messageEndRef.current && messages){
    messageEndRef.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])

  if(isMessagesLoading) {
    return <div className='flex flex-1 flex-col overflow-auto'>
      <ChatHeader/>
      <MessagesSkeleton/>
      <MessageInput/>
    </div>
  }

  

  return (
    <div className='flex-1 flex flex-col overflow-auto'>

      <ChatHeader/>
    
     <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      {messages.map((messsage)=>(
        <div key={messsage._id}
        className={`chat ${messsage.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
        ref={messageEndRef}
        >
          <div className='chat-image avatar'>
            <div className='size-10 rounded-full border'>
                <img src={
                  `${messsage.senderId === authUser?._id ? authUser?.profilePic || "/avatar.png" : selectedUser?.profilePic || "/avatar.png"}`
                } alt="ProfilePic" />
            </div>
          </div>
          <div className='chat-header mb-1'>
                <time className='text-xs opacity-50 ml-1'>
                  {formatMessageTime(messsage.createdAt)}
                </time>
          </div>
          <div className='chat-bubble flex flex-col'>
            {messsage.image && (
            <img 
            src={messsage.image?.toString()}// we use to string because we want to pass primitive String
            alt='AttachMent'
            className='sm:max-w-[200px] rounded-md mb-2'
            />
            )}
            {messsage.text && <p>{messsage.text}</p>}
          </div>
        </div>
      ))}

     </div>

      <MessageInput/>

      </div>
  )
}

export default ChatContainer