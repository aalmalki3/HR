import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EmployeesPage from './pages/EmployeesPage'
import LeavePage from './pages/LeavePage'
import AttendancePage from './pages/AttendancePage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import DepartmentsPage from './pages/DepartmentsPage'
import JobPostingsPage from './pages/JobPostingsPage'
import OnboardingPage from './pages/OnboardingPage'
import './styles/global.css'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

export default function App() {
  const { i18n } = useI18n()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Initialize app
    setIsLoading(false)
  }, [])
  
  if (isLoading) {
    return <div className="loading">Loading...</div>
  }
  
  return (
    <Router basename="/HR/">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/employees" element={
          <ProtectedRoute>
            <EmployeesPage />
          </ProtectedRoute>
        } />
        
        <Route path="/leave" element={
          <ProtectedRoute>
            <LeavePage />
          </ProtectedRoute>
        } />
        
        <Route path="/attendance" element={
          <ProtectedRoute>
            <AttendancePage />
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        } />
        
<Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/departments" element={
          <ProtectedRoute>
            <DepartmentsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/job-postings" element={
          <ProtectedRoute>
            <JobPostingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
