'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useChatStore } from '@/store/useChatStore'
import { useUserStore } from '@/store/useUserStore'
import React from 'react'

interface Props {
    data: any
}

const ConversationListItem = ({ data }: Props) => {
    const { user } = useUserStore()
    const { setSelectedConversation } = useChatStore()

    const notMe = data?.participants.find((i: any) => i?._id !== user?.user?._id)

    const handleSelectConversation = () => {
        if (data) {
            setSelectedConversation(data)
        }
    }

    return (
        <div
            className='flex gap-4 p-4 bg-gray-100 rounded-md cursor-pointer hover:shadow'
            onClick={handleSelectConversation}
        >
            <Avatar>
                <AvatarImage
                    src={notMe?.avatar}
                    alt='user avatar'
                />
                <AvatarFallback>User</AvatarFallback>
            </Avatar>

            <div className='flex flex-col'>
                <span className='font-bold'>{notMe?.username}</span>
                {data?.lastMessage && <span>{data?.lastMessage?.text}</span>}
            </div>
        </div>
    )
}

export default ConversationListItem