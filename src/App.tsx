import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components';
import { LoginPage, DashboardPage, PatientDetailsPage, RegisterPatientPage } from './pages';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Private routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/paciente/:id" 
              element={
                <PrivateRoute>
                  <PatientDetailsPage />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/registrar-paciente" 
              element={
                <PrivateRoute>
                  <RegisterPatientPage />
                </PrivateRoute>
              } 
            />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
