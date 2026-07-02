import React from 'react'
import { useI18n } from '../hooks/useI18n'

interface AttendanceReportProps {
  data: any[]
}

export default function AttendanceReport({ data }: AttendanceReportProps) {
  const { t } = useI18n()

  return (
    <div className="card">
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>{t('employee.name')}</th>
              <th>{t('attendance.month')}</th>
              <th>{t('attendance.present')}</th>
              <th>{t('attendance.absent')}</th>
              <th>{t('attendance.leave')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.employeeName}</td>
                <td>{row.month}</td>
                <td>{row.present}</td>
                <td>{row.absent}</td>
                <td>{row.leave}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
