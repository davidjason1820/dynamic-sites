import React from 'react'
import { Bookmark, Sparkles, ArrowRight } from 'lucide-react'

interface SavedEmptyStateProps {
  onBrowseAll: () => void
}

export const SavedEmptyState: React.FC<SavedEmptyStateProps> = ({ onBrowseAll }) => {
  return (
    <div className="ds-saved-empty-container">
      <div className="ds-saved-empty-icon-wrap">
        <Bookmark size={32} className="ds-saved-empty-icon" />
      </div>

      <h3 className="ds-saved-empty-title">Your saved collection is empty</h3>
      <p className="ds-saved-empty-text">
        Keep your favorite prompts, shaders, and interactions in one place. Click the bookmark
        icon on any card to save it for quick reference while building.
      </p>

      <button type="button" className="ds-saved-empty-cta" onClick={onBrowseAll}>
        <Sparkles size={16} />
        <span>Browse All 97 Resources</span>
        <ArrowRight size={16} />
      </button>
    </div>
  )
}
