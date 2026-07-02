import axios, { AxiosResponse } from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  'https://script.google.com/macros/s/AKfycbz9aDmtPoAtt1CoBU7tCf7hBaUMY1gv8l0QrXnHDLsJ5WNphDSKXTnXnD05wHDTan_V/exec'

const rawClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'text/plain;charset=utf-8',
  },
})

// Core: always POST to the bare GAS URL with an action name
async function callAction(action: string, data: any = {}): Promise<AxiosResponse> {
  const token = useAuthStore.getState().token
  const response = await rawClient.post('', { action, token, data })

  if (response.data?.success === false && response.data?.error === 'Invalid token') {
  useAuthStore.getState().logout()
}

  return response
}

function parseUrl(url: string): { resource: string; id?: string } {
  const path = url.split('?')[0]
  const parts = path.replace(/^\//, '').split('/')
  return { resource: parts[0], id: parts[1] }
}

export const apiClient = {
  async get(url: string, config: any = {}): Promise<AxiosResponse> {
    const { resource, id } = parseUrl(url)
    const params = config.params || {}

    if (url.startsWith('/dashboard/stats')) return callAction('getDashboardStats')
    if (url.startsWith('/employees')) return callAction('getEmployees')
    if (/^\/leave\/stats/.test(url)) return callAction('getLeaveStats')
    if (/^\/leave\//.test(url)) return callAction('getLeaveData', { employeeId: id })
    if (url.startsWith('/attendance')) return callAction('getAttendance', params)
    if (url.startsWith('/reports/export')) return callAction('exportReport', { type: id, ...params })
    if (url.startsWith('/reports')) return callAction('getReports', params)
    if (url.startsWith('/settings')) return callAction('getSettings')

    return callAction(resource, params)
  },

  async post(url: string, data: any = {}): Promise<AxiosResponse> {
    if (url === '/login') return callAction('login', data)
    if (url === '/employees') return callAction('createEmployee', data)
    if (url === '/leave/request') return callAction('createLeaveRequest', data)
    if (url === '/attendance/clock-in') return callAction('clockIn', data)
    if (url === '/attendance/clock-out') return callAction('clockOut', data)

    return callAction(parseUrl(url).resource, data)
  },

  async put(url: string, data: any = {}): Promise<AxiosResponse> {
    const { resource, id } = parseUrl(url)
    if (resource === 'employees') return callAction('updateEmployee', { ...data, id })
    if (resource === 'settings') return callAction('updateSettings', data)
    return callAction(`update${resource}`, { ...data, id })
  },

  async delete(url: string): Promise<AxiosResponse> {
    const { resource, id } = parseUrl(url)
    if (resource === 'employees') return callAction('deleteEmployee', { id })
    return callAction(`delete${resource}`, { id })
  },
}
