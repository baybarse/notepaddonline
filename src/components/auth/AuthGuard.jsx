import { useAuth } from '../../contexts/AuthContext'

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner lg" />
        <p>Loading PadSync...</p>
      </div>
    )
  }

  if (!user) return null

  return children
}
