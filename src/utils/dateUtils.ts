export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`
  if (format === 'DD/MM/YYYY') return `${day}/${month}/${year}`
  if (format === 'MM/DD/YYYY') return `${month}/${day}/${year}`
  
  return d.toLocaleDateString()
}

export const getDateRange = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export const isWeekend = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = d.getDay()
  return day === 5 || day === 6 // Friday & Saturday in Saudi Arabia
}

export const isBetween = (
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  
  return d >= start && d <= end
}

export const getDayOfWeek = (date: string | Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const d = typeof date === 'string' ? new Date(date) : date
  return days[d.getDay()]
}
