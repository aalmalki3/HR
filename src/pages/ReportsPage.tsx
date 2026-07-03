import React, { useEffect, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import EmployeeReport from '../components/EmployeeReport'
import LeaveReport from '../components/LeaveReport'
import AttendanceReport from '../components/AttendanceReport'
import { apiClient } from '../services/api'

interface ReportData {
  employees: any[]
  leaves: any[]
  attendance: any[]
}

export default function ReportsPage() {
  const { t } = useI18n()
  const [activeReport, setActiveReport] = useState<'employees' | 'leaves' | 'attendance'>('employees')
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  
  useEffect(() => {
    fetchReportData()
  }, [activeReport, dateFrom, dateTo])
  
  const fetchReportData = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get('/reports', {
        params: {
          type: activeReport,
          from: dateFrom,
          to: dateTo,
        }
      })
      
      if (response.data.success) {
        setReportData(response.data.data)
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleExportPDF = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.post('/api/exportReportPDF', {
        action: 'exportReportPDF',
        token: localStorage.getItem('token') || '',
        data: {
          reportType: activeReport,
          fileName: `Report_${activeReport}_${new Date().toISOString().split('T')[0]}.csv`
        }
      })
      
      if (response.data.data?.data) {
        const blob = new Blob([response.data.data.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = response.data.data.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
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
        <TopBar title={t('nav.reports')} />
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <div className="flex-between" style={{ marginBottom: '2rem' }}>
          <h2>{t('nav.reports')}</h2>
          <button className="btn btn-primary" onClick={handleExportPDF}>
            {t('common.export')} PDF
          </button>
        </div>
        
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="leave-tabs">
            <button
              className={`tab-button ${activeReport === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveReport('employees')}
            >
              {t('nav.employees')}
            </button>
            <button
              className={`tab-button ${activeReport === 'leaves' ? 'active' : ''}`}
              onClick={() => setActiveReport('leaves')}
            >
              {t('nav.leave')}
            </button>
            <button
              className={`tab-button ${activeReport === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveReport('attendance')}
            >
              {t('nav.attendance')}
            </button>
          </div>
          
          <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder={t('common.from')}
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder={t('common.to')}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="spinner"></div>
        ) : reportData ? (
          <>
            {activeReport === 'employees' && <EmployeeReport data={reportData.employees} />}
            {activeReport === 'leaves' && <LeaveReport data={reportData.leaves} />}
            {activeReport === 'attendance' && <AttendanceReport data={reportData.attendance} />}
          </>
        ) : null}
      </div>
    </div>
  )
}
