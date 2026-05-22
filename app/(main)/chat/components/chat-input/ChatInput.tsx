import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import React from 'react'

const ChatInput = () => {
    return (
        <div className='sticky bottom-0 left-0 right-0 flex items-center p-4 gap-4'>
            <div className='flex-1 border rounded-lg p-3'>
                <input type="text" placeholder='Write your message...' className='w-full focus:outline-0' />
            </div>

            <Button
                variant={'secondary'}
                className='w-12 h-12 bg-blue-400 cursor-pointer'
            >
                <Send className='text-white' />
            </Button>
        </div>
    )
}

export default ChatInput