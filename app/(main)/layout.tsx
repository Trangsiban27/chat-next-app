import Header from '@/components/header/Header'
import Sidebar from '@/components/sidebar/Sidebar'
import React from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Cố định bên trái */}

            <Sidebar />

            <div className="flex flex-1 flex-col">
                {/* Header - Cố định phía trên */}
                <header className="h-16 border-b bg-background flex items-center px-6">
                    <Header />
                </header>

                {/* Content Area - Cuộn độc lập */}
                <main className="flex-1 overflow-y-auto p-4 bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default MainLayout