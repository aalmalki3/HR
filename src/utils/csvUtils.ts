export const exportToCSV = (data: any[], filename: string): void => {
  if (!data || data.length === 0) return
  
  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  let csv = headers.join(',') + '\n'
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header]
      // Escape quotes and wrap in quotes if contains comma
      if (value === null || value === undefined) return ''
      return typeof value === 'string' && value.includes(',')
        ? `"${value.replace(/"/g, '""')}"`
        : value
    })
    csv += values.join(',') + '\n'
  })
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',')
  const data: any[] = []
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue
    
    const obj: any = {}
    const values = lines[i].split(',')
    
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim()
    })
    
    data.push(obj)
  }
  
  return data
}
