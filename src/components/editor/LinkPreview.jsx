import { useState } from 'react'
import { detectLinkType, getYouTubeEmbedUrl } from '../../lib/linkPreview'
import { ExternalLink, Play, X } from 'lucide-react'

export default function LinkPreview({ url }) {
  const [dismissed, setDismissed] = useState(false)
  const linkInfo = detectLinkType(url)

  if (dismissed) return null

  if (linkInfo.type === 'youtube') {
    return (
      <div className="link-preview">
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px' }}>
          <button className="tree-action-btn" onClick={() => setDismissed(true)} title="Kapat">
            <X size={14} />
          </button>
        </div>
        <div className="link-preview-youtube">
          <iframe
            src={getYouTubeEmbedUrl(linkInfo.id)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="link-preview">
      <div className="link-preview-generic">
        <div className="link-preview-info">
          <div className="link-preview-url" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ExternalLink size={12} />
            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
          </div>
        </div>
        <button className="tree-action-btn" onClick={() => setDismissed(true)} title="Kapat">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
