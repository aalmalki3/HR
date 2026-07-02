import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useI18n } from '../hooks/useI18n'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import StatCard from '../components/StatCard'
import RecentEmployees from '../components/RecentEmployees'
import LeaveStats from '../components/LeaveStats'
import { apiClient } from '../services/api'
import '../styles/dashboard.css'

interface DashboardStats {
  totalEmployees: number
  activeLeaves: number
  attendanceToday: number
  departments: number
  pendingLeaveRequests: number
  newApplications: number
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { t } = useI18n()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    fetchDashboardStats()
  }, [])
  
  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get('/dashboard/stats')
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
        <TopBar title={t('nav.dashboard')} user={user} />
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        {isLoading ? (
          <div className="spinner"></div>
        ) : stats ? (
          <>
            <div className="dashboard-grid">
              <StatCard
                label={t('dashboard.totalEmployees')}
                value={stats.totalEmployees}
                change="+12%"
                color="primary"
              />
              <StatCard
                label={t('dashboard.activeLeaves')}
                value={stats.activeLeaves}
                change="-5%"
                color="warning"
              />
              <StatCard
                label={t('dashboard.attendanceToday')}
                value={stats.attendanceToday}
                change="+2%"
                color="success"
              />
              <StatCard
                label={t('dashboard.departments')}
                value={stats.departments}
                change="0%"
                color="info"
              />
            </div>
            
            <div className="grid-2">
              <RecentEmployees />
              <LeaveStats />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
