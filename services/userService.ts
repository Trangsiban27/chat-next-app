import axiosClient from "@/lib/axios"

export const UserService = {
    updateUser: (data: any) => {
       return axiosClient.patch('/user/update-profile', data)
    },
    getUser: () => {
        return axiosClient.get(`/user/profile`)
    },
    uploadAvatar: (file: File) => {
        const formData = new FormData()
        formData.append('avatar', file)

        return axiosClient.post('/user/upload-avatar', formData)
    },
    updatePrivacy: (data: any) => {
        return axiosClient.patch('/user/update-privacy', data)
    },
    getUserPrivacy: () => {
        return axiosClient.get('/user/privacy')
    }
}