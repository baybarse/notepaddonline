import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotesProvider } from './contexts/NotesContext'
import { DonationProvider } from './contexts/DonationContext'
import LandingPage from './components/landing/LandingPage'
import LoginPage from './components/auth/LoginPage'
import AuthGuard from './components/auth/AuthGuard'
import AppLayout from './components/layout/AppLayout'
import SharedNotePage from './components/shared/SharedNotePage'
import DonationPopup from './components/ui/DonationPopup'

const basename = import.meta.env.VITE_BASE_URL || '/'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner lg" />
        <p>Loading PadSync...</p>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/shared/:shareId" element={<SharedNotePage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/app" replace /> : <LoginPage />}
        />
        <Route
          path="/app"
          element={
            user ? (
              <AuthGuard>
                <NotesProvider>
                  <AppLayout />
                </NotesProvider>
              </AuthGuard>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={user ? <Navigate to="/app" replace /> : <LandingPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DonationPopup />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <DonationProvider>
          <AppRoutes />
        </DonationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
