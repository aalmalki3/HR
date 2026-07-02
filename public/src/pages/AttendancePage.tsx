import React, { useEffect, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import AttendanceCalendar from '../components/AttendanceCalendar'
import AttendanceRecords from '../components/AttendanceRecords'
import { apiClient } from '../services/api'
import { AttendanceRecord } from '../types'
import '../styles/attendance.css'

interface AttendanceStats {
  present: number
  absent: number
  leave: number
  halfDay: number
}

export default function AttendancePage() {
  const { t } = useI18n()
  const [month, setMonth] = useState(new Date())
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  
  useEffect(() => {
    fetchAttendanceData()
  }, [month, departmentFilter])
  
  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get('/attendance', {
        params: {
          month: month.getMonth() + 1,
          year: month.getFullYear(),
          department: departmentFilter !== 'all' ? departmentFilter : undefined,
        }
      })
      
      if (response.data.success) {
        setRecords(response.data.data)
        setStats(response.data.stats)
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleClockIn = async () => {
    try {
      const response = await apiClient.post('/attendance/clock-in', {
        timestamp: new Date(),
      })
      if (response.data.success) {
        fetchAttendanceData()
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }
  
  const handleClockOut = async () => {
    try {
      const response = await apiClient.post('/attendance/clock-out', {
        timestamp: new Date(),
      })
      if (response.data.success) {
        fetchAttendanceData()
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }
  
  return (
    <div className="dashboard">
      <Sidebar />
      
      <div className="main-content">
        <TopBar title={t('nav.attendance')} />
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <div className="attendance-header">
          <h2>{t('nav.attendance')}</h2>
          <div className="flex-center" style={{ gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleClockIn}>
              {t('attendance.clockIn')}
            </button>
            <button className="btn btn-secondary" onClick={handleClockOut}>
              {t('attendance.clockOut')}
            </button>
          </div>
        </div>
        
        <div className="attendance-filters">
          <div className="filter-group">
            <label>{t('attendance.month')}</label>
            <input
              type="month"
              value={`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`}
              onChange={(e) => {
                const [year, monthStr] = e.target.value.split('-')
                setMonth(new Date(parseInt(year), parseInt(monthStr) - 1))
              }}
            />
          </div>
          
          <div className="filter-group">
            <label>{t('attendance.department')}</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">{t('common.all')}</option>
              <option value="hr">{t('dept.hr')}</option>
              <option value="it">{t('dept.it')}</option>
              <option value="finance">{t('dept.finance')}</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <>
            {stats && (
              <div className="grid-4" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                  <div className="stat-label">{t('attendance.present')}</div>
                  <div className="stat-value" style={{ color: 'var(--color-success)' }}>
                    {stats.present}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">{t('attendance.absent')}</div>
                  <div className="stat-value" style={{ color: 'var(--color-danger)' }}>
                    {stats.absent}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">{t('attendance.leave')}</div>
                  <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
                    {stats.leave}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">{t('attendance.halfDay')}</div>
                  <div className="stat-value">{stats.halfDay}</div>
                </div>
              </div>
            )}
            
            <AttendanceCalendar month={month} records={records} />
            <AttendanceRecords records={records} />
          </>
        )}
      </div>
    </div>
  )
}
