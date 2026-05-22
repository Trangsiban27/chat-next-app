'use client'
import { useUserStore } from '@/store/useUserStore'
import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
    socket: Socket | null,
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const { user } = useUserStore()

    useEffect(() => {
        if (!user?.user?._id) return

        const socketInstance = io('http://localhost:8080', {
            query: { userId: user?.user?._id },
            transports: ['websocket']
        })

        socketInstance.on('connect', () => {
            setIsConnected(true)
            console.log('Socket connected:', socketInstance.id)
        })

        socketInstance.on('disconnect', () => {
            setIsConnected(false)
            console.log('Socket disconnected')
        })

        setSocket(socketInstance)

        return () => {
            socketInstance.disconnect()
        }
    }, [user?.user?._id])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}