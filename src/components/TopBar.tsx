import React from 'react'
import { User } from '../types'
import { useI18n } from '../hooks/useI18n'

interface TopBarProps {
  title: string
  user?: User | null
}

export default function TopBar({ title, user }: TopBarProps) {
  const { t, currentLanguage, toggleLanguage } = useI18n()
  
  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <h1>{title}</h1>
      </div>
      
      <div className="top-bar-right">
        <button
          className="btn btn-secondary"
          onClick={toggleLanguage}
          title={t('settings.toggleLanguage')}
        >
          {currentLanguage === 'en' ? 'العربية' : 'English'}
        </button>
        
        {user && (
          <div className="user-menu">
            <div className="user-avatar">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
            <span>{user.firstName}</span>
          </div>
        )}
      </div>
    </div>
  )
}
