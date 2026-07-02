import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://script.google.com/macros/s/AKfycbwt-2Bdu0cgnB1z3ev0U5pbd1pPSSNp7u2q77m4N9Us_VKNvNuNNTdzbkbr0MebTWSU/exec'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'text/plain;charset=utf-8',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
  useAuthStore.getState().logout()
  window.location.href = '/HR/login'
}
    return Promise.reject(error)
  }
)

export const apiClient = axiosInstance
