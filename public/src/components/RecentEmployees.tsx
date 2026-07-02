import React, { useEffect, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { apiClient } from '../services/api'
import { Employee } from '../types'

export default function RecentEmployees() {
  const { t } = useI18n()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetchRecentEmployees()
  }, [])
  
  const fetchRecentEmployees = async () => {
    try {
      const response = await apiClient.get('/employees?limit=5')
      if (response.data.success) {
        setEmployees(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching employees:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="card">
      <div className="card-header">
        <h3>{t('dashboard.recentEmployees')}</h3>
      </div>
      
      <div className="card-body" style={{ padding: '1rem' }}>
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>{t('employee.name')}</th>
                <th>{t('employee.email')}</th>
                <th>{t('employee.hireDate')}</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.firstName} {emp.lastName}</td>
                  <td>{emp.email}</td>
                  <td>{new Date(emp.hireDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
