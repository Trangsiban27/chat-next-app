'use client'
import { useSocket } from '@/app/context/socketContext'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/useChatStore'
import { useUserStore } from '@/store/useUserStore'
import { useQueryClient } from '@tanstack/react-query'
import { Laugh, Send } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import EmojiPicker from 'emoji-picker-react';

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
    const emojiPickerRef = useRef<HTMLDivElement>(null)

    const queryClient = useQueryClient()

    const [isOpen, setIsOpen] = useState<boolean>(false) //for emoji component

    const { control, watch, reset, setValue } = useForm({
        mode: 'onChange',
        defaultValues: {
            text: ''
        }
    })

    const form = watch()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Nếu vùng chứa emoji đang mở và vị trí click KHÔNG nằm trong emojiPickerRef
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        // Đăng ký sự kiện
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            // Hủy đăng ký khi component bị unmount
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

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

    const onEmojiClick = (emojiData: any) => {
        const currentText = watch('text')

        setValue('text', currentText + emojiData?.emoji)
    }

    return (
        <form
            onSubmit={handleSendMessage}
            className='sticky bottom-0 left-0 right-0 flex items-center p-4 gap-4 z-10 bg-white'
        >
            <div className='flex-1 border rounded-lg p-3 flex items-center relative'>
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



                <div ref={emojiPickerRef} className='relative'>
                    <Button
                        type="button" // QUAN TRỌNG: Thêm dòng này để không bị submit form
                        variant={'ghost'}
                        className='cursor-pointer'
                        onClick={() => setIsOpen(!isOpen)} // Đổi thành toggle để đóng/mở
                    >
                        <Laugh />
                    </Button>

                    {isOpen && (
                        <div className='absolute bottom-full right-0 mb-2 z-50'>
                            <EmojiPicker
                                onEmojiClick={onEmojiClick}
                            // Các props khác
                            />
                        </div>
                    )}
                </div>
            </div>

            <Button
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