import { useDonation } from '../../contexts/DonationContext'
import { Heart, X, Coffee, ExternalLink } from 'lucide-react'

export default function DonationPopup() {
  const { isOpen, closeDonation, DONATION_URL } = useDonation()

  if (!isOpen) return null

  return (
    <div className="dialog-overlay" onClick={closeDonation} style={{ zIndex: 9999 }}>
      <div className="dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
        <button
          className="header-btn"
          onClick={closeDonation}
          style={{ position: 'absolute', top: '12px', right: '12px' }}
        >
          <X size={18} />
        </button>

        <div style={{
          width: '64px', height: '64px', margin: '0 auto var(--space-4)',
          background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
          borderRadius: 'var(--radius-xl)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 30px rgba(255, 107, 107, 0.3)'
        }}>
          <Coffee size={32} color="white" />
        </div>

        <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
          Support PadSync ☕
        </h3>

        <p style={{
          color: 'var(--text-secondary)', fontSize: 'var(--text-sm)',
          marginBottom: 'var(--space-6)', lineHeight: '1.6'
        }}>
          PadSync is free and open-source. If you find it useful,
          consider buying me a coffee to keep the project alive and improving!
        </p>

        <a
          href={DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{
            width: '100%', padding: 'var(--space-3) var(--space-6)',
            fontSize: 'var(--text-md)', fontWeight: '600',
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
            boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
            textDecoration: 'none', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)'
          }}
          onClick={closeDonation}
        >
          <Heart size={18} /> Buy Me a Coffee <ExternalLink size={14} />
        </a>

        <button
          className="btn btn-secondary"
          onClick={closeDonation}
          style={{ width: '100%', marginTop: 'var(--space-3)' }}
        >
          Maybe Later
        </button>
      </div>
    </div>
  )
}
