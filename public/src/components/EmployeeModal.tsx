import React, { useState, useEffect } from 'react'
import { Employee } from '../types'
import { useI18n } from '../hooks/useI18n'

interface EmployeeModalProps {
  employee: Employee | null
  onClose: () => void
  onSave: (employee: Employee) => Promise<void>
}

export default function EmployeeModal({ employee, onClose, onSave }: EmployeeModalProps) {
  const { t } = useI18n()
  const [formData, setFormData] = useState<Employee>(
    employee || {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      firstNameAr: '',
      lastNameAr: '',
      dob: '',
      nationality: '',
      passportNumber: '',
      iqamaNumber: '',
      visaStatus: '',
      maritalStatus: '',
      dependents: 0,
      departmentId: '',
      positionId: '',
      managerId: '',
      hireDate: '',
      employmentType: 'full_time',
      salary: 0,
      bankAccount: '',
      phone: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    }
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      await onSave(formData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="employee-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{employee ? t('common.edit') : t('common.add')} {t('nav.employees')}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>{t('employee.firstName')}</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>{t('employee.lastName')}</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>{t('employee.firstNameAr')}</label>
              <input
                type="text"
                name="firstNameAr"
                value={formData.firstNameAr}
                onChange={handleChange}
                dir="rtl"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>{t('employee.lastNameAr')}</label>
              <input
                type="text"
                name="lastNameAr"
                value={formData.lastNameAr}
                onChange={handleChange}
                dir="rtl"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>{t('employee.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>{t('employee.phone')}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>{t('employee.dob')}</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>{t('employee.hireDate')}</label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>{t('employee.salary')}</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>{t('employee.employmentType')}</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="full_time">{t('employee.fullTime')}</option>
                <option value="part_time">{t('employee.partTime')}</option>
                <option value="contract">{t('employee.contract')}</option>
              </select>
            </div>
            
            <div className="form-group full">
              <label>{t('employee.emergencyContactName')}</label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? t('common.saving') : t('common.save')}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
