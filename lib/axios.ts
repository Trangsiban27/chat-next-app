import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

axiosClient.interceptors.request.use((config) => {
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
    if(error.response.status === 401) {
        console.log('BadCredential')
    }

    return Promise.reject(error)
}
)

export default axiosClient