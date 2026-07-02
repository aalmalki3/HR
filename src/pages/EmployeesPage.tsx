import React, { useEffect, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import EmployeeModal from '../components/EmployeeModal'
import { apiClient } from '../services/api'
import { Employee } from '../types'
import '../styles/employees.css'

export default function EmployeesPage() {
  const { t } = useI18n()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  
  useEffect(() => {
    fetchEmployees()
  }, [])
  
  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get('/employees')
      if (response.data.success) {
        setEmployees(response.data.data)
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setShowModal(true)
  }
  
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowModal(true)
  }
  
  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm(t('common.confirmDelete'))) return
    
    try {
      const response = await apiClient.delete(`/employees/${id}`)
      if (response.data.success) {
        setEmployees(employees.filter(e => e.id !== id))
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }
  
  const handleSaveEmployee = async (employee: Employee) => {
    try {
      const url = employee.id ? `/employees/${employee.id}` : '/employees'
      const method = employee.id ? 'put' : 'post'
      
      const response = await apiClient[method](url, employee)
      if (response.data.success) {
        if (employee.id) {
          setEmployees(employees.map(e => e.id === employee.id ? response.data.data : e))
        } else {
          setEmployees([...employees, response.data.data])
        }
        setShowModal(false)
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }
  
  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="dashboard">
      <Sidebar />
      
      <div className="main-content">
        <TopBar title={t('nav.employees')} />
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <div className="employees-header">
          <h2>{t('nav.employees')}</h2>
          <div className="employees-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleAddEmployee}>
              {t('common.add')} {t('nav.employees')}
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <div className="employees-table">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>{t('employee.firstName')}</th>
                    <th>{t('employee.lastName')}</th>
                    <th>{t('employee.email')}</th>
                    <th>{t('employee.position')}</th>
                    <th>{t('employee.hireDate')}</th>
                    <th>{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.firstName}</td>
                      <td>{employee.lastName}</td>
                      <td>{employee.email}</td>
                      <td>{employee.positionId}</td>
                      <td>{new Date(employee.hireDate).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            {t('common.edit')}
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            {t('common.delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {showModal && (
          <EmployeeModal
            employee={selectedEmployee}
            onClose={() => setShowModal(false)}
            onSave={handleSaveEmployee}
          />
        )}
      </div>
    </div>
  )
}
