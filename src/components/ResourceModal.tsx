import React, { useEffect, useRef, useState } from 'react'
import type { Resource } from '../data'
import { ConceptPreview } from './ConceptPreview'
import {
  X,
  Bookmark,
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Terminal,
  ShieldCheck,
  Video,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

interface ResourceModalProps {
  resource: Resource | null
  isOpen: boolean
  isSaved: boolean
  onClose: () => void
  onToggleSave: (id: string, e: React.MouseEvent) => void
  onCopy: (text: string, title: string, e: React.MouseEvent) => void
  onNavigateNext: () => void
  onNavigatePrev: () => void
  currentIndex: number
  totalCount: number
}

type ModalTab = 'prompt' | 'code' | 'details'

export const ResourceModal: React.FC<ResourceModalProps> = ({
  resource,
  isOpen,
  isSaved,
  onClose,
  onToggleSave,
  onCopy,
  onNavigateNext,
  onNavigatePrev,
  currentIndex,
  totalCount,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('prompt')
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  // Reset active tab to 'prompt' or 'code' when resource changes
  useEffect(() => {
    if (resource) {
      if (resource.prompt) {
        setActiveTab('prompt')
      } else if (resource.code) {
        setActiveTab('code')
      } else {
        setActiveTab('details')
      }
    }
  }, [resource?.id])

  // Keyboard navigation & Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        onNavigateNext()
      } else if (e.key === 'ArrowLeft') {
        onNavigatePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onNavigateNext, onNavigatePrev])

  if (!isOpen || !resource) return null

  const handleCopyText = (text: string, fieldName: string, e: React.MouseEvent) => {
    if (!text) return
    onCopy(text, `${resource.title} (${fieldName})`, e)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }

  const handleFullscreen = () => {
    if (!videoRef.current) return
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    }
  }

  const wordCount = resource.prompt ? resource.prompt.trim().split(/\s+/).length : 0

  return (
    <div
      className="ds-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="ds-modal-container"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="ds-modal-header">
          <div className="ds-modal-header-left">
            <span className={`ds-badge-type ds-type-${resource.type}`}>
              {resource.type.toUpperCase()}
            </span>
            <span className="ds-badge-cat">{resource.category}</span>
            <span className="ds-modal-counter">
              {currentIndex + 1} of {totalCount}
            </span>
          </div>

          <div className="ds-modal-header-right">
            {/* Prev / Next buttons */}
            <div className="ds-modal-nav-btns">
              <button
                type="button"
                className="ds-modal-nav-btn"
                onClick={onNavigatePrev}
                title="Previous resource (←)"
                aria-label="Previous resource"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="ds-modal-nav-btn"
                onClick={onNavigateNext}
                title="Next resource (→)"
                aria-label="Next resource"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Save Toggle */}
            <button
              type="button"
              className={`ds-modal-save-btn ${isSaved ? 'saved' : ''}`}
              onClick={(e) => onToggleSave(resource.id, e)}
              title={isSaved ? 'Remove from saved' : 'Save for later'}
            >
              <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* Close Modal (X) */}
            <button
              type="button"
              className="ds-modal-close-btn"
              onClick={onClose}
              title="Close modal (Esc)"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="ds-modal-body">
          {/* Left Column: Visual Media Preview */}
          <div className="ds-modal-media-col">
            <div className="ds-modal-media-box">
              {resource.previewVideoUrl ? (
                <div className="ds-modal-video-wrap">
                  <video
                    ref={videoRef}
                    src={resource.previewVideoUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="ds-modal-video"
                    onClick={toggleVideoPlayback}
                  />

                  {/* Video Controls Bar */}
                  <div className="ds-modal-video-controls">
                    <button
                      type="button"
                      className="ds-ctrl-btn"
                      onClick={toggleVideoPlayback}
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                    </button>

                    <button
                      type="button"
                      className="ds-ctrl-btn"
                      onClick={toggleMute}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>

                    <span className="ds-ctrl-badge">Verified Motion Preview</span>

                    <button
                      type="button"
                      className="ds-ctrl-btn ml-auto"
                      onClick={handleFullscreen}
                      title="Fullscreen"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <ConceptPreview
                  title={resource.title}
                  type={resource.type}
                  category={resource.category}
                  accent={resource.accent}
                  className="ds-modal-concept"
                />
              )}
            </div>

            {/* Quick Title & Description */}
            <div className="ds-modal-title-desc">
              <h2 id="modal-title" className="ds-modal-title">
                {resource.title}
              </h2>
              <p className="ds-modal-desc">{resource.description}</p>
            </div>

            {/* Quick Copy Action Bar */}
            <div className="ds-modal-action-bar">
              {resource.prompt && (
                <button
                  type="button"
                  className="ds-modal-action-btn primary"
                  onClick={(e) => handleCopyText(resource.prompt, 'Prompt', e)}
                >
                  {copiedField === 'Prompt' ? (
                    <>
                      <Check size={16} className="text-emerald-400" />
                      <span>Prompt Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy Full Prompt</span>
                    </>
                  )}
                </button>
              )}

              {resource.code && (
                <button
                  type="button"
                  className="ds-modal-action-btn secondary"
                  onClick={(e) => handleCopyText(resource.code!, 'Code', e)}
                >
                  {copiedField === 'Code' ? (
                    <>
                      <Check size={16} className="text-emerald-400" />
                      <span>Code Copied!</span>
                    </>
                  ) : (
                    <>
                      <Code2 size={16} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              )}

              {resource.previewVideoUrl && (
                <button
                  type="button"
                  className="ds-modal-action-btn ghost"
                  onClick={(e) => handleCopyText(resource.previewVideoUrl!, 'Video URL', e)}
                >
                  {copiedField === 'Video URL' ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span>URL Copied!</span>
                    </>
                  ) : (
                    <>
                      <Video size={14} />
                      <span>Copy Video URL</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Tabbed Content (Prompt, Code, Details) */}
          <div className="ds-modal-content-col">
            {/* Tabs Header */}
            <div className="ds-modal-tabs" role="tablist">
              {resource.prompt && (
                <button
                  type="button"
                  className={`ds-modal-tab ${activeTab === 'prompt' ? 'active' : ''}`}
                  onClick={() => setActiveTab('prompt')}
                >
                  <Terminal size={15} />
                  <span>Prompt Text</span>
                  <span className="ds-tab-meta">({wordCount} words)</span>
                </button>
              )}

              {resource.code && (
                <button
                  type="button"
                  className={`ds-modal-tab ${activeTab === 'code' ? 'active' : ''}`}
                  onClick={() => setActiveTab('code')}
                >
                  <Code2 size={15} />
                  <span>Source Code</span>
                </button>
              )}

              <button
                type="button"
                className={`ds-modal-tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                <Sparkles size={15} />
                <span>Tech & Specs</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="ds-modal-panel">
              {/* Tab: Prompt */}
              {activeTab === 'prompt' && resource.prompt && (
                <div className="ds-prompt-view">
                  <div className="ds-prompt-box">
                    <pre className="ds-prompt-pre">{resource.prompt}</pre>
                  </div>

                  <div className="ds-prompt-recommendation">
                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      Target AI Builders:
                    </span>
                    <div className="ds-builder-tags">
                      <span className="ds-builder-chip">Lovable</span>
                      <span className="ds-builder-chip">Cursor</span>
                      <span className="ds-builder-chip">Bolt</span>
                      <span className="ds-builder-chip">Claude</span>
                      <span className="ds-builder-chip">v0</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Code */}
              {activeTab === 'code' && resource.code && (
                <div className="ds-code-view">
                  <div className="ds-code-box">
                    <pre className="ds-code-pre">
                      <code>{resource.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Tab: Details */}
              {activeTab === 'details' && (
                <div className="ds-details-view">
                  <div className="ds-details-group">
                    <h4 className="ds-details-heading">Technologies</h4>
                    <div className="ds-details-chips">
                      {resource.technologies.map((tech) => (
                        <span key={tech} className="ds-details-chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="ds-details-group">
                    <h4 className="ds-details-heading">Tags</h4>
                    <div className="ds-details-chips">
                      {resource.tags.map((tag) => (
                        <span key={tag} className="ds-details-chip muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="ds-details-group">
                    <h4 className="ds-details-heading">Commercial Status</h4>
                    <div className="ds-status-indicator">
                      <ShieldCheck size={16} className="text-emerald-400" />
                      <span>
                        {resource.commercialUse
                          ? 'Approved for commercial & client projects'
                          : 'Review underlying terms before commercial redistribution'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Attribution & License Notice at Modal Bottom (NO GitHub links) */}
            <div className="ds-modal-license-bar">
              <div className="ds-license-info">
                <span className="ds-license-title">License & Provenance:</span>
                <span className="ds-license-text">
                  {resource.license} · {resource.attribution}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
