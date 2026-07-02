import React, { useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { LeaveType, LeaveRequest } from '../types'

interface LeaveRequestFormProps {
  leaveTypes: LeaveType[]
  onSubmit: (request: LeaveRequest) => Promise<void>
}

export default function LeaveRequestForm({ leaveTypes, onSubmit }: LeaveRequestFormProps) {
  const { t } = useI18n()
  const [leaveTypeId, setLeaveTypeId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateDays = (): number => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return diff > 0 ? diff : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const request: Partial<LeaveRequest> = {
      leaveTypeId,
      startDate,
      endDate,
      days: calculateDays(),
      notes,
    }

    try {
      await onSubmit(request as LeaveRequest)
      setLeaveTypeId('')
      setStartDate('')
      setEndDate('')
      setNotes('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="leave-form card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('leave.leaveType')}</label>
          <select
            value={leaveTypeId}
            onChange={(e) => setLeaveTypeId(e.target.value)}
            required
          >
            <option value="">--</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>{t('leave.startDate')}</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('leave.endDate')}</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>{t('leave.days')}: {calculateDays()}</label>
        </div>

        <div className="form-group">
          <label>{t('leave.reason')}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('leave.submitRequest')}
        </button>
      </form>
    </div>
  )
}
