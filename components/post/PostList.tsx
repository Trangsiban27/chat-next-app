'use client'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import PostItem from './PostItem'
import { useInView } from 'react-intersection-observer'
import { Loader2 } from 'lucide-react'

interface PostProps {
    posts: any[]
    isLoading: boolean
    hasNextPage: boolean
    isFetchingNextPage: boolean
    fetchNextPage: () => void
}

const PostList = ({
    posts,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
}: PostProps) => {
    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    if (isLoading && posts.length === 0) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className='flex flex-col gap-6 mt-3'>
            {posts?.length > 0 && (
                posts.map((post: any) => (
                    <PostItem key={post?._id} post={post} />
                ))
            )}

            <div ref={ref} className="h-20 flex justify-center items-center">
                {isFetchingNextPage ? (
                    <Loader2 className="animate-spin text-primary" />
                ) : (
                    posts.length > 0 && !hasNextPage && (
                        <p className="text-sm text-muted-foreground">You have viewed all post today ✨</p>
                    )
                )}
            </div>
        </div>
    )
}

export default PostList