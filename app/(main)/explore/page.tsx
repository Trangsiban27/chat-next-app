'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import Highlight from './highlight/Highlight'
import Latest from './latest/Latest'
import MyPost from './my-post/MyPost'

const ExplorePageContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const activeTab = searchParams.get('tab') || 'highlight'

    const handleChangeTab = (value: string) => {
        router.push(`/explore?tab=${value}`)
    }
    return (
        <div className='flex justify-center'>
            <Tabs value={activeTab} onValueChange={handleChangeTab} className="w-1/2">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="highlight">Highlight</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="my-post">My Post</TabsTrigger>
                </TabsList>

                <TabsContent value="highlight">
                    {/* Component Profile của bạn */}
                    <div className=''>
                        <Highlight />
                    </div>
                </TabsContent>

                <TabsContent value="all">
                    <div className=' '>
                        <Latest />
                    </div>
                </TabsContent>

                <TabsContent value="my-post">
                    <div className=''>
                        <MyPost />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

const ExplorePage = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading settings...</div>}>
                <ExplorePageContent />
            </Suspense>
        </div>
    )
}

export default ExplorePage