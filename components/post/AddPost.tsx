'use client'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserStore } from '@/store/useUserStore'
import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { ImagePlus, X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postService } from '@/services/postService'
import { toast } from 'sonner'
import LoadingButton from '../loading-button/LoadingButton'

const AddPost = () => {
    const queryClient = useQueryClient()
    const ref = useRef<any>(null)
    const { user } = useUserStore()
    const { control, watch, reset, formState: { isValid } } = useForm({
        mode: 'onChange',
        defaultValues: {
            content: ''
        }
    })

    const [file, setFile] = useState<File | null>()
    const [open, setOpen] = useState<boolean>(false);

    const { mutate: createPost, isPending } = useMutation({
        mutationFn: (data: any) => postService.createPost(data),
        onSuccess: () => {
            toast.success('Create post successfully!')
            setOpen(false)

            if (file) {
                URL.revokeObjectURL(URL.createObjectURL(file))
            }
            setFile(null)

            if (ref.current) ref.current.value = ''

            queryClient.invalidateQueries({
                queryKey: ['highlights-infinite']
            })
            queryClient.invalidateQueries({
                queryKey: ['latest-infinite']
            })
            queryClient.invalidateQueries({
                queryKey: ['my-post-infinite']
            })

            reset()
        },
        onError: (err) => {
            toast.error('Create post fail, please try again!')
            setOpen(false)
            setFile(null)
        }
    })

    const form = watch()

    const handleAddPhotos = (e: any) => {
        ref.current.click()
    }

    const handleOnChangePhoto = (e: any) => {
        const file = e.target.files?.[0]

        if (file) {
            setFile(file)
        }
    }

    const handleRemoveFile = () => {
        setFile(null)
    }

    const handleSubmit = () => {
        const formData = new FormData()

        formData.append('content', form.content)

        if (file) {
            formData.append('file', file)
        }

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        createPost(formData)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className='w-full flex items-center gap-4 bg-white p-3 shadow rounded-lg'>
                <Avatar className='w-12 h-12'>
                    <AvatarImage
                        src={user?.user?.avatar}
                        alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>

                <DialogTrigger asChild>
                    <div className='border rounded-xl flex-1 px-3 py-2 cursor-pointer'>
                        <span className='text-gray-400 font-bold'>What's on your mind?</span>
                    </div>
                </DialogTrigger>
            </div>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader className=''>
                    <DialogTitle className='text-center font-bold'>Create Post</DialogTitle>
                </DialogHeader>

                <div>
                    <div className='flex items-center gap-2'>
                        <Avatar className='w-12 h-12'>
                            <AvatarImage
                                src={user?.user?.avatar}
                                alt="@evilrabbit"
                            />
                            <AvatarFallback>ER</AvatarFallback>
                            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                        </Avatar>

                        <span className='font-bold'>{user?.user?.username}</span>
                    </div>

                    <div>
                        <Controller
                            control={control}
                            name='content'
                            render={({ field, fieldState: { error } }) => (
                                <textarea
                                    {...field}
                                    id="content"
                                    placeholder="What's on your mind?"
                                    rows={file ? 2 : 8}
                                    className='w-full p-3 resize-none focus:outline-none'
                                    onKeyDown={(e) => {
                                        // Tùy chọn: Nếu muốn nhấn Enter để xuống dòng, còn Ctrl + Enter để submit
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            // Logic submit ở đây nếu cần
                                        }
                                    }}
                                />
                            )}
                        />

                        {file &&
                            <div className='rounded-lg border border-white max-h-120 overflow-y-scroll scroll-smooth relative 
                                /* Tùy chỉnh thanh cuộn */
                                scrollbar-thin 
                                scrollbar-thumb-gray-400 
                                scrollbar-track-gray-100
                                /* Hoặc dùng arbitrary values nếu không muốn cài plugin */
                                [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-track]:bg-gray-100
                                [&::-webkit-scrollbar-thumb]:bg-gray-400
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                hover:[&::-webkit-scrollbar-thumb]:bg-gray-500'
                            >
                                <Button
                                    variant={'ghost'}
                                    className='absolute top-2 right-2 p-2 rounded-full bg-black/60 cursor-pointer'
                                    onClick={handleRemoveFile}
                                >
                                    <X className='fill-white text-white' />
                                </Button>
                                <img src={URL.createObjectURL(file)} alt="" />
                            </div>}

                        <div className='flex items-center gap-2'>
                            <Button
                                variant={'ghost'}
                                onClick={handleAddPhotos}
                            >
                                <ImagePlus />
                            </Button>

                            <input ref={ref} type="file" className='hidden' onChange={handleOnChangePhoto} />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <LoadingButton
                        className='w-full'
                        onClick={handleSubmit}
                        disabled={form?.content === null || form.content === ''}
                        isLoading={isPending}
                    >
                        Post
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default AddPost