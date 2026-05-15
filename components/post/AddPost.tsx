import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserStore } from '@/store/useUserStore'
import React from 'react'

const AddPost = () => {

    const { user } = useUserStore()

    return (
        <div className='w-full flex items-center gap-4 bg-white p-3 shadow rounded-lg'>
            <Avatar className='w-12 h-12'>
                <AvatarImage
                    src={user?.user?.avatar}
                    alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>

            <div className='border rounded-xl flex-1 px-3 py-2 cursor-pointer'>
                <span className='text-gray-400 font-bold'>What's on your mind?</span>
            </div>
        </div>
    )
}

export default AddPost