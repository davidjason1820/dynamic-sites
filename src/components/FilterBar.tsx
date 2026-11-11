import React from 'react'
import { Search, X, SlidersHorizontal, Layers, Video, Bookmark, Sparkles } from 'lucide-react'
import type { NavTab } from './Navbar'

interface FilterBarProps {
  activeTab: NavTab
  onSelectTab: (tab: NavTab) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedCategory: string
  onSelectCategory: (cat: string) => void
  selectedTech: string
  onSelectTech: (tech: string) => void
  availableCategories: string[]
  availableTechs: string[]
  resultCount: number
  hasActiveFilters: boolean
  onResetFilters: () => void
  videoOnly: boolean
  onToggleVideoOnly: () => void
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedTech,
  onSelectTech,
  availableCategories,
  availableTechs,
  resultCount,
  hasActiveFilters,
  onResetFilters,
  videoOnly,
  onToggleVideoOnly,
}) => {
  return (
    <div className="ds-filter-bar" id="browse-section">
      {/* Top Search & Primary Tabs Row */}
      <div className="ds-filter-main-row">
        {/* Type / Tab Pills */}
        <div className="ds-tab-pills" role="tablist">
          <button
            type="button"
            className={`ds-pill-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => onSelectTab('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`ds-pill-btn ${activeTab === 'prompt' ? 'active' : ''}`}
            onClick={() => onSelectTab('prompt')}
          >
            Prompts
          </button>
          <button
            type="button"
            className={`ds-pill-btn ${activeTab === 'background' ? 'active' : ''}`}
            onClick={() => onSelectTab('background')}
          >
            Shaders & Backgrounds
          </button>
          <button
            type="button"
            className={`ds-pill-btn ${activeTab === 'interaction' ? 'active' : ''}`}
            onClick={() => onSelectTab('interaction')}
          >
            Interactions
          </button>
          <button
            type="button"
            className={`ds-pill-btn ${activeTab === 'codrops' ? 'active' : ''}`}
            onClick={() => onSelectTab('codrops')}
          >
            Codrops
          </button>
          <button
            type="button"
            className={`ds-pill-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => onSelectTab('saved')}
          >
            <Bookmark size={13} className="inline mr-1" />
            Saved
          </button>
        </div>

        {/* Video only filter toggle */}
        <button
          type="button"
          className={`ds-video-toggle ${videoOnly ? 'active' : ''}`}
          onClick={onToggleVideoOnly}
          title="Filter to items with verified motion videos"
        >
          <Video size={14} />
          <span>With Video Previews</span>
        </button>
      </div>

      {/* Secondary Category & Technology Filter Chips */}
      <div className="ds-filter-sub-row">
        {/* Categories */}
        <div className="ds-chips-group">
          <span className="ds-chips-label">Category:</span>
          <div className="ds-chips-scroll">
            <button
              type="button"
              className={`ds-chip ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => onSelectCategory('')}
            >
              All Categories
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`ds-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => onSelectCategory(selectedCategory === cat ? '' : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Technologies */}
        {availableTechs.length > 0 && (
          <div className="ds-chips-group">
            <span className="ds-chips-label">Tech:</span>
            <div className="ds-chips-scroll">
              <button
                type="button"
                className={`ds-chip ${selectedTech === '' ? 'active' : ''}`}
                onClick={() => onSelectTech('')}
              >
                All Tech
              </button>
              {availableTechs.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  className={`ds-chip ${selectedTech === tech ? 'active' : ''}`}
                  onClick={() => onSelectTech(selectedTech === tech ? '' : tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results and Reset status bar */}
      <div className="ds-filter-status-row">
        <span className="ds-result-count">
          Showing <strong>{resultCount}</strong> {resultCount === 1 ? 'resource' : 'resources'}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            className="ds-reset-filters-btn"
            onClick={onResetFilters}
          >
            <X size={13} />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  )
}
