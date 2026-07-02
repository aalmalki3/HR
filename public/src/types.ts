// Authentication
export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'hr_admin' | 'manager' | 'employee'
  departmentId: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
}

// Employee
export interface Employee {
  id: string
  email: string
  firstName: string
  lastName: string
  firstNameAr: string
  lastNameAr: string
  dob: string
  nationality: string
  passportNumber: string
  iqamaNumber: string
  visaStatus: string
  maritalStatus: string
  dependents: number
  departmentId: string
  positionId: string
  managerId: string
  hireDate: string
  employmentType: 'full_time' | 'part_time' | 'contract'
  salary: number
  bankAccount: string
  phone: string
  emergencyContactName: string
  emergencyContactPhone: string
  createdAt?: string
  updatedAt?: string
}

// Department
export interface Department {
  id: string
  nameEn: string
  nameAr: string
  parentDepartmentId?: string
  managerId: string
  budget: number
  createdAt?: string
  updatedAt?: string
}

// Leave
export interface LeaveType {
  id: string
  nameEn: string
  nameAr: string
  annualEntitlementSaudi: number
  annualEntitlementNonSaudi: number
  isPaid: boolean
  accrualRate: number
  carryOverLimit: number
}

export interface LeaveRequest {
  id: string
  employeeId: string
  leaveTypeId: string
  startDate: string
  endDate: string
  days: number
  status: 'pending' | 'approved' | 'rejected'
  requestedDate: string
  approverId: string
  approvedDate?: string
  notes: string
  createdAt?: string
  updatedAt?: string
}

// Attendance
export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  clockIn: string
  clockOut?: string
  status: 'present' | 'absent' | 'leave' | 'half_day'
  notes: string
  createdAt?: string
  updatedAt?: string
}

// Job Posting & Application
export interface JobPosting {
  id: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  departmentId: string
  salaryMin: number
  salaryMax: number
  salaryType: 'monthly' | 'annual'
  postedDate: string
  closingDate: string
  status: 'open' | 'closed' | 'filled'
}

export interface JobApplication {
  id: string
  jobPostingId: string
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  resumeUrl: string
  appliedDate: string
  stage: 'new' | 'screening' | 'interview' | 'offer' | 'rejected'
  notes: string
  updatedAt?: string
}

// Onboarding
export interface OnboardingTask {
  id: string
  employeeId: string
  categoryEn: string
  categoryAr: string
  taskEn: string
  taskAr: string
  dueDate: string
  assignedTo: string
  isCompleted: boolean
  completedDate?: string
  createdAt?: string
  updatedAt?: string
}

// Audit Log
export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  action: string
  tableName: string
  recordId: string
  oldValue?: string
  newValue: string
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Settings
export interface SystemSettings {
  companyNameEn: string
  companyNameAr: string
  logoUrl: string
  timezone: string
  fiscalYearStart: string
  hrEmail: string
  hrPhone: string
  addressEn: string
  addressAr: string
  website: string
}

// UI State
export interface Modal {
  isOpen: boolean
  title: string
  content: React.ReactNode
  onClose: () => void
  onConfirm?: () => void
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}
