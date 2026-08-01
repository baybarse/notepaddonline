import { Link } from 'react-router-dom'
import { useDonation } from '../../contexts/DonationContext'
import {
  FileText, FolderTree, Lock, Share2, Sparkles, Zap,
  Image, FileDown, Heart, Coffee, ArrowRight, ChevronRight
} from 'lucide-react'
import '../../styles/landing.css'

const features = [
  {
    icon: <Sparkles size={24} />,
    color: 'purple',
    title: 'Rich Text Editor',
    desc: 'Powerful WYSIWYG editor with tables, code blocks, task lists, text formatting, and Markdown mode.',
  },
  {
    icon: <FolderTree size={24} />,
    color: 'blue',
    title: 'Folder Organization',
    desc: 'Organize your notes in nested folders with an intuitive tree structure. Drag, rename, and manage with ease.',
  },
  {
    icon: <Lock size={24} />,
    color: 'orange',
    title: 'Password Protection',
    desc: 'Secure individual notes or entire folders with passwords. Owner-based recovery ensures you never lose access.',
  },
  {
    icon: <Share2 size={24} />,
    color: 'green',
    title: 'Link Sharing',
    desc: 'Share notes via public links or protect them with a secret key. Recipients view clean, formatted notes instantly.',
  },
  {
    icon: <Image size={24} />,
    color: 'teal',
    title: 'Image Upload',
    desc: 'Upload images via drag & drop, clipboard paste, or URL. Each user gets 10 free uploads (4MB max each).',
  },
  {
    icon: <FileDown size={24} />,
    color: 'red',
    title: 'PDF Export',
    desc: 'Export your notes as beautifully formatted PDFs. Print-ready layouts with proper typography and styling.',
  },
]

export default function LandingPage() {
  const { openDonation } = useDonation()

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="landing-nav-logo-icon">
            <FileText />
          </div>
          <span>PadSync</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <button onClick={openDonation} className="landing-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            <Heart size={14} style={{ color: '#ff6b6b', marginRight: '4px' }} /> Support
          </button>
          <Link to="/login" className="landing-nav-cta">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-bg" />
        <div className="landing-hero-grid" />
        <div className="landing-hero-content">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            Free & Open Source
          </div>
          <h1>
            Your Notes,<br />
            <span className="gradient-text">Organized & Synced</span>
          </h1>
          <p className="landing-hero-desc">
            A powerful note-taking app with a rich editor, nested folders,
            password protection, link sharing, and PDF export — all in your browser, completely free.
          </p>
          <div className="landing-hero-actions">
            <Link to="/login" className="landing-btn-primary">
              <Zap size={18} /> Start Taking Notes
            </Link>
            <a href="#features" className="landing-btn-secondary">
              Explore Features <ChevronRight size={16} />
            </a>
          </div>

          {/* Donation Banner */}
          <div className="donation-banner" onClick={openDonation}>
            <Coffee size={18} className="heart" />
            <span>Enjoying PadSync? <strong style={{ color: '#ff6b6b' }}>Buy me a coffee</strong> to support development ☕</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section" id="features">
        <div className="landing-section-header">
          <h2>Everything You Need</h2>
          <p>All the tools to capture, organize, and share your thoughts — in one place.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className={`feature-icon ${f.color}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="landing-cta-card">
          <h2>Ready to Get Started?</h2>
          <p>Sign in with Google and start organizing your notes in seconds.</p>
          <Link to="/login" className="landing-btn-primary">
            <Zap size={18} /> Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-left">
          <FileText size={16} style={{ color: 'var(--accent-primary)' }} />
          © 2025 PadSync — Smart Note-Taking App
        </div>
        <div className="landing-footer-links">
          <button onClick={openDonation} className="landing-footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            ☕ Support
          </button>
          <a href="https://github.com" className="landing-footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  )
}
