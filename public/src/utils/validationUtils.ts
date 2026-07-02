export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  return phoneRegex.test(phone)
}

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

export const validateIqama = (iqama: string): boolean => {
  // Saudi Iqama format (10 digits)
  const iqamaRegex = /^[0-9]{10}$/
  return iqamaRegex.test(iqama)
}

export const validatePassport = (passport: string): boolean => {
  // International passport format (mix of letters and numbers, 6-9 chars)
  const passportRegex = /^[A-Z0-9]{6,9}$/
  return passportRegex.test(passport)
}

export const validateRequired = (value: any): boolean => {
  return value !== null && value !== undefined && value !== ''
}

export const validateMinLength = (value: string, min: number): boolean => {
  return value.length >= min
}

export const validateMaxLength = (value: string, max: number): boolean => {
  return value.length <= max
}

export const validateNumber = (value: any, min?: number, max?: number): boolean => {
  const num = Number(value)
  if (isNaN(num)) return false
  if (min !== undefined && num < min) return false
  if (max !== undefined && num > max) return false
  return true
}
