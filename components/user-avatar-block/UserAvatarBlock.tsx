import React from 'react'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useUserStore } from '@/store/useUserStore'

interface Props {
    classname: string
}

const UserAvatarBlock = ({ classname }: Props) => {

    const { user } = useUserStore()

    return (
        <Avatar className={classname}>
            <AvatarImage
                src={user?.user?.avatar}
                alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
    )
}

export default UserAvatarBlock