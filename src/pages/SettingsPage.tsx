import React, { useEffect, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { apiClient } from '../services/api'
import { SystemSettings } from '../types'

export default function SettingsPage() {
  const { t, toggleLanguage } = useI18n()
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  useEffect(() => {
    fetchSettings()
    setIsDarkMode(document.body.classList.contains('dark'))
  }, [])
  
  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get('/settings')
      if (response.data.success) {
        setSettings(response.data.data)
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSettingChange = (key: keyof SystemSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [key]: value })
    }
  }
  
  const handleSaveSettings = async () => {
    try {
      const response = await apiClient.put('/settings', settings)
      if (response.data.success) {
        setSuccess(t('settings.saved'))
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }
  
  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    document.body.classList.toggle('dark')
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
  }
  
  return (
    <div className="dashboard">
      <Sidebar />
      
      <div className="main-content">
        <TopBar title={t('nav.settings')} />
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="card">
          <div className="card-header">
            <h2>{t('settings.general')}</h2>
          </div>
          
          {isLoading ? (
            <div className="spinner"></div>
          ) : settings ? (
            <div className="card-body" style={{ padding: '1.5rem' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label>{t('settings.companyNameEn')}</label>
                  <input
                    type="text"
                    value={settings.companyNameEn}
                    onChange={(e) => handleSettingChange('companyNameEn', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('settings.companyNameAr')}</label>
                  <input
                    type="text"
                    value={settings.companyNameAr}
                    onChange={(e) => handleSettingChange('companyNameAr', e.target.value)}
                    dir="rtl"
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('settings.hrEmail')}</label>
                  <input
                    type="email"
                    value={settings.hrEmail}
                    onChange={(e) => handleSettingChange('hrEmail', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('settings.hrPhone')}</label>
                  <input
                    type="tel"
                    value={settings.hrPhone}
                    onChange={(e) => handleSettingChange('hrPhone', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>{t('settings.addressEn')}</label>
                <input
                  type="text"
                  value={settings.addressEn}
                  onChange={(e) => handleSettingChange('addressEn', e.target.value)}
                />
              </div>
            </div>
          ) : null}
        </div>
        
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h2>{t('settings.appearance')}</h2>
          </div>
          
          <div className="card-body" style={{ padding: '1.5rem' }}>
            <div className="form-group">
              <label style={{ marginBottom: '1rem' }}>{t('settings.theme')}</label>
              <button
                className={`btn ${isDarkMode ? 'btn-primary' : 'btn-secondary'}`}
                onClick={toggleTheme}
              >
                {isDarkMode ? t('settings.darkMode') : t('settings.lightMode')}
              </button>
            </div>
            
            <div className="form-group">
              <label>{t('settings.language')}</label>
              <button
                className="btn btn-secondary"
                onClick={toggleLanguage}
              >
                {t('settings.toggleLanguage')}
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <button className="btn btn-primary btn-lg" onClick={handleSaveSettings}>
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
