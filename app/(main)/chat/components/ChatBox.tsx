'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/useUserStore'
import { EllipsisVertical } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import ChatInput from './chat-input/ChatInput'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChatService } from '@/services/chatService'
import { useChatStore } from '@/store/useChatStore'

const ChatBox = () => {
    const { selectedConversation } = useChatStore()
    const { user } = useUserStore()
    const scrollRef = useRef<HTMLDivElement>(null)

    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['messages', selectedConversation?._id],
        queryFn: ({ pageParam = '' }) => {
            if (selectedConversation) {
                console.log('selectedConversation: ', selectedConversation)
                return ChatService.getMessages(selectedConversation?._id, pageParam, 10)
            }

            return null
        },
        initialPageParam: '',
        getNextPageParam: (lastPage: any) => {
            const metadata = lastPage?.data?.metadata

            return metadata?.hasMore ? metadata?.nextCursor : undefined
        },
        enabled: !!selectedConversation?._id
    })

    const myId = user?.user?._id;
    const sender = selectedConversation?.participants?.find((i: any) => i?._id !== user?.user?._id)
    const messages: any = data?.pages?.flatMap((page: any) => page?.data?.metadata?.message).reverse() || []

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages?.length, selectedConversation?._id])

    if (!selectedConversation) {
        return (
            <div className='flex-1 flex items-center justify-center text-gray-500 bg-[#f0f2f5]'>
                Select conversation to start
            </div>
        )
    }

    return (
        <div>
            <div className='sticky top-0 right-0 left-0 h-14 bg-white shadow flex items-center justify-between px-4'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage
                            src={sender?.avatar}
                            alt='user avatar'
                        />
                        <AvatarFallback>User</AvatarFallback>
                    </Avatar>

                    <span className='font-bold'>{sender?.username}</span>
                </div>

                <Button
                    variant={'ghost'}
                >
                    <EllipsisVertical />
                </Button>
            </div>

            <div
                ref={scrollRef}
                className='flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar h-screen'
            >
                {/* Nút tải thêm tin nhắn cũ */}
                {hasNextPage && (
                    <div className='flex justify-center py-2'>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='text-xs text-blue-500 hover:bg-transparent'
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage ? 'Đang tải...' : 'Xem tin nhắn cũ'}
                        </Button>
                    </div>
                )}

                {messages?.map((msg: any, index: number) => {
                    const isMine = msg?.sender?._id === myId;

                    return (
                        <div
                            key={msg?._id}
                            className={`flex w-full mb-1 ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end gap-2 max-w-[70%] ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                                {!isMine && (
                                    <Avatar className='h-7 w-7 flex-none'>
                                        <AvatarImage src={sender?.avatar} />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                )}

                                <div className='flex flex-col'>
                                    <div className={`px-3 py-2 rounded-2xl text-[14px] leading-snug ${isMine
                                        ? 'bg-[#0084ff] text-white rounded-tr-sm'
                                        : 'bg-[#f0f0f0] text-black rounded-tl-sm'
                                        }`}>
                                        {msg.text}

                                        {msg.media?.length > 0 && (
                                            <div className='mt-1 grid gap-1'>
                                                {msg.media.map((item: any, i: number) => (
                                                    <img
                                                        key={i}
                                                        src={item.url}
                                                        alt="media"
                                                        className='rounded-xl max-h-60 object-cover'
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <ChatInput />
        </div>
    )
}

export default ChatBox