'use client'
import React, { Suspense, useEffect } from 'react'
import AddPost from '../../../../components/post/AddPost'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { postService } from '@/services/postService'
import { useParams } from 'next/navigation'
import PostList from '@/components/post/PostList'
import { useInView } from 'react-intersection-observer'

const HighlightContent = () => {
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['highlights-infinite'],
        queryFn: ({ pageParam = 1 }) => postService.getHighlightPost(pageParam, 10),
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
                queryKey={['highlights-infinite']}
                isLoading={isLoading}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
            />
        </div>
    )
}

const Highlight = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading settings...</div>}>
                <HighlightContent />
            </Suspense>
        </div>
    )
}

export default Highlight