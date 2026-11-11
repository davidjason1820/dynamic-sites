import React from 'react'
import { Sparkles, Video, Layers, Code2, Play, Bookmark } from 'lucide-react'
import type { NavTab } from './Navbar'

interface HeroProps {
  onSelectTab: (tab: NavTab) => void
  activeTab: NavTab
  verifiedVideoCount: number
  totalCount: number
  promptCount: number
  savedCount: number
}

export const Hero: React.FC<HeroProps> = ({
  onSelectTab,
  activeTab,
  verifiedVideoCount,
  totalCount,
  promptCount,
  savedCount,
}) => {
  return (
    <section className="ds-hero">
      <div className="ds-hero-bg-glow" aria-hidden="true" />
      <div className="ds-hero-container">
        {/* Eyebrow badge */}
        <div className="ds-hero-eyebrow">
          <Sparkles size={14} className="ds-hero-sparkle" />
          <span>Curated AI Prompts & Dynamic Website Motion</span>
        </div>

        {/* Headline */}
        <h1 className="ds-hero-title">
          Build Websites That Look Designed.{' '}
          <span className="ds-gradient-text">In Code & Motion.</span>
        </h1>

        {/* Subtitle */}
        <p className="ds-hero-subtitle">
          Browse {totalCount} curated prompts, WebGL shaders, and high-impact UI interactions.
          Inspect real-time video previews, copy structured prompts for Lovable, Cursor, Bolt,
          or Claude, and deploy remarkable experiences.
        </p>

        {/* Feature stat badges */}
        <div className="ds-hero-stats">
          <div className="ds-stat-pill" onClick={() => onSelectTab('prompt')}>
            <span className="ds-stat-num">{promptCount}</span>
            <span className="ds-stat-label">Prompts</span>
          </div>

          <div className="ds-stat-pill ds-stat-highlight" onClick={() => onSelectTab('prompt')}>
            <Video size={14} className="ds-stat-icon" />
            <span className="ds-stat-num">{verifiedVideoCount}</span>
            <span className="ds-stat-label">Video Previews</span>
          </div>

          <div className="ds-stat-pill" onClick={() => onSelectTab('background')}>
            <Layers size={14} className="ds-stat-icon" />
            <span className="ds-stat-num">12</span>
            <span className="ds-stat-label">Shaders</span>
          </div>

          <div className="ds-stat-pill" onClick={() => onSelectTab('interaction')}>
            <Code2 size={14} className="ds-stat-icon" />
            <span className="ds-stat-num">10</span>
            <span className="ds-stat-label">Interactions</span>
          </div>

          <div className="ds-stat-pill" onClick={() => onSelectTab('codrops')}>
            <Sparkles size={14} className="ds-stat-icon" />
            <span className="ds-stat-num">10</span>
            <span className="ds-stat-label">Codrops</span>
          </div>
        </div>

        {/* Fast Action Buttons */}
        <div className="ds-hero-actions">
          <button
            type="button"
            className="ds-hero-btn primary"
            onClick={() => {
              const el = document.getElementById('browse-section')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <Play size={16} fill="currentColor" />
            <span>Explore Library</span>
          </button>

          <button
            type="button"
            className={`ds-hero-btn secondary ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => onSelectTab(activeTab === 'saved' ? 'all' : 'saved')}
          >
            <Bookmark size={16} />
            <span>Saved Collection</span>
            {savedCount > 0 && <span className="ds-hero-badge">{savedCount}</span>}
          </button>
        </div>
      </div>
    </section>
  )
}
