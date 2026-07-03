import React, { useState, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import { useAuthStore } from '../store/authStore'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { apiClient } from '../services/api'
import '../styles/dashboard.css'

interface DashboardStats {
  totalEmployees: number
  activeLeaves: number
  attendanceToday: number
  departments: number
  pendingLeaveRequests: number
}

export default function DashboardPage() {
  const { t } = useI18n()
  const token = useAuthStore((state) => state.token)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [token])

  async function fetchStats() {
    try {
      setIsLoading(true)
      const response = await apiClient.post('/api/getDashboardStats', {
        action: 'getDashboardStats',
        token,
        data: {}
      })
      if (response.data.success) {
        setStats(response.data.data)
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <TopBar title={t('nav.dashboard')} />

        {error && <div className="alert alert-danger">{error}</div>}

        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-label">{t('dashboard.totalEmployees', 'Total Employees')}</div>
              <div className="stat-value">{stats?.totalEmployees ?? '--'}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">{t('dashboard.activeLeaves', 'Active Leaves')}</div>
              <div className="stat-value">{stats?.activeLeaves ?? '--'}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">{t('dashboard.attendanceToday', 'Present Today')}</div>
              <div className="stat-value">{stats?.attendanceToday ?? '--'}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">{t('dashboard.departments', 'Departments')}</div>
              <div className="stat-value">{stats?.departments ?? '--'}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">{t('dashboard.pendingLeaveRequests', 'Pending Leave Requests')}</div>
              <div className="stat-value">{stats?.pendingLeaveRequests ?? '--'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
