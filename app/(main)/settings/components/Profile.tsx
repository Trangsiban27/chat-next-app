'use client'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/useUserStore'
import { yupResolver } from '@hookform/resolvers/yup'
import { Camera } from 'lucide-react'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup.object().shape({
    username: yup.string().required('Username is required')
})

const Profile = () => {
    const avatarRef = React.useRef<HTMLInputElement>(null)
    const { user } = useUserStore()
    const { control, watch, reset, formState: { errors, isValid, isDirty } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            username: user?.user?.username || "",
        }
    })

    const handleAvatarClick = () => {
        avatarRef.current?.click()
    }

    const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement> | null) => {
        const file = e?.target?.files?.[0]

        if (file) {

        }
    }

    useEffect(() => {
        if (user?.user?.username) {
            reset({ username: user.user.username })
        }
    }, [user, reset])

    return (
        <div className='flex flex-col p-6 gap-y-6'>

            <div className='w-full flex items-center justify-center'>
                <div
                    className='cursor-pointer w-30 h-30 border-2 border-black border-dashed bg-gray-200 rounded-full flex items-center justify-center'
                    onClick={handleAvatarClick}
                >
                    <Camera />

                </div>

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
                <Button
                    className='bg-blue-500 cursor-pointer font-bold'
                    disabled={!isValid || !isDirty}
                >
                    Save
                </Button>
            </div>
        </div>
    )
}

export default Profile