import React from 'react'
import { useI18n } from '../hooks/useI18n'
import { LeaveRequest } from '../types'

interface LeaveHistoryProps {
  requests: LeaveRequest[]
}

export default function LeaveHistory({ requests }: LeaveHistoryProps) {
  const { t } = useI18n()

  if (requests.length === 0) {
    return <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
      {t('common.all')}: 0
    </div>
  }

  return (
    <div className="leave-list">
      {requests.map((req) => (
        <div key={req.id} className="leave-item">
          <div className="leave-info">
            <h4>{req.startDate} → {req.endDate}</h4>
            <div className="leave-meta">
              <span>{req.days} {t('leave.days')}</span>
              <span>{req.notes}</span>
            </div>
          </div>
          <span className={`leave-status status-${req.status}`}>
            {t(`leave.${req.status}`)}
          </span>
        </div>
      ))}
    </div>
  )
}
