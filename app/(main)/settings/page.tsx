'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import Profile from './components/Profile'

const SettingsContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const activeTab = searchParams.get('tab') || 'profile'

    const handleChangeTab = (value: string) => {

        router.push(`/settings?tab=${value}`)
    }

    return (
        <Tabs value={activeTab} onValueChange={handleChangeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="account">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
                {/* Component Profile của bạn */}
                <div className='h-120 bg-white p-6 shadow-md rounded-lg'>
                    <Profile />
                </div>
            </TabsContent>

            <TabsContent value="account">
                <div className='h-120 bg-white p-6 shadow-md rounded-lg'>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla dolore sed fuga, qui mollitia expedita officia cumque fugiat! Magnam expedita iste ab amet qui modi dolorum impedit aperiam repellat veniam?
                </div>
            </TabsContent>
        </Tabs>
    )
}

const SettingPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <Suspense fallback={<div>Loading settings...</div>}>
                <SettingsContent />
            </Suspense>
        </div>
    )
}

export default SettingPage