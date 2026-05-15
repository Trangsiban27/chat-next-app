'use client'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import PostItem from './PostItem'

interface PostProps {
    isLoading: Boolean,
    posts: any,
    pagination: {
        currentPage: Number,
        limit: Number,
        totalElements: Number,
        totalPages: Number
    }
}

const PostList = ({ isLoading, posts, pagination }: PostProps) => {

    return (
        <div className='flex flex-col gap-6 mt-3'>
            {posts?.length > 0 && (
                posts.map((post: any) => (
                    <PostItem key={post?._id} post={post} />
                ))
            )}
        </div>
    )
}

export default PostList