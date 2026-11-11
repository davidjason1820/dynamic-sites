import React, { useState } from 'react'
import { DynamicLogo } from './DynamicLogo'
import { Bookmark, Search, Menu, X, Sparkles } from 'lucide-react'

export type NavTab = 'all' | 'prompt' | 'background' | 'interaction' | 'codrops' | 'saved'

interface NavbarProps {
  activeTab: NavTab
  onSelectTab: (tab: NavTab) => void
  savedCount: number
  searchQuery: string
  onSearchChange: (q: string) => void
  counts: {
    all: number
    prompts: number
    backgrounds: number
    interactions: number
    codrops: number
  }
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  searchQuery,
  onSearchChange,
  counts,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems: Array<{ key: NavTab; label: string; count?: number }> = [
    { key: 'all', label: 'All Resources', count: counts.all },
    { key: 'prompt', label: 'Prompts', count: counts.prompts },
    { key: 'background', label: 'Backgrounds & Shaders', count: counts.backgrounds },
    { key: 'interaction', label: 'Interactions', count: counts.interactions },
    { key: 'codrops', label: 'Codrops Experiments', count: counts.codrops },
  ]

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab)
    setMobileMenuOpen(false)
  }

  return (
    <header className="ds-navbar">
      <div className="ds-navbar-inner">
        {/* Brand */}
        <button
          type="button"
          className="ds-brand-button"
          onClick={() => handleTabClick('all')}
          aria-label="Dynamic Sites Home"
        >
          <DynamicLogo size={36} />
        </button>

        {/* Desktop Nav Links */}
        <nav className="ds-desktop-nav" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.key
            return (
              <button
                key={item.key}
                type="button"
                className={`ds-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(item.key)}
              >
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="ds-nav-badge">{item.count}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="ds-navbar-actions">
          {/* Quick Search Field in Navbar */}
          <div className="ds-nav-search-wrap">
            <Search size={15} className="ds-nav-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search library..."
              className="ds-nav-search-input"
              aria-label="Search library"
            />
            {searchQuery && (
              <button
                type="button"
                className="ds-nav-search-clear"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Saved Items Button */}
          <button
            type="button"
            className={`ds-saved-nav-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => handleTabClick(activeTab === 'saved' ? 'all' : 'saved')}
            title="View saved resources"
          >
            <Bookmark size={16} />
            <span className="ds-saved-text">Saved</span>
            {savedCount > 0 && <span className="ds-saved-badge">{savedCount}</span>}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="ds-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="ds-mobile-drawer">
          <div className="ds-mobile-drawer-links">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`ds-mobile-link ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => handleTabClick(item.key)}
              >
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="ds-nav-badge">{item.count}</span>
                )}
              </button>
            ))}

            <button
              type="button"
              className={`ds-mobile-link ds-mobile-saved ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => handleTabClick('saved')}
            >
              <div className="flex items-center gap-2">
                <Bookmark size={16} />
                <span>Saved Resources</span>
              </div>
              <span className="ds-nav-badge">{savedCount}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
