'use client'
import LoadingButton from '@/components/loading-button/LoadingButton'
import { Button } from '@/components/ui/button'
import { UserService } from '@/services/userService'
import { useUserStore } from '@/store/useUserStore'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Camera } from 'lucide-react'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as yup from 'yup'

const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
})

const Profile = () => {
    const queryClient = useQueryClient()
    const avatarRef = React.useRef<HTMLInputElement>(null)
    const { user, setUser } = useUserStore()
    const { control, watch, reset, formState: { errors, isValid, isDirty } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            username: user?.user?.username || "",
        }
    })

    const form = watch()

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: async (data: any) => await UserService.updateUser(data),
        onSuccess: (res) => {
            console.log('res: ', res)
            toast.success('Profile updated successfully')
        },
        onError: (err) => {
            console.log('err: ', err)
            toast.error('Failed to update profile')
        }
    })

    const { mutate: upload, isPending: isUploading } = useMutation({
        mutationFn: async (file: File) => await UserService.uploadAvatar(file),
        onSuccess: (res) => {
            console.log('res: ', res)
            setUser({
                ...user,
                user: {
                    ...user?.user,
                    avatar: res.data?.metadata?.avatar
                }
            })

            queryClient.invalidateQueries({ queryKey: ['user-profile'] })
            toast.success('Avatar uploaded successfully')
        },
        onError: (err) => {
            console.log('err: ', err)
            toast.error('Failed to upload avatar')
        }
    })

    const { data: userData, isLoading } = useQuery({
        queryKey: ['user-profile'],
        queryFn: UserService.getUser,
    })

    useEffect(() => {
        if (userData) {
            const user = userData?.data?.metadata

            reset({
                username: user.username,
            })
        }
    }, [userData, reset, user])

    const handleAvatarClick = () => {
        avatarRef.current?.click()
    }

    const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement> | null) => {
        const file = e?.target?.files?.[0]

        if (file) {
            upload(file)
        }
    }

    const handleSubmit = () => {
        console.log('form: ', form)
        updateProfile(form)
    }

    return (
        <div className='flex flex-col p-6 gap-y-6'>


            <div className='w-full flex items-center justify-center'>
                {!userData?.data?.metadata?.avatar ? (
                    <div
                        className='cursor-pointer w-30 h-30 border-2 border-black border-dashed bg-gray-200 rounded-full flex items-center justify-center'
                        onClick={handleAvatarClick}
                    >
                        <Camera />
                    </div>
                ) : (
                    <div
                        className='relative overflow-hidden cursor-pointer group w-30 h-30 rounded-full flex items-center justify-center'
                        onClick={handleAvatarClick}
                    >
                        <img src={userData?.data?.metadata?.avatar} alt="Avatar" className="w-30 h-30 rounded-full" />

                        <div className='flex items-center justify-center absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300'>
                            <Camera className='text-white' />
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    ref={avatarRef}
                    className="hidden"
                    onChange={handleChangeAvatar}
                />
            </div>

            <div className="w-120 flex flex-col gap-1.5">
                <label
                    htmlFor="email"
                >
                    Email (Can't update)
                </label>
                <input
                    id="email"
                    type="email"
                    value={user?.user?.email || ''}
                    disabled={true}
                    placeholder="Nhập email của bạn"
                    className={`border p-2 rounded-md w-full transition-all outline-none`}
                />
            </div>

            <Controller
                name="username"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <div className="w-120 flex flex-col gap-1.5">
                        <label
                            htmlFor="username"
                            className={`font-semibold text-sm ${error ? 'text-red-500' : 'text-gray-700'}`}
                        >
                            Username
                        </label>
                        <input
                            {...field}
                            id="username"
                            type="text"
                            placeholder="Enter your username..."
                            className={`border p-2 rounded-md w-full transition-all outline-none ${error
                                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                }`}
                        />

                        {/* Hiển thị thông báo lỗi */}
                        {error && (
                            <span className="text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                                {error.message}
                            </span>
                        )}
                    </div>
                )}
            />

            <div>
                <LoadingButton
                    isLoading={isPending}
                    className=' cursor-pointer font-bold'
                    disabled={!isValid || !isDirty}
                    onClick={handleSubmit}
                >
                    Save
                </LoadingButton>
            </div>
        </div>
    )
}

export default Profile