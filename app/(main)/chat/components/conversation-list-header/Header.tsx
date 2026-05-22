import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import React from 'react'

const Header = () => {
    return (
        <div className='flex flex-col gap-y-2 border-b pb-4 bg-white z-50'>
            <span className='font-bold'>Chats</span>
            <div className='flex items-center gap-2'>
                <div className='flex flex-1 border p-1 px-2 rounded-lg'>
                    <input
                        type="text"
                        className='focus:outline-0'
                        placeholder='Search...'
                    />
                </div>

                <Button
                    variant={'ghost'}
                    className='cursor-pointer'
                >
                    <UserPlus />
                </Button>
            </div>
        </div>
    )
}

export default Header