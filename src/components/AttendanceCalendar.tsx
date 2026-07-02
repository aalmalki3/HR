import React from 'react'
import { useI18n } from '../hooks/useI18n'
import { AttendanceRecord } from '../types'

interface AttendanceCalendarProps {
  month: Date
  records: AttendanceRecord[]
}

export default function AttendanceCalendar({ month, records }: AttendanceCalendarProps) {
  const { t } = useI18n()

  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay()

  const getStatusForDay = (day: number): string => {
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const record = records.find(r => r.date === dateStr)
    return record ? record.status : ''
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i)

  return (
    <div className="attendance-calendar">
      <div className="calendar-header">
        <h3>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
      </div>
      <div className="calendar-grid">
        {blanks.map((b) => (
          <div key={`blank-${b}`} />
        ))}
        {days.map((day) => {
          const status = getStatusForDay(day)
          return (
            <div key={day} className={`calendar-day ${status}`}>
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}
