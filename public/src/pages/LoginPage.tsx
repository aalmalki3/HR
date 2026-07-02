import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useI18n } from '../hooks/useI18n'
import { apiClient } from '../services/api'
import '../styles/login.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { t, toggleLanguage, currentLanguage } = useI18n()
  const { setUser, setToken } = useAuthStore()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const response = await apiClient.post('/login', {
        username,
        password,
      })
      
      if (response.data.success) {
        setToken(response.data.token)
        setUser(response.data.user)
        navigate('/')
      } else {
        setError(response.data.error || t('auth.loginFailed'))
      }
    } catch (err: any) {
      setError(err.response?.data?.error || t('auth.connectionError'))
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="login-page">
      <div className="language-toggle">
        <button
          className={`language-btn ${currentLanguage === 'en' ? 'active' : ''}`}
          onClick={() => toggleLanguage()}
        >
          EN
        </button>
        <button
          className={`language-btn ${currentLanguage === 'ar' ? 'active' : ''}`}
          onClick={() => toggleLanguage()}
        >
          AR
        </button>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>{t('auth.title')}</h1>
            <p>{t('auth.subtitle')}</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">{t('auth.username')}</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('auth.usernamePlaceholder')}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">{t('auth.password')}</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              className="login-btn"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? t('auth.logging') : t('auth.login')}
            </button>
          </form>
          
          <div className="login-footer">
            <p>{t('auth.testCredentials')}</p>
            <p>Admin: admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
