import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  change: string
  color: 'primary' | 'success' | 'warning' | 'info' | 'danger'
  icon?: string
}

const colorMap = {
  primary: '#2563eb',
  success: '#16a34a',
  warning: '#ea580c',
  info: '#0284c7',
  danger: '#dc2626',
}

export default function StatCard({ label, value, change, color, icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value" style={{ color: colorMap[color] }}>
            {value}
          </div>
          <div className="stat-change">{change}</div>
        </div>
        {icon && <div style={{ fontSize: '2rem' }}>{icon}</div>}
      </div>
    </div>
  )
}
