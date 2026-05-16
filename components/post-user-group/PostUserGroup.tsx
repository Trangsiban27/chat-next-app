'use client'
import React from 'react'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar'
import { formatDistanceToNow } from 'date-fns';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
    data: any,
    postCreatedAt: string | number | Date
}

const PostUserGroup = ({ data, postCreatedAt }: Props) => {

    const timeAgo = formatDistanceToNow(new Date(postCreatedAt), {
        addSuffix: true
    })

    return (
        <div className='flex items-center justify-between w-full p-3'>
            <div className='flex items-center gap-x-3'>
                <Avatar className='w-10 h-10'>
                    <AvatarImage
                        src={data?.avatar}
                        alt="@evilrabbit"
                    />
                    <AvatarFallback>User</AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>

                <div className='flex flex-col'>
                    <span className='font-semibold'>{data?.username}</span>
                    <span className='text-gray-500'>{timeAgo}</span>
                </div>
            </div>

            <Button
                variant={'ghost'}
                className='cursor-pointer'
            >
                <EllipsisVertical />
            </Button>
        </div>
    )
}

export default PostUserGroup