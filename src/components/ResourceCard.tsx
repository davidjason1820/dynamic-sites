import React, { useRef, useState } from 'react'
import type { Resource } from '../data'
import { ConceptPreview } from './ConceptPreview'
import { Play, Pause, Bookmark, Copy, Check, Video, Code2, Sparkles, ExternalLink } from 'lucide-react'

interface ResourceCardProps {
  resource: Resource
  isSaved: boolean
  onToggleSave: (id: string, e: React.MouseEvent) => void
  onCopy: (text: string, title: string, e: React.MouseEvent) => void
  onOpenDetails: (resource: Resource) => void
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isSaved,
  onToggleSave,
  onCopy,
  onOpenDetails,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [copied, setCopied] = useState(false)

  const hasVideo = Boolean(resource.previewVideoUrl && !videoError)

  const handleMouseEnter = () => {
    if (videoRef.current && hasVideo) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Auto-play was prevented or video not ready
        })
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current && hasVideo) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const contentToCopy = resource.prompt || resource.code || ''
    if (!contentToCopy) return

    onCopy(contentToCopy, resource.title, e)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'prompt':
        return 'Prompt'
      case 'shader':
        return 'Shader'
      case 'background':
        return 'Background'
      case 'component':
      case 'code':
        return 'Interaction'
      case '3d-model':
        return '3D WebGL'
      case 'demo':
        return 'Experiment'
      default:
        return type.toUpperCase()
    }
  }

  return (
    <article
      className="ds-resource-card"
      onClick={() => onOpenDetails(resource)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${resource.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenDetails(resource)
        }
      }}
    >
      {/* Video / Concept Preview Container (16:9) */}
      <div className="ds-card-preview-wrap">
        {hasVideo ? (
          <div className="ds-card-video-container">
            <video
              ref={videoRef}
              src={resource.previewVideoUrl}
              preload="metadata"
              playsInline
              muted
              loop
              className="ds-card-video"
              onError={() => setVideoError(true)}
            />
            {/* Play indicator overlay */}
            <div className={`ds-video-overlay-indicator ${isPlaying ? 'playing' : ''}`}>
              {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            </div>
            {/* Verified Video Badge */}
            <div className="ds-card-video-pill">
              <Video size={11} />
              <span>Motion Preview</span>
            </div>
          </div>
        ) : (
          <ConceptPreview
            title={resource.title}
            type={resource.type}
            category={resource.category}
            accent={resource.accent}
          />
        )}

        {/* Top Badges */}
        <div className="ds-card-top-badges">
          <span className={`ds-badge-type ds-type-${resource.type}`}>
            {getTypeLabel(resource.type)}
          </span>
          <span className="ds-badge-cat">{resource.category}</span>
        </div>

        {/* Save / Bookmark Button */}
        <button
          type="button"
          className={`ds-card-save-btn ${isSaved ? 'saved' : ''}`}
          onClick={(e) => onToggleSave(resource.id, e)}
          title={isSaved ? 'Remove from saved' : 'Save for later'}
          aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
        >
          <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="ds-card-content">
        <h3 className="ds-card-title">{resource.title}</h3>
        <p className="ds-card-desc">{resource.description}</p>

        {/* Tech tags */}
        <div className="ds-card-tags">
          {resource.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="ds-card-tag">
              {tech}
            </span>
          ))}
          {resource.tags.filter((t) => !resource.technologies.includes(t)).slice(0, 1).map((t) => (
            <span key={t} className="ds-card-tag muted">
              {t}
            </span>
          ))}
        </div>

        {/* Card Quick Action Bar */}
        <div className="ds-card-actions">
          <button
            type="button"
            className={`ds-card-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyClick}
            title={resource.prompt ? 'Copy full prompt' : 'Copy code'}
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>{resource.prompt ? 'Copy Prompt' : 'Copy Code'}</span>
              </>
            )}
          </button>

          <span className="ds-card-inspect-hint">
            Inspect →
          </span>
        </div>
      </div>
    </article>
  )
}
