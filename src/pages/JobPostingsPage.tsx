import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useI18n } from '../hooks/useI18n'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { apiClient } from '../services/api'
import '../styles/job-postings.css'

interface JobPosting {
  ID: string
  TitleEn: string
  TitleAr: string
  DescriptionEn: string
  DescriptionAr: string
  DepartmentID: string
  SalaryMin: number
  SalaryMax: number
  Status: string
  PostedDate: string
}

export default function JobPostingsPage() {
  const { t } = useI18n()
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const [postings, setPostings] = useState<JobPosting[]>([])
  const [filteredPostings, setFilteredPostings] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('open')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    TitleEn: '',
    TitleAr: '',
    DescriptionEn: '',
    DescriptionAr: '',
    DepartmentID: '',
    SalaryMin: '',
    SalaryMax: '',
    SalaryType: 'Monthly'
  })

  useEffect(() => {
    fetchPostings()
  }, [token])

  useEffect(() => {
    let filtered = postings.filter(p => p.Status === statusFilter)
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.TitleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.TitleAr.includes(searchTerm)
      )
    }
    setFilteredPostings(filtered)
  }, [postings, searchTerm, statusFilter])

  async function fetchPostings() {
    try {
      setLoading(true)
      const response = await apiClient.post('/api/getJobPostings', {
        action: 'getJobPostings',
        token,
        data: {}
      })
      setPostings(response.data.data || [])
      setError('')
    } catch (err: any) {
      setError('Failed to load job postings')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await apiClient.post('/api/addJobPosting', {
        action: 'addJobPosting',
        token,
        data: formData
      })
      await fetchPostings()
      setShowForm(false)
      setFormData({
        TitleEn: '', TitleAr: '', DescriptionEn: '', DescriptionAr: '',
        DepartmentID: '', SalaryMin: '', SalaryMax: '', SalaryType: 'Monthly'
      })
      setError('')
    } catch (err: any) {
      setError('Failed to create posting')
    }
  }

  async function handleClose(postingId: string) {
    if (!confirm('Close this posting?')) return
    try {
      await apiClient.post('/api/closeJobPosting', {
        action: 'closeJobPosting',
        token,
        data: { ID: postingId }
      })
      await fetchPostings()
    } catch (err: any) {
      setError('Failed to close posting')
    }
  }

  const isAdmin = user?.role === 'hr_admin'

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <TopBar title={t('nav.jobPostings') || 'Job Postings'} />

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="jp-toolbar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          {isAdmin && (
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Add Job
            </button>
          )}
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : isAdmin ? (
          <div className="jp-table-container">
            <table className="jp-table">
              <thead>
                <tr>
                  <th>Title (EN)</th>
                  <th>Department</th>
                  <th>Salary Range</th>
                  <th>Posted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPostings.map(posting => (
                  <tr key={posting.ID}>
                    <td>{posting.TitleEn}</td>
                    <td>{posting.DepartmentID}</td>
                    <td>{posting.SalaryMin}-{posting.SalaryMax}</td>
                    <td>{posting.PostedDate}</td>
                    <td>{posting.Status}</td>
                    <td>
                      {posting.Status === 'open' && (
                        <button onClick={() => handleClose(posting.ID)} className="btn-small">Close</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="jp-grid">
            {filteredPostings.map(posting => (
              <div key={posting.ID} className="jp-card">
                <h3>{posting.TitleEn}</h3>
                <p className="ar-title">{posting.TitleAr}</p>
                <p className="description">{posting.DescriptionEn}</p>
                {posting.SalaryMin ? (
                  <p className="salary">{posting.SalaryMin} - {posting.SalaryMax} SAR</p>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add Job Posting</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Job Title (English)"
                  value={formData.TitleEn}
                  onChange={(e) => setFormData({ ...formData, TitleEn: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="عنوان الوظيفة (عربي)"
                  value={formData.TitleAr}
                  onChange={(e) => setFormData({ ...formData, TitleAr: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description (English)"
                  value={formData.DescriptionEn}
                  onChange={(e) => setFormData({ ...formData, DescriptionEn: e.target.value })}
                />
                <textarea
                  placeholder="الوصف (عربي)"
                  value={formData.DescriptionAr}
                  onChange={(e) => setFormData({ ...formData, DescriptionAr: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Department ID"
                  value={formData.DepartmentID}
                  onChange={(e) => setFormData({ ...formData, DepartmentID: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Salary Min"
                  value={formData.SalaryMin}
                  onChange={(e) => setFormData({ ...formData, SalaryMin: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Salary Max"
                  value={formData.SalaryMax}
                  onChange={(e) => setFormData({ ...formData, SalaryMax: e.target.value })}
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
