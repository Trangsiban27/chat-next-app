'use client'
import React, { useEffect } from 'react'
import Header from './conversation-list-header/Header'
import ConversationListItem from './conversation-list-item/ConversationListItem'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { ChatService } from '@/services/chatService'
import { useInView } from 'react-intersection-observer'

const ConversationList = () => {
    const { ref, inView } = useInView({
        threshold: 0.1
    })

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['conversations'],
        queryFn: ({ pageParam = '' }) => ChatService.getConversations(pageParam, 10),
        initialPageParam: '',
        getNextPageParam: (lastPage) => {
            const metadata = lastPage?.data?.metadata
            return metadata?.hasMore ? metadata?.nextCursor : undefined
        }
    })

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    const allConversations = data?.pages?.flatMap((page: any) => page?.data?.metadata?.conversations) || []

    console.log('allConversations: ', allConversations)

    return (
        <div className='flex flex-col h-full'>
            <div className='flex-none'>
                <Header />
            </div>

            <div className='flex-1 overflow-y-auto'>
                <div className='flex flex-col py-4 gap-2 px-2'>
                    {allConversations?.map((item) => (
                        <ConversationListItem key={item?._id} data={item} />
                    ))}

                    <div ref={ref} className='h-10 flex items-center justify-center'>
                        {isFetchingNextPage ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"></div>
                        ) : hasNextPage ? (
                            <span className="text-sm text-gray-400">Loading...</span>
                        ) : allConversations.length > 0 ? (
                            <span className="text-sm text-gray-400">End</span>
                        ) : null}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ConversationList