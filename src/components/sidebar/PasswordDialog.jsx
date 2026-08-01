import { useState } from 'react'
import { useNotes } from '../../contexts/NotesContext'
import { verifyPassword } from '../../lib/encryption'
import { Lock, Unlock, KeyRound, ShieldAlert } from 'lucide-react'

export default function PasswordDialog({ type, item, onClose, onUnlock }) {
  const { lockNote, unlockNote, lockFolder, unlockFolder } = useNotes()
  const [mode, setMode] = useState(item.is_locked ? 'verify' : 'set')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isNote = type === 'note'
  const itemName = isNote ? item.title : item.name

  const handleSetPassword = async () => {
    if (password.length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      if (isNote) {
        await lockNote(item.id, password)
      } else {
        await lockFolder(item.id, password)
      }
      onClose()
    } catch {
      setError('An error occurred while setting the password.')
    }
    setLoading(false)
  }

  const handleVerify = async () => {
    if (!password) {
      setError('Enter the password.')
      return
    }

    setLoading(true)
    try {
      const isValid = await verifyPassword(password, item.password_hash)
      if (isValid) {
        onUnlock?.()
        onClose()
      } else {
        setError('Incorrect password.')
      }
    } catch {
      setError('An error occurred during verification.')
    }
    setLoading(false)
  }

  const handleRemoveLock = async () => {
    setLoading(true)
    try {
      if (isNote) {
        await unlockNote(item.id)
      } else {
        await unlockFolder(item.id)
      }
      onUnlock?.()
      onClose()
    } catch {
      setError('An error occurred while removing the lock.')
    }
    setLoading(false)
  }

  const handleResetPassword = async () => {
    if (password.length < 4) {
      setError('New password must be at least 4 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      if (isNote) {
        await lockNote(item.id, password)
      } else {
        await lockFolder(item.id, password)
      }
      onClose()
    } catch {
      setError('An error occurred while resetting the password.')
    }
    setLoading(false)
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        {mode === 'verify' && (
          <>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} /> Locked {isNote ? 'Note' : 'Folder'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
              Enter the password to access "<strong>{itemName}</strong>".
            </p>
            <input
              className="dialog-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              autoFocus
            />
            {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>{error}</p>}
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setMode('reset')} style={{ marginRight: 'auto', fontSize: 'var(--text-xs)' }}>
                <ShieldAlert size={14} /> Reset Password
              </button>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleVerify} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </>
        )}

        {mode === 'set' && (
          <>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KeyRound size={20} /> Set Password
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
              Set a password for "<strong>{itemName}</strong>".
            </p>
            <input
              className="dialog-input"
              type="password"
              placeholder="Password (min 4 characters)"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              autoFocus
            />
            <input
              className="dialog-input"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSetPassword()}
            />
            {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>{error}</p>}
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSetPassword} disabled={loading}>
                {loading ? 'Saving...' : 'Lock'}
              </button>
            </div>
          </>
        )}

        {mode === 'reset' && (
          <>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} /> Reset Password
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
              As the account owner, you can reset the password. Set a new password or remove the lock.
            </p>
            <input
              className="dialog-input"
              type="password"
              placeholder="New password (min 4 characters)"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              autoFocus
            />
            <input
              className="dialog-input"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
            />
            {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>{error}</p>}
            <div className="dialog-actions">
              <button className="btn btn-danger" onClick={handleRemoveLock} disabled={loading} style={{ marginRight: 'auto' }}>
                <Unlock size={14} /> Remove Lock
              </button>
              <button className="btn btn-secondary" onClick={() => setMode('verify')}>Back</button>
              <button className="btn btn-primary" onClick={handleResetPassword} disabled={loading}>
                {loading ? 'Saving...' : 'Reset'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
