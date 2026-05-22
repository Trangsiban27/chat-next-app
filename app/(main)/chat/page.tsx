'use client'
import React, { useEffect } from 'react'
import ConversationList from './components/ConversationList'
import ChatBox from './components/ChatBox'
import { useChatStore } from '@/store/useChatStore'

const ChatPage = () => {
    const { resetChatStore } = useChatStore()

    useEffect(() => {
        return () => {
            resetChatStore()
        }
    }, [resetChatStore])

    return (
        <div className='flex h-[92vh] w-full overflow-hidden bg-gray-100'>

            {/* Sidebar bên trái: Danh sách hội thoại */}
            <div className='w-80 flex-none flex flex-col border-r border-gray-200 bg-white p-4'>
                {/* Phần này sẽ tự cuộn bên trong ConversationList nhờ vào CSS chúng ta đã viết trước đó */}
                <ConversationList />
            </div>

            {/* Phần bên phải: ChatBox */}
            <div className='flex-1 flex flex-col h-full bg-white'>
                {/* ChatBox cũng cần có overflow-y-auto bên trong để tự cuộn tin nhắn */}
                <ChatBox />
            </div>
        </div>
    )
}

export default ChatPage