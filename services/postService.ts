import axiosClient from "@/lib/axios"
import axios from "axios"

export const postService = {

    getHighlightPost: (page: Number, limit: Number) => {
        return axiosClient.get(`/post/highlights?page=${page}&limit=${limit}`)
    },
    getAllPostLatest: (page: Number, limit: Number) => {
        return axiosClient.get(`/post/latest?page=${page}&limit=${limit}`)
    },
    getAllMyPost: (page: Number, limit: Number) => {
        return axiosClient.get(`/post/my-post?page=${page}&limit=${limit}`)
    },
    reactionPost: (id: string) => {
        return axiosClient.get(`/post/reactions/${id}`)
    }
}