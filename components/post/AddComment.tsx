import React from 'react'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar'
import UserAvatarBlock from '../user-avatar-block/UserAvatarBlock'
import { Send } from 'lucide-react'
import { Button } from '../ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postService } from '@/services/postService'
import { toast } from 'sonner'
import { Controller, useForm } from 'react-hook-form'
import LoadingButton from '../loading-button/LoadingButton'
import { useUserStore } from '@/store/useUserStore'

interface CommentBody {
    postId: string,
    parentId: string | null,
    content: string
}

interface Props {
    postId: string,
    parentId: string | null
}

const AddComment = ({ postId, parentId }: Props) => {
    const queryClient = useQueryClient() as any
    const { user } = useUserStore()
    const { control, watch, reset } = useForm({
        mode: 'onChange',
        defaultValues: {
            content: ''
        }
    })

    const form = watch()

    const { mutate: addComment, isPending } = useMutation({
        mutationFn: (data: CommentBody) => postService.addComment(data),
        onMutate: async (newComment) => {
            await queryClient.cancelQueries({
                queryKey: ['comments', postId]
            })

            const previousData = queryClient.getQueryData(['comments', postId])

            queryClient.setQueryData(['comments', postId], (old: any) => {
                const fakeNewComment = {
                    _id: Date.now().toString(),
                    content: form.content,
                    author: {
                        _id: user?.user?._id,
                        username: user?.user?.username,
                        avatar: user?.user?.avatar
                    },
                    createdAt: new Date().toISOString(),
                }

                return {
                    ...old,
                    pages: [
                        {
                            ...old.pages[0],
                            data: {
                                ...old.pages[0].data,
                                metadata: {
                                    ...old.pages[0].data.metadata,
                                    comments: [fakeNewComment, ...old.pages[0].data.metadata.comments]
                                }
                            }
                        },
                        ...old.pages.slice(1)
                    ]
                }
            })

            return { previousData }
        },
        onSuccess: () => {
            toast.success('Add comment successfully!')
            reset()
        },
        onError: (err, newComment, context: any) => {
            toast.error('Add comment fail, please try again!')
            queryClient.setQueryData(['comments', postId], context?.previousComments);
            reset()
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        }
    })

    const handleSubmitComment = () => {
        addComment({
            postId,
            parentId,
            content: form.content
        })
    }

    return (
        <div className='w-full flex gap-2'>
            <UserAvatarBlock classname='w-10 h-10' />

            <div className='flex flex-1 items-center border px-3 rounded-lg'>
                <Controller
                    control={control}
                    name='content'
                    render={({ field, fieldState: { error } }) => (
                        <input {...field} type="text" className='flex-1 border-none focus:outline-none' />
                    )}
                />

                <LoadingButton
                    variant={'ghost'}
                    className='cursor-pointer'
                    onClick={handleSubmitComment}
                    isLoading={isPending}
                    disabled={isPending}
                >
                    <Send />
                </LoadingButton>
            </div>
        </div>
    )
}

export default AddComment