import React from 'react'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar'
import UserAvatarBlock from '../user-avatar-block/UserAvatarBlock'
import { Send } from 'lucide-react'
import { Button } from '../ui/button'
import { useMutation } from '@tanstack/react-query'
import { postService } from '@/services/postService'
import { toast } from 'sonner'
import { Controller, useForm } from 'react-hook-form'
import LoadingButton from '../loading-button/LoadingButton'

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

    const { control, watch } = useForm({
        mode: 'onChange',
        defaultValues: {
            content: ''
        }
    })

    const form = watch()

    const { mutate: addComment, isPending } = useMutation({
        mutationFn: (data: CommentBody) => postService.addComment(data),
        onSuccess: () => {
            toast.success('Add comment successfully!')
        },
        onError: (err) => {
            toast.error('Add comment fail, please try again!')
        }
    })

    const handleSubmitComment = () => {
        console.log('form: ', form)
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