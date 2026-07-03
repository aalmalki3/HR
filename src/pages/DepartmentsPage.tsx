import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useI18n } from '../hooks/useI18n'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { apiClient } from '../services/api'
import '../styles/departments.css'

interface Department {
  ID: string
  NameEn: string
  NameAr: string
  ParentDepartmentID: string
  ManagerID: string
  Budget: number
}

export default function DepartmentsPage() {
  const { t } = useI18n()
  const token = useAuthStore((state) => state.token)
  const [departments, setDepartments] = useState<Department[]>([])
  const [filteredDepts, setFilteredDepts] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    NameEn: '',
    NameAr: '',
    ParentDepartmentID: '',
    ManagerID: '',
    Budget: ''
  })

  useEffect(() => {
    fetchDepartments()
  }, [token])

  useEffect(() => {
    let filtered = departments
    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.NameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.NameAr.includes(searchTerm)
      )
    }
    setFilteredDepts(filtered)
  }, [departments, searchTerm])

  async function fetchDepartments() {
    try {
      setLoading(true)
      const response = await apiClient.post('/api/getDepartments', {
        action: 'getDepartments',
        token,
        data: {}
      })
      setDepartments(response.data.data || [])
      setError('')
    } catch (err: any) {
      setError('Failed to load departments')
    } finally {
      setLoading(false)
    }
  }

  function handleAddClick() {
    setEditingId(null)
    setFormData({ NameEn: '', NameAr: '', ParentDepartmentID: '', ManagerID: '', Budget: '' })
    setShowForm(true)
  }

  function handleEditClick(dept: Department) {
    setEditingId(dept.ID)
    setFormData({
      NameEn: dept.NameEn,
      NameAr: dept.NameAr,
      ParentDepartmentID: dept.ParentDepartmentID,
      ManagerID: dept.ManagerID,
      Budget: dept.Budget?.toString() || ''
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        await apiClient.post('/api/updateDepartment', {
          action: 'updateDepartment',
          token,
          data: { ID: editingId, ...formData }
        })
      } else {
        await apiClient.post('/api/addDepartment', {
          action: 'addDepartment',
          token,
          data: formData
        })
      }
      await fetchDepartments()
      setShowForm(false)
      setError('')
    } catch (err: any) {
      setError('Failed to save department')
    }
  }

  async function handleDelete(deptId: string) {
    if (!confirm('Delete this department?')) return
    try {
      await apiClient.post('/api/deleteDepartment', {
        action: 'deleteDepartment',
        token,
        data: { ID: deptId }
      })
      await fetchDepartments()
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete department')
    }
  }

  const getParentName = (parentId: string) => {
    if (!parentId) return '-'
    const parent = departments.find(d => d.ID === parentId)
    return parent ? parent.NameEn : parentId
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <TopBar title={t('nav.departments', 'Departments')} />

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="dept-toolbar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={handleAddClick} className="btn btn-primary">
            Add Department
          </button>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="dept-table-container">
            <table className="dept-table">
              <thead>
                <tr>
                  <th>Name (EN)</th>
                  <th>Name (AR)</th>
                  <th>Parent Dept</th>
                  <th>Manager</th>
                  <th>Budget</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepts.map((dept) => (
                  <tr key={dept.ID}>
                    <td>{dept.NameEn}</td>
                    <td>{dept.NameAr}</td>
                    <td>{getParentName(dept.ParentDepartmentID)}</td>
                    <td>{dept.ManagerID || '-'}</td>
                    <td>{dept.Budget || 0}</td>
                    <td>
                      <button onClick={() => handleEditClick(dept)} className="btn-small">Edit</button>
                      <button onClick={() => handleDelete(dept.ID)} className="btn-small btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{editingId ? 'Edit Department' : 'Add Department'}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Department Name (English)"
                  value={formData.NameEn}
                  onChange={(e) => setFormData({ ...formData, NameEn: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="اسم القسم (عربي)"
                  value={formData.NameAr}
                  onChange={(e) => setFormData({ ...formData, NameAr: e.target.value })}
                  required
                />
                <select
                  value={formData.ParentDepartmentID}
                  onChange={(e) => setFormData({ ...formData, ParentDepartmentID: e.target.value })}
                >
                  <option value="">No Parent (Top Level)</option>
                  {departments.filter(d => d.ID !== editingId).map(d => (
                    <option key={d.ID} value={d.ID}>{d.NameEn}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Manager ID (optional)"
                  value={formData.ManagerID}
                  onChange={(e) => setFormData({ ...formData, ManagerID: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Budget (optional)"
                  value={formData.Budget}
                  onChange={(e) => setFormData({ ...formData, Budget: e.target.value })}
                />
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
