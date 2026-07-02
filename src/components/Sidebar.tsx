import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useI18n } from '../hooks/useI18n'

interface NavItem {
  label: string
  path: string
  icon: string
  roles: string[]
}

export default function Sidebar() {
  const { t } = useI18n()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const location = useLocation()
  
  const navItems: NavItem[] = [
    { label: t('nav.dashboard'), path: '/', icon: '📊', roles: ['hr_admin', 'manager', 'employee'] },
    { label: t('nav.employees'), path: '/employees', icon: '👥', roles: ['hr_admin', 'manager'] },
    { label: t('nav.leave'), path: '/leave', icon: '🏖️', roles: ['hr_admin', 'manager', 'employee'] },
    { label: t('nav.attendance'), path: '/attendance', icon: '📋', roles: ['hr_admin', 'manager', 'employee'] },
    { label: t('nav.reports'), path: '/reports', icon: '📈', roles: ['hr_admin'] },
    { label: t('nav.settings'), path: '/settings', icon: '⚙️', roles: ['hr_admin'] },
  ]
  
  const filteredNav = navItems.filter(item =>
    !user || item.roles.includes(user.role)
  )
  
  const handleLogout = () => {
  logout()
  window.location.href = '/HR/login'
}
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">HR System</div>
      </div>
      
      <nav>
        <ul className="nav-menu">
          {filteredNav.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
            {t('common.user')}
          </p>
          <p style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>
            {user?.firstName} {user?.lastName}
          </p>
        </div>
        <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleLogout}>
          {t('auth.logout')}
        </button>
      </div>
    </div>
  )
}
