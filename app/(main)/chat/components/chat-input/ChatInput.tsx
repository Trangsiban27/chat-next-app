import { useSocket } from '@/app/context/socketContext'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/useChatStore'
import { useUserStore } from '@/store/useUserStore'
import { useQueryClient } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

interface MessageType {
    conversationId: string,
    senderId: string,
    text: string,
    media: [],
}

const ChatInput = () => {
    const { socket } = useSocket()
    const { user } = useUserStore()
    const { selectedConversation } = useChatStore()

    const queryClient = useQueryClient()

    const { control, watch, reset } = useForm({
        mode: 'onChange',
        defaultValues: {
            text: ''
        }
    })

    const form = watch()

    const handleSendMessage = async (e: any) => {
        e.preventDefault()

        if (!selectedConversation?._id || !user?.user?._id || !form?.text || form?.text === '') return

        try {
            const payload: MessageType = {
                conversationId: selectedConversation?._id,
                senderId: user?.user?._id,
                text: form?.text,
                media: []
            }

            const optimisticMessage = {
                ...payload,
                _id: Date.now().toString(),
                sender: {
                    _id: user?.user?._id,
                },
                createdAt: new Date().toISOString()
            };

            queryClient.setQueryData(['messages', selectedConversation?._id], (old: any) => {
                if (!old) return old

                const updatedPages = old.pages.map((page: any, index: number) => {
                    // Chỉ cập nhật trang đầu tiên (nơi chứa các tin nhắn mới nhất)
                    if (index === 0) {
                        return {
                            ...page,
                            data: {
                                ...page.data,
                                metadata: {
                                    ...page.data.metadata,
                                    // Thêm tin nhắn mới vào đầu mảng (vì bạn dùng .reverse() ở UI)
                                    message: [optimisticMessage, ...(page.data.metadata.message || [])]
                                }
                            }
                        };
                    }
                    return page;
                });

                return {
                    ...old,
                    pages: updatedPages
                };
            })

            console.log('payload: ', payload)

            socket?.emit('send_message', payload)

            reset({
                text: ''
            })
        } catch (err) {
            console.log('Send message fail: ', err)
        }


    }

    return (
        <form
            onSubmit={handleSendMessage}
            className='sticky bottom-0 left-0 right-0 flex items-center p-4 gap-4 z-10 bg-white'
        >
            <div className='flex-1 border rounded-lg p-3'>
                <Controller
                    control={control}
                    name='text'
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            placeholder='Write your message...'
                            className='w-full focus:outline-0'
                            autoComplete="off"
                        />
                    )}
                />
            </div>

            <Button
                /* 2. Thêm type="submit" và bỏ onClick (onSubmit của form sẽ xử lý cả hai) */
                type="submit"
                variant={'secondary'}
                className='w-12 h-12 bg-blue-400 cursor-pointer'
                disabled={!form?.text || form?.text.trim() === ''}
            >
                <Send className='text-white' />
            </Button>
        </form>
    )
}

export default ChatInput