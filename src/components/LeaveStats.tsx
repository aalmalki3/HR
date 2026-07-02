import React, { useEffect, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { apiClient } from '../services/api'

interface LeaveStatsData {
  pending: number
  approved: number
  rejected: number
  total: number
}

export default function LeaveStats() {
  const { t } = useI18n()
  const [stats, setStats] = useState<LeaveStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetchLeaveStats()
  }, [])
  
  const fetchLeaveStats = async () => {
    try {
      const response = await apiClient.get('/leave/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching leave stats:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="card">
      <div className="card-header">
        <h3>{t('dashboard.leaveStats')}</h3>
      </div>
      
      <div className="card-body" style={{ padding: '1.5rem' }}>
        {isLoading ? (
          <div className="spinner"></div>
        ) : stats ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {t('leave.pending')}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ea580c' }}>
                {stats.pending}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {t('leave.approved')}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#16a34a' }}>
                {stats.approved}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {t('leave.rejected')}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#dc2626' }}>
                {stats.rejected}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {t('leave.total')}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2563eb' }}>
                {stats.total}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
