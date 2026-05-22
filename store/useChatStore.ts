import { create } from "zustand";

interface ChatState {
    selectedConversation: any,
    setSelectedConversation: (conversation: any) => void,
    resetChatStore: () => void,
}

export const useChatStore = create<ChatState>((set) => ({
    selectedConversation: null,
    setSelectedConversation: (conversation: any) => set({selectedConversation: conversation}),
    resetChatStore: () => set({
        selectedConversation: null,
    })
}))