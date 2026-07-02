import React, { useEffect, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { useAuthStore } from '../store/authStore'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import LeaveRequestForm from '../components/LeaveRequestForm'
import LeaveHistory from '../components/LeaveHistory'
import LeaveBalance from '../components/LeaveBalance'
import { apiClient } from '../services/api'
import { LeaveRequest, LeaveType } from '../types'
import '../styles/leave.css'

interface LeaveData {
  balance: {
    [key: string]: number
  }
  requests: LeaveRequest[]
  leaveTypes: LeaveType[]
}

export default function LeavePage() {
  const { t } = useI18n()
  const user = useAuthStore((state) => state.user)
  const [activeTab, setActiveTab] = useState<'request' | 'history' | 'balance'>('request')
  const [leaveData, setLeaveData] = useState<LeaveData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    fetchLeaveData()
  }, [])
  
  const fetchLeaveData = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(`/leave/${user?.id}`)
      if (response.data.success) {
        setLeaveData(response.data.data)
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleLeaveSubmit = async (leaveRequest: LeaveRequest) => {
    try {
      const response = await apiClient.post('/leave/request', leaveRequest)
      if (response.data.success) {
        fetchLeaveData()
        setError('')
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
        <TopBar title={t('nav.leave')} user={user} />
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <div className="leave-tabs">
          <button
            className={`tab-button ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveTab('request')}
          >
            {t('leave.request')}
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            {t('leave.history')}
          </button>
          <button
            className={`tab-button ${activeTab === 'balance' ? 'active' : ''}`}
            onClick={() => setActiveTab('balance')}
          >
            {t('leave.balance')}
          </button>
        </div>
        
        {isLoading ? (
          <div className="spinner"></div>
        ) : leaveData ? (
          <>
            {activeTab === 'request' && (
              <LeaveRequestForm
                leaveTypes={leaveData.leaveTypes}
                onSubmit={handleLeaveSubmit}
              />
            )}
            
            {activeTab === 'history' && (
              <LeaveHistory requests={leaveData.requests} />
            )}
            
            {activeTab === 'balance' && (
              <LeaveBalance balance={leaveData.balance} leaveTypes={leaveData.leaveTypes} />
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
