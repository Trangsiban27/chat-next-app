import React from 'react'
import UserAvatarBlock from '../user-avatar-block/UserAvatarBlock'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar'
import { formatDistanceToNow } from 'date-fns'

interface Props {
    data: any
}

const CommentItem = ({ data }: Props) => {

    const timeAgo = formatDistanceToNow(new Date(data?.createdAt), {
        addSuffix: true
    })

    return (
        <div>
            <div className='flex items-start gap-2 '>
                <Avatar className={'w-8 h-8'}>
                    <AvatarImage
                        src={data?.author?.avatar}
                        alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>

                <div className='flex flex-col p-2 px-4 bg-gray-200 rounded-md'>
                    <span className='font-semibold'>{data?.author?.username}</span>
                    <span className='text-sm text-black'>{data?.content}</span>
                </div>
            </div>
        </div>
    )
}

export default CommentItem