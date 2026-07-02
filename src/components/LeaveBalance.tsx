import React from 'react'
import { useI18n } from '../hooks/useI18n'
import { LeaveType } from '../types'

interface LeaveBalanceProps {
  balance: { [key: string]: number }
  leaveTypes: LeaveType[]
}

export default function LeaveBalance({ balance, leaveTypes }: LeaveBalanceProps) {
  const { t } = useI18n()

  return (
    <div className="grid-3">
      {leaveTypes.map((type) => (
        <div key={type.id} className="stat-card">
          <div className="stat-label">{type.nameEn}</div>
          <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
            {balance[type.id] ?? 0}
          </div>
          <div className="stat-change">{t('leave.days')} {t('leave.balance')}</div>
        </div>
      ))}
    </div>
  )
}
