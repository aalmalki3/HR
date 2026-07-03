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
