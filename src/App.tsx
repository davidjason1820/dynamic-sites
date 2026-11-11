import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { libraryResources, type Resource } from './data'
import { Navbar, type NavTab } from './components/Navbar'
import { Hero } from './components/Hero'
import { FilterBar } from './components/FilterBar'
import { ResourceCard } from './components/ResourceCard'
import { ResourceModal } from './components/ResourceModal'
import { SavedEmptyState } from './components/SavedEmptyState'
import { ToastContainer, type ToastMessage } from './components/Toast'
import { DynamicLogo } from './components/DynamicLogo'
import { Sparkles, Video, Layers, Code2, Bookmark, Search } from 'lucide-react'

const SAVED_STORAGE_KEY = 'dynamic_sites_saved_ids'

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTech, setSelectedTech] = useState('')
  const [videoOnly, setVideoOnly] = useState(false)
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) return new Set(parsed)
      }
    } catch {
      // Fallback
    }
    return new Set<string>()
  })

  const [activeModalResource, setActiveModalResource] = useState<Resource | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Persist saved IDs
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(Array.from(savedIds)))
    } catch {
      // Ignore quota errors
    }
  }, [savedIds])

  // Toast helper
  const addToast = useCallback((title: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setToasts((prev) => [...prev, { id, title, description, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Clipboard copy handler with fallback
  const handleCopy = useCallback(
    async (text: string, title: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation()
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text)
        } else {
          // Fallback for browsers without clipboard permissions
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          document.execCommand('copy')
          document.body.removeChild(textarea)
        }
        addToast('Copied to clipboard!', title, 'success')
      } catch (err) {
        addToast('Failed to copy', 'Please copy manually from details view', 'error')
      }
    },
    [addToast]
  )

  // Save / Bookmark toggle
  const handleToggleSave = useCallback(
    (id: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation()
      setSavedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
          addToast('Removed from saved', undefined, 'info')
        } else {
          next.add(id)
          addToast('Saved to collection', undefined, 'success')
        }
        return next
      })
    },
    [addToast]
  )

  // Derived counts
  const counts = useMemo(() => {
    const prompts = libraryResources.filter((r) => r.section === 'prompt').length
    const backgrounds = libraryResources.filter((r) => r.section === 'background').length
    const interactions = libraryResources.filter((r) => r.section === 'interaction' && !r.id.startsWith('codrops-')).length
    const codrops = libraryResources.filter((r) => r.id.startsWith('codrops-')).length
    const verifiedVideos = libraryResources.filter((r) => Boolean(r.previewVideoUrl)).length

    return {
      all: libraryResources.length,
      prompts,
      backgrounds,
      interactions,
      codrops,
      verifiedVideos,
    }
  }, [])

  // Available categories for current tab
  const availableCategories = useMemo(() => {
    const cats = new Set<string>()
    libraryResources.forEach((r) => {
      if (r.category) cats.add(r.category)
    })
    return Array.from(cats).sort()
  }, [])

  // Available technologies
  const availableTechs = useMemo(() => {
    const techs = new Set<string>()
    libraryResources.forEach((r) => {
      r.technologies.forEach((t) => techs.add(t))
    })
    return Array.from(techs).sort()
  }, [])

  // Filtered resources
  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return libraryResources.filter((resource) => {
      // Tab filter
      if (activeTab === 'saved') {
        if (!savedIds.has(resource.id)) return false
      } else if (activeTab === 'prompt') {
        if (resource.section !== 'prompt') return false
      } else if (activeTab === 'background') {
        if (resource.section !== 'background') return false
      } else if (activeTab === 'interaction') {
        if (resource.section !== 'interaction' || resource.id.startsWith('codrops-')) return false
      } else if (activeTab === 'codrops') {
        if (!resource.id.startsWith('codrops-')) return false
      }

      // Video only filter
      if (videoOnly && !resource.previewVideoUrl) {
        return false
      }

      // Category filter
      if (selectedCategory && resource.category !== selectedCategory) {
        return false
      }

      // Technology filter
      if (selectedTech && !resource.technologies.includes(selectedTech)) {
        return false
      }

      // Search query filter
      if (q) {
        const haystack = `${resource.title} ${resource.description} ${resource.category} ${resource.tags.join(' ')} ${resource.technologies.join(' ')} ${resource.prompt || ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }

      return true
    })
  }, [activeTab, savedIds, videoOnly, selectedCategory, selectedTech, searchQuery])

  // Reset filters
  const hasActiveFilters = Boolean(
    searchQuery || selectedCategory || selectedTech || videoOnly || (activeTab !== 'all' && activeTab !== 'saved')
  )

  const handleResetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedTech('')
    setVideoOnly(false)
    setActiveTab('all')
  }, [])

  // Modal navigation
  const currentModalIndex = useMemo(() => {
    if (!activeModalResource) return -1
    return filteredResources.findIndex((r) => r.id === activeModalResource.id)
  }, [activeModalResource, filteredResources])

  const handleNavigateNext = useCallback(() => {
    if (filteredResources.length === 0 || currentModalIndex === -1) return
    const nextIdx = (currentModalIndex + 1) % filteredResources.length
    setActiveModalResource(filteredResources[nextIdx])
  }, [filteredResources, currentModalIndex])

  const handleNavigatePrev = useCallback(() => {
    if (filteredResources.length === 0 || currentModalIndex === -1) return
    const prevIdx = (currentModalIndex - 1 + filteredResources.length) % filteredResources.length
    setActiveModalResource(filteredResources[prevIdx])
  }, [filteredResources, currentModalIndex])

  return (
    <div className="ds-app-shell">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedIds.size}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={{
          all: counts.all,
          prompts: counts.prompts,
          backgrounds: counts.backgrounds,
          interactions: counts.interactions,
          codrops: counts.codrops,
        }}
      />

      {/* Hero Section */}
      <Hero
        onSelectTab={setActiveTab}
        activeTab={activeTab}
        verifiedVideoCount={counts.verifiedVideos}
        totalCount={counts.all}
        promptCount={counts.prompts}
        savedCount={savedIds.size}
      />

      {/* Main Library Section */}
      <main className="ds-main-content">
        <div className="ds-container">
          {/* Filter Bar Controls */}
          <FilterBar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedTech={selectedTech}
            onSelectTech={setSelectedTech}
            availableCategories={availableCategories}
            availableTechs={availableTechs}
            resultCount={filteredResources.length}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            videoOnly={videoOnly}
            onToggleVideoOnly={() => setVideoOnly(!videoOnly)}
          />

          {/* Cards Grid or Empty State */}
          {activeTab === 'saved' && filteredResources.length === 0 ? (
            <SavedEmptyState onBrowseAll={() => setActiveTab('all')} />
          ) : filteredResources.length === 0 ? (
            <div className="ds-empty-search-state">
              <Search size={36} className="text-slate-500 mb-3" />
              <h3>No matching resources found</h3>
              <p>Try adjusting your search terms or clearing your category and technology filters.</p>
              <button type="button" className="ds-btn-reset-empty" onClick={handleResetFilters}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="ds-resource-grid">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  isSaved={savedIds.has(resource.id)}
                  onToggleSave={handleToggleSave}
                  onCopy={handleCopy}
                  onOpenDetails={setActiveModalResource}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Resource Detail Inspection Modal */}
      <ResourceModal
        resource={activeModalResource}
        isOpen={Boolean(activeModalResource)}
        isSaved={Boolean(activeModalResource && savedIds.has(activeModalResource.id))}
        onClose={() => setActiveModalResource(null)}
        onToggleSave={handleToggleSave}
        onCopy={handleCopy}
        onNavigateNext={handleNavigateNext}
        onNavigatePrev={handleNavigatePrev}
        currentIndex={currentModalIndex}
        totalCount={filteredResources.length}
      />

      {/* Footer (No GitHub links) */}
      <footer className="ds-footer">
        <div className="ds-footer-container">
          <div className="ds-footer-brand">
            <DynamicLogo size={32} />
            <p className="ds-footer-desc">
              Curated resource hub for AI website prompts, motion graphics, WebGL shaders, and high-impact interactions.
            </p>
          </div>

          <div className="ds-footer-stats">
            <div className="ds-footer-stat-item">
              <strong>65</strong>
              <span>Curated Prompts</span>
            </div>
            <div className="ds-footer-stat-item">
              <strong>58</strong>
              <span>Verified Videos</span>
            </div>
            <div className="ds-footer-stat-item">
              <strong>12</strong>
              <span>Shaders & Bg</span>
            </div>
            <div className="ds-footer-stat-item">
              <strong>10</strong>
              <span>Interactions</span>
            </div>
            <div className="ds-footer-stat-item">
              <strong>10</strong>
              <span>Codrops</span>
            </div>
          </div>

          <div className="ds-footer-bottom">
            <span>© 2026 Dynamic Sites · Built for modern web creators & AI builders</span>
            <span className="ds-footer-tagline">Designed for Lovable, Cursor, Bolt & Claude</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
