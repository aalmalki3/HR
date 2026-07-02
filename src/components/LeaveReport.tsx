import React from 'react'
import { useI18n } from '../hooks/useI18n'

interface LeaveReportProps {
  data: any[]
}

export default function LeaveReport({ data }: LeaveReportProps) {
  const { t } = useI18n()

  return (
    <div className="card">
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>{t('employee.name')}</th>
              <th>{t('leave.leaveType')}</th>
              <th>{t('leave.startDate')}</th>
              <th>{t('leave.endDate')}</th>
              <th>{t('attendance.status')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.employeeName}</td>
                <td>{row.leaveTypeName}</td>
                <td>{row.startDate}</td>
                <td>{row.endDate}</td>
                <td>
                  <span className={`leave-status status-${row.status}`}>
                    {t(`leave.${row.status}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
