import axiosClient from "@/lib/axios"
import axios from "axios"

export const postService = {

    getHighlightPost: (page: Number, limit: Number) => {
        return axiosClient.get(`/post/highlights?page=${page}&limit=${limit}`)
    }   
}