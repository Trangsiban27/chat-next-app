'use client'
import LoadingButton from '@/components/loading-button/LoadingButton'
import { AuthService } from '@/services/authService'
import { useUserStore } from '@/store/useUserStore'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as yup from 'yup'
import Cookies from 'js-cookie';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email!').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters!').required('Password is required'),
})

const LoginPage = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { control, watch, formState: { isValid } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const form = watch()

    const { user, setUser } = useUserStore()
    const { mutate: login, isPending } = useMutation({
        mutationFn: async (data: any) => AuthService.login(data),
        onSuccess: (res) => {
            console.log('Login success: ', res)
            const userData = res.data?.metadata?.data
            const { accessToken, refreshToken } = userData?.tokens || {}

            Cookies.set('session', accessToken, { expires: 7 })
            Cookies.set('refreshToken', refreshToken, { expires: 30 })

            setUser(userData)

            toast.success('Login successful!')
            router.push('/')

            router.refresh()
        },
        onError: (err: any) => {
            console.log('Login error: ', err)
            toast.error(err?.response?.data?.message || 'Login failed!')
        }
    })

    const handleToRegister = () => {
        router.push('/register')
    }

    const handleSubmit = () => {
        console.log('user: ', user)
        if (!user || !user?._id) {
            login(form)
        }
    }

    return (
        <div className='flex'>
            <div className='w-1/2 bg-blue-500 h-screen flex items-center justify-center text-white'>
                <p className='font-bold text-6xl'>Welcome to our application!</p>
            </div>

            <div className='flex flex-col flex-1 items-center justify-center h-screen'>
                <h1 className='text-black font-bold text-3xl'>Login</h1>

                <div className='mt-10 flex flex-col gap-8'>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div className="w-120 flex flex-col gap-1.5">
                                <label
                                    htmlFor="email"
                                    className={`font-semibold text-sm ${error ? 'text-red-500' : 'text-gray-700'}`}
                                >
                                    Email
                                </label>
                                <input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="Nhập email của bạn"
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

                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div className="w-120 flex flex-col gap-1.5">
                                <label
                                    htmlFor="password"
                                    className={`font-semibold text-sm ${error ? 'text-red-500' : 'text-gray-700'}`}
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        {...field}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu của bạn"
                                        className={`border p-2 pr-10 rounded-md w-full transition-all outline-none ${error
                                            ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                            }`}
                                    />

                                    {/* Nút View Password */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Hiển thị thông báo lỗi */}
                                {error && (
                                    <span className="text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                                        {error.message}
                                    </span>
                                )}
                            </div>
                        )}
                    />
                </div>

                <LoadingButton
                    isLoading={isPending}
                    className='w-120 mt-12 cursor-pointer rounded-sm bg-blue-500 text-white font-bold'
                    onClick={handleSubmit}
                    disabled={!isValid || isPending}
                >
                    Login
                </LoadingButton>

                <div className='flex items-center justify-end'>
                    <span className='text-sm text-gray-500'>
                        Don't have an account?{' '}
                        <button
                            onClick={handleToRegister}
                            className='text-blue-500 hover:underline cursor-pointer'
                        >
                            Register
                        </button>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default LoginPage