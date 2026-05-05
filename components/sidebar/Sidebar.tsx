'use client'
import React from 'react'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Compass, Heart, MessageCircle, Radio, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Sidebar = () => {

    const pathname = usePathname()

    const navigations = [
        { name: 'Explore', icon: Compass, href: '/' },
        { name: 'Matching', icon: Heart, href: '/match' },
        { name: 'Live', icon: Radio, href: '/live' },
        { name: 'Chat', icon: MessageCircle, href: '/chat' },
    ]

    return (
        <aside className="hidden md:flex w-64 flex-col border-r bg-white shadow-md relative">
            <button className='flex items-center gap-2 p-4 mt-16 cursor-pointer'>
                <span className='text-black text-2xl font-bold'>Benegram</span>
            </button>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navigations?.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'group-hover:scale-110 transition-transform'}`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className='absolute bottom-0 text-black border-t w-full p-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage
                            src="https://img.freepik.com/free-photo/pleased-young-brunette-caucasian-girl-looks-camera_141793-103873.jpg?semt=ais_hybrid&w=740&q=80"
                            alt="@evilrabbit"
                        />
                        <AvatarFallback>ER</AvatarFallback>
                        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                    </Avatar>

                    <span className='text-sm font-bold'>Nicolas propin</span>
                </div>

                <button className='cursor-pointer'>
                    <Settings className='w-5 h-5' />
                </button>
            </div>
        </aside>
    )
}

export default Sidebar