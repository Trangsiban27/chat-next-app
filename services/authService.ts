import axiosClient from "@/lib/axios"

export const AuthService = {
    register: (data: any) => {
        return axiosClient.post('/register', data)
    },

    login: (data: any) => {
        return axiosClient.post('/login', data)
    },
}
