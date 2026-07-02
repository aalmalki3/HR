import React from 'react'
import { useI18n } from '../hooks/useI18n'
import { AttendanceRecord } from '../types'

interface AttendanceRecordsProps {
  records: AttendanceRecord[]
}

export default function AttendanceRecords({ records }: AttendanceRecordsProps) {
  const { t } = useI18n()

  return (
    <div className="attendance-records">
      {records.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          {t('common.all')}: 0
        </div>
      ) : (
        records.map((record) => (
          <div key={record.id} className="record-row">
            <span>{record.date}</span>
            <span>{record.clockIn || '--'}</span>
            <span>{record.clockOut || '--'}</span>
            <span className={`leave-status status-${record.status === 'present' ? 'approved' : 'pending'}`}>
              {t(`attendance.${record.status}`)}
            </span>
          </div>
        ))
      )}
    </div>
  )
}
