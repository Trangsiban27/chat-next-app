'use client'
import AddPost from '@/components/post/AddPost'
import PostList from '@/components/post/PostList'
import { postService } from '@/services/postService'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { Suspense } from 'react'

const LatestContent = () => {
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['latest-infinite'],
        queryFn: ({ pageParam = 1 }) => postService.getAllPostLatest(pageParam, 10),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage?.data?.metadata?.pagination || {}
            return currentPage < totalPages ? currentPage + 1 : undefined
        }
    })

    const allPosts = data?.pages.flatMap(page => page?.data?.metadata?.posts) || []

    return (
        <div>
            <AddPost />

            <PostList
                posts={allPosts}
                isLoading={isLoading}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
            />
        </div>
    )
}

const Latest = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading settings...</div>}>
                <LatestContent />
            </Suspense>
        </div>
    )
}

export default Latest