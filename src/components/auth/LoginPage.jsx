import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useDonation } from '../../contexts/DonationContext'
import { FileText, FolderTree, Share2, Lock, Sparkles, Heart, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../../styles/auth.css'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const { openDonation } = useDonation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError('An error occurred while signing in. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-grid" />

      {/* Back to landing */}
      <Link to="/" style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '6px',
        color: 'var(--text-muted)', fontSize: 'var(--text-sm)',
        textDecoration: 'none', transition: 'color 0.2s'
      }}>
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <FileText />
          </div>
          <h1>PadSync</h1>
        </div>

        <p className="login-subtitle">
          Organize, share, and access your notes from anywhere.
        </p>

        <div className="login-features">
          <span className="login-feature"><FolderTree /> Folders</span>
          <span className="login-feature"><Sparkles /> Rich Editor</span>
          <span className="login-feature"><Lock /> Encrypted</span>
          <span className="login-feature"><Share2 /> Sharing</span>
        </div>

        {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)', textAlign: 'center' }}>{error}</p>}

        <button className="google-btn" onClick={handleLogin} disabled={loading}>
          {loading ? (
            <div className="spinner" />
          ) : (
            <svg viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <p className="login-footer">
          By continuing, you agree to our privacy policy.
        </p>

        <button onClick={openDonation} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 'var(--text-xs)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '4px', marginTop: 'var(--space-3)', width: '100%',
          fontFamily: 'var(--font-sans)'
        }}>
          <Heart size={12} style={{ color: '#ff6b6b' }} /> Support PadSync
        </button>
      </div>
    </div>
  )
}
