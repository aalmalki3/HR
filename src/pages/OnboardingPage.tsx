import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useI18n } from '../hooks/useI18n'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { apiClient } from '../services/api'
import '../styles/onboarding.css'

interface OnboardingTask {
  ID: string
  EmployeeID: string
  CategoryEn: string
  CategoryAr: string
  TaskEn: string
  TaskAr: string
  DueDate: string
  IsCompleted: string
  CompletedDate: string
}

export default function OnboardingPage() {
  const { t } = useI18n()
  const token = useAuthStore((state) => state.token)
  const [tasks, setTasks] = useState<OnboardingTask[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newTasks, setNewTasks] = useState([{ TaskEn: '', TaskAr: '' }])

  useEffect(() => {
    if (selectedEmployee) {
      fetchTasks()
    }
  }, [token, selectedEmployee])

  async function fetchTasks() {
    try {
      setLoading(true)
      const response = await apiClient.post('/api/getOnboardingTasks', {
        action: 'getOnboardingTasks',
        token,
        data: { employeeId: selectedEmployee }
      })
      setTasks(response.data.data || [])

      const progResponse = await apiClient.post('/api/getOnboardingProgress', {
        action: 'getOnboardingProgress',
        token,
        data: { EmployeeID: selectedEmployee }
      })
      setProgress(progResponse.data.data.percentage || 0)
      setError('')
    } catch (err: any) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  async function handleCompleteTask(taskId: string) {
    try {
      await apiClient.post('/api/completeOnboardingTask', {
        action: 'completeOnboardingTask',
        token,
        data: { TaskID: taskId }
      })
      await fetchTasks()
    } catch (err: any) {
      setError('Failed to complete task')
    }
  }

  async function handleCreateChecklist() {
    const validTasks = newTasks.filter(t => t.TaskEn)
    if (validTasks.length === 0 || !selectedEmployee) return

    try {
      await apiClient.post('/api/createOnboardingChecklist', {
        action: 'createOnboardingChecklist',
        token,
        data: {
          EmployeeID: selectedEmployee,
          CategoryEn: 'Onboarding',
          CategoryAr: 'إدراج الموظفين الجدد',
          tasks: validTasks
        }
      })
      await fetchTasks()
      setNewTasks([{ TaskEn: '', TaskAr: '' }])
      setError('')
    } catch (err: any) {
      setError('Failed to create checklist')
    }
  }

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.CategoryEn]) acc[task.CategoryEn] = []
    acc[task.CategoryEn].push(task)
    return acc
  }, {} as Record<string, OnboardingTask[]>)

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <TopBar title={t('nav.onboarding') || 'Onboarding'} />

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="ob-toolbar">
          <input
            type="text"
            placeholder="Employee ID"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="search-input"
          />
        </div>

        {selectedEmployee && (
          <>
            <div className="ob-progress-bar">
              <div className="ob-progress-text">{progress}% Complete</div>
              <div className="ob-progress-track">
                <div className="ob-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="ob-task-creation">
              <h3>Add Tasks</h3>
              {newTasks.map((task, idx) => (
                <div key={idx} className="ob-task-input-row">
                  <input
                    type="text"
                    placeholder="Task (EN)"
                    value={task.TaskEn}
                    onChange={(e) => {
                      const updated = [...newTasks]
                      updated[idx].TaskEn = e.target.value
                      setNewTasks(updated)
                    }}
                  />
                  <input
                    type="text"
                    placeholder="مهمة (AR)"
                    value={task.TaskAr}
                    onChange={(e) => {
                      const updated = [...newTasks]
                      updated[idx].TaskAr = e.target.value
                      setNewTasks(updated)
                    }}
                  />
                </div>
              ))}
              <div className="ob-task-actions">
                <button onClick={() => setNewTasks([...newTasks, { TaskEn: '', TaskAr: '' }])} className="btn-small">
                  + Add Task
                </button>
                <button onClick={handleCreateChecklist} className="btn btn-primary">
                  Create Checklist
                </button>
              </div>
            </div>

            {loading ? (
              <div className="spinner"></div>
            ) : (
              <div className="ob-tasks-container">
                {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                  <div key={category} className="ob-category-section">
                    <h3>{category}</h3>
                    <ul>
                      {categoryTasks.map(task => (
                        <li key={task.ID} className={task.IsCompleted === 'true' ? 'completed' : ''}>
                          <input
                            type="checkbox"
                            checked={task.IsCompleted === 'true'}
                            onChange={() => handleCompleteTask(task.ID)}
                          />
                          <span className="task-en">{task.TaskEn}</span>
                          <span className="task-ar">{task.TaskAr}</span>
                          <span className="task-due">{task.DueDate}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="ob-empty">No onboarding tasks yet for this employee.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
