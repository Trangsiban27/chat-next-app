'use client'
import { postService } from '@/services/postService'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React from 'react'
import CommentItem from './CommentItem'
import { Button } from '../ui/button'

interface Props {
    postId: string
}

const CommentList = ({ postId }: Props) => {

    let lastId = ''
    let limit = 5

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['comments', postId],
        queryFn: ({ pageParam = '' }: any) => postService.getComments(postId, pageParam, limit),
        initialPageParam: '',
        getNextPageParam: (lastPage: any) => {
            console.log('lastPage: ', lastPage)
            const metadata = lastPage?.data?.metadata
            return metadata?.hasMore ? metadata?.nextCursor : undefined
        },
        enabled: !!postId
    }) as any

    console.log('data: ', data)
    const comments = data?.pages.flatMap((page: any) => page?.data?.metadata?.comments) || []

    console.log('comments: ', comments)

    if (isLoading) return <div className="text-center p-4">Loading comments...</div>

    return (
        <div className='flex flex-col gap-3 mt-6 overflow-y-scroll max-h-80'>
            {comments?.map((cmt: any) => (
                <CommentItem key={cmt?._id} data={cmt} />
            ))}

            {hasNextPage && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit text-gray-500 font-semibold"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? 'Loading more...' : 'View more comments'}
                </Button>
            )}
        </div>
    )
}

export default CommentList