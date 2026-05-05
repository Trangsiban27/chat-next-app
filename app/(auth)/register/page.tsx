'use client'
import LoadingButton from '@/components/loading-button/LoadingButton'
import { AuthService } from '@/services/authService'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, set, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useUserStore } from '@/store/useUserStore'

const schema = yup.object().shape({
    username: yup.string().min(2, 'Username must be at least 2 characters!').required('Username is required'),
    email: yup.string().email('Invalid email!').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters!').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match!').required('Confirm Password is required'),
})

const RegisterPage = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { control, watch, formState: { isValid } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    })

    const { mutate: register, isPending } = useMutation({
        mutationFn: (data: any) => AuthService.register(data),
        onSuccess: (res) => {
            toast.success('Create new a account successed!')
            router.push('/login')
        },
        onError: (err: any) => {
            console.log('err: ', err?.response?.data?.message)
            toast.error(err?.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại!')
        }
    })

    const form = watch()

    const handleToLogin = () => {
        router.push('/login')
    }

    const handleSubmit = () => {
        const { confirmPassword, ...registerData } = form
        register(registerData)
    }

    return (
        <div className='flex'>
            <div className='w-1/2 bg-blue-500 h-screen flex items-center justify-center text-white'>
                <p className='font-bold text-6xl'>Welcome to our application!</p>
            </div>

            <div className='flex flex-col flex-1 items-center justify-center h-screen'>
                <h1 className='text-black font-bold text-3xl'>Create Your Account</h1>

                <div className='mt-10 flex flex-col gap-8'>
                    <Controller
                        name="username"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div className="w-120 flex flex-col gap-1.5">
                                <label
                                    htmlFor="username"
                                    className={`font-semibold text-sm ${error ? 'text-red-500' : 'text-gray-700'}`}
                                >
                                    Your name
                                </label>
                                <input
                                    {...field}
                                    id="username"
                                    type="text"
                                    placeholder="Enter your name..."
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
                                    placeholder="Enter your email..."
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
                                        placeholder="Enter your password..."
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

                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div className="w-120 flex flex-col gap-1.5">
                                <label
                                    htmlFor="confirmPassword"
                                    className={`font-semibold text-sm ${error ? 'text-red-500' : 'text-gray-700'}`}
                                >
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <input
                                        {...field}
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password..."
                                        className={`border p-2 pr-10 rounded-md w-full transition-all outline-none ${error
                                            ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                            }`}
                                    />

                                    {/* Nút View Password */}
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        {showConfirmPassword ? (
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
                    disabled={!isValid}
                >
                    Register
                </LoadingButton>

                <div className='flex items-center justify-end'>
                    <span className='text-sm text-gray-500'>
                        You have an account?{' '}
                        <button
                            onClick={handleToLogin}
                            className='text-blue-500 hover:underline cursor-pointer'
                        >
                            Login
                        </button>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage