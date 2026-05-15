'use client'
import React, { Suspense } from 'react'
import AddPost from '../../../../components/post/AddPost'
import { useQuery } from '@tanstack/react-query'
import { postService } from '@/services/postService'
import { useParams } from 'next/navigation'
import PostList from '@/components/post/PostList'

const HighlightContent = () => {

    const searchParams = useParams()

    const { page, limit } = searchParams

    const { data, isLoading } = useQuery({
        queryKey: ['highlights'],
        queryFn: () => postService.getHighlightPost(1, 10)
    })

    const postData = data?.data?.metadata?.posts
    const pagination = data?.data?.metadata?.pagination

    return (
        <div>
            <AddPost />

            <div>
                <PostList isLoading={isLoading} posts={postData} pagination={pagination} />
            </div>
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