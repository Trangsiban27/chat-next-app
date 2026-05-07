import { useUserStore } from "@/store/useUserStore";
import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    withCredentials: true
})

axiosClient.interceptors.request.use((config) => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const userState = useUserStore.getState(); 
    const user = userState.user;

    if (apiKey) {
        config.headers['x-api-key'] = apiKey;
    }

    if(user) {
        config.headers['Authorization'] = `${user?.tokens?.accessToken}`
        config.headers['x-client-id'] = user?.user?._id || null
    }
    
    return config
}, 
(error) => {
    return Promise.reject(error)
}
)

axiosClient.interceptors.response.use((response) => {
    return response
}, 
(error) => {screenTop
    // if(error.response.status === 401) {
    //     console.log('BadCredential')
    // }

    return Promise.reject(error)
}
)

export default axiosClient