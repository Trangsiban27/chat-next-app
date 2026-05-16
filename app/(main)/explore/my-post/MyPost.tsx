'use client'
import AddPost from '@/components/post/AddPost'
import PostList from '@/components/post/PostList'
import { postService } from '@/services/postService'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { Suspense } from 'react'

const MyPostContent = () => {
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['my-post-infinite'],
        queryFn: ({ pageParam = 1 }) => postService.getAllMyPost(pageParam, 10),
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
                queryKey={['my-post-infinite']}
                isLoading={isLoading}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
            />
        </div >
    )
}

const MyPost = () => {

    return (
        <div>
            <Suspense fallback={<div>Loading settings...</div>}>
                <MyPostContent />
            </Suspense>
        </div>
    )
}

export default MyPost