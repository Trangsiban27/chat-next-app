import axiosClient from "@/lib/axios"

export const ChatService = {
    getConversations: (lastId: string, limit: number) => {
        return axiosClient.get(`/chat/conversation?lastId=${lastId}&limit=${limit}`)
    },
    getMessages: (conversationId: string, lastId: string, limit: number) => {
        return axiosClient.get(`/chat/conversation/${conversationId}/messages?lastId=${lastId}&limit=${limit}`)
    },
    uploadFile: (file: FormData) => {
        return axiosClient.post(`/chat/message/upload`, file)
    }
}