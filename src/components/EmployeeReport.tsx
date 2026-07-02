import React from 'react'
import { useI18n } from '../hooks/useI18n'

interface EmployeeReportProps {
  data: any[]
}

export default function EmployeeReport({ data }: EmployeeReportProps) {
  const { t } = useI18n()

  return (
    <div className="card">
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>{t('employee.name')}</th>
              <th>{t('employee.email')}</th>
              <th>{t('employee.position')}</th>
              <th>{t('employee.hireDate')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.firstName} {row.lastName}</td>
                <td>{row.email}</td>
                <td>{row.positionId}</td>
                <td>{row.hireDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
