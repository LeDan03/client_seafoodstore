import axios from "axios"
import useAuthStore from "../../stores/authStore"

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // đổi theo backend của Đan
  withCredentials: true, // cực kỳ quan trọng để gửi refresh cookie
})

/* =========================
   REQUEST INTERCEPTOR
========================= */
axiosClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

/* =========================
   RESPONSE INTERCEPTOR
========================= */

let isRefreshing = false
let refreshSubscribers = []

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback)
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Nếu 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true

        try {
          const res = await axiosClient.post("/auth/refresh")

          const newAccessToken = res.data.data // tùy ApiResponse structure

          // Lưu access token mới vào zustand
          useAuthStore.setState({
            accessToken: newAccessToken,
          })

          isRefreshing = false
          onRefreshed(newAccessToken)
        } catch (refreshError) {
          isRefreshing = false

          // refresh fail → logout
          useAuthStore.getState().logout()
          return Promise.reject(refreshError)
        }
      }

      // Đợi refresh xong rồi retry request
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(axiosClient(originalRequest))
        })
      })
    }

    return Promise.reject(error)
  }
)

export default axiosClient