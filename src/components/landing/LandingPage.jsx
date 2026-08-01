import { Link } from 'react-router-dom'
import { useDonation } from '../../contexts/DonationContext'
import {
  FileText, FolderTree, Lock, Share2, Sparkles, Zap,
  Image, FileDown, Heart, Coffee, ArrowRight, ChevronRight,
  Trash2, GripVertical, Eye, Shield, Cloud, Smartphone,
  CheckCircle2, Star
} from 'lucide-react'
import '../../styles/landing.css'

const features = [
  {
    icon: <Sparkles size={28} />,
    color: 'purple',
    title: 'Rich Text Editor',
    desc: 'A powerful WYSIWYG editor with headings, bold, italic, lists, tables, code blocks, task lists, and full Markdown mode — all in one seamless experience.',
    highlights: ['WYSIWYG & Markdown', 'Tables & Code Blocks', 'Task Lists'],
  },
  {
    icon: <FolderTree size={28} />,
    color: 'blue',
    title: 'Smart Folder Organization',
    desc: 'Organize your notes in nested folders with an intuitive tree structure. Drag & drop notes between folders, rename with double-click, and manage everything effortlessly.',
    highlights: ['Nested Folders', 'Drag & Drop', 'Quick Rename'],
  },
  {
    icon: <Lock size={28} />,
    color: 'orange',
    title: 'Password Protection',
    desc: 'Secure individual notes or entire folders with passwords. Your sensitive information stays private with client-side encryption.',
    highlights: ['Note & Folder Lock', 'Encrypted Storage', 'Owner Recovery'],
  },
  {
    icon: <Share2 size={28} />,
    color: 'green',
    title: 'Instant Link Sharing',
    desc: 'Share notes via public links or protect them with a secret key. Recipients see clean, beautifully formatted notes with print and PDF export options.',
    highlights: ['Public & Private Links', 'Access Keys', 'Print & PDF'],
  },
  {
    icon: <Image size={28} />,
    color: 'teal',
    title: 'Image Upload',
    desc: 'Upload images via drag & drop, clipboard paste, or URL. Embed images directly in your notes with a generous free tier of 10 uploads per user.',
    highlights: ['Drag & Drop', 'Paste from Clipboard', '10 Free Uploads'],
  },
  {
    icon: <FileDown size={28} />,
    color: 'red',
    title: 'PDF Export & Print',
    desc: 'Export any note as a beautifully formatted PDF or print directly from the app. Shared notes also support print and PDF — perfect for documentation.',
    highlights: ['One-Click Export', 'Print Ready', 'Clean Formatting'],
  },
  {
    icon: <Trash2 size={28} />,
    color: 'gray',
    title: 'Trash & Recovery',
    desc: 'Deleted something by accident? No problem. All deleted notes and folders go to Trash where you can restore them or permanently remove them.',
    highlights: ['Soft Delete', 'Easy Restore', 'Empty Trash'],
  },
  {
    icon: <Eye size={28} />,
    color: 'cyan',
    title: 'Live Preview',
    desc: 'Split your screen with a live preview panel. See exactly how your note will look while editing, or switch to fullscreen preview for a distraction-free read.',
    highlights: ['Split View', 'Fullscreen', 'Real-time'],
  },
]

const stats = [
  { value: '100%', label: 'Free Forever' },
  { value: '0', label: 'Ads or Tracking' },
  { value: '∞', label: 'Notes & Folders' },
  { value: '<1s', label: 'Sync Speed' },
]

const testimonials = [
  {
    text: "Finally a note app that's free, fast, and doesn't spy on me. The folder system and password protection are exactly what I needed.",
    author: 'Alex M.',
    role: 'Software Developer',
  },
  {
    text: "I love the split preview feature. Writing in Markdown and seeing the result in real-time is a game changer for my documentation workflow.",
    author: 'Sarah K.',
    role: 'Technical Writer',
  },
  {
    text: "The share feature with secret keys is brilliant. I use it to share project notes with my team without worrying about privacy.",
    author: 'David L.',
    role: 'Project Manager',
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
          <a href="#how-it-works" className="landing-nav-link">How It Works</a>
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

      {/* Stats */}
      <section className="landing-stats">
        {stats.map((s, i) => (
          <div className="stat-item" key={i}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
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
              <div className="feature-highlights">
                {f.highlights.map((h, j) => (
                  <span key={j} className="feature-highlight">
                    <CheckCircle2 size={12} /> {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-section" id="how-it-works">
        <div className="landing-section-header">
          <h2>Get Started in Seconds</h2>
          <p>No complex setup. No credit card. Just sign in and start writing.</p>
        </div>
        <div className="how-it-works-grid">
          <div className="hiw-step">
            <div className="hiw-number">1</div>
            <h3>Sign In</h3>
            <p>One click with your Google account. No forms, no passwords to remember.</p>
          </div>
          <div className="hiw-connector">
            <ArrowRight size={20} />
          </div>
          <div className="hiw-step">
            <div className="hiw-number">2</div>
            <h3>Create & Organize</h3>
            <p>Write notes with the rich editor, organize in folders, and add images effortlessly.</p>
          </div>
          <div className="hiw-connector">
            <ArrowRight size={20} />
          </div>
          <div className="hiw-step">
            <div className="hiw-number">3</div>
            <h3>Share & Export</h3>
            <p>Share via links, export as PDF, or print. Your notes, your way.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-section">
        <div className="landing-section-header">
          <h2>Loved by Users</h2>
          <p>See what people are saying about PadSync.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <strong>{t.author}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlight - Security */}
      <section className="landing-section">
        <div className="feature-highlight-section">
          <div className="fhs-content">
            <div className="fhs-badge"><Shield size={14} /> Security First</div>
            <h2>Your Privacy Matters</h2>
            <p>PadSync takes your privacy seriously. Notes are protected with password encryption, shared links can require secret keys, and we never track or sell your data.</p>
            <ul className="fhs-list">
              <li><CheckCircle2 size={16} /> Password-protected notes & folders</li>
              <li><CheckCircle2 size={16} /> Secret key sharing for sensitive content</li>
              <li><CheckCircle2 size={16} /> No tracking, no analytics, no ads</li>
              <li><CheckCircle2 size={16} /> Your data stays in your control</li>
            </ul>
          </div>
          <div className="fhs-visual">
            <div className="fhs-card">
              <Lock size={48} />
              <span>End-to-End Protected</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="landing-cta-card">
          <h2>Ready to Get Started?</h2>
          <p>Sign in with Google and start organizing your notes in seconds. It's free, forever.</p>
          <div className="landing-cta-buttons">
            <Link to="/login" className="landing-btn-primary">
              <Zap size={18} /> Create Free Account
            </Link>
            <button onClick={openDonation} className="landing-btn-secondary" style={{ background: 'none' }}>
              <Coffee size={16} /> Buy Me a Coffee
            </button>
          </div>
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
