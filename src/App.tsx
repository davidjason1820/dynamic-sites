import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Bookmark, Check, Code2, Copy, ExternalLink, Filter, Layers3, Menu, Search, Sparkles, X } from 'lucide-react'
import { allResources, backgrounds, catalogedResourceUnits, coreCounts, externalCatalog, interactions, prompts, type Resource, type ResourceSection } from './data'

type FilterTab = 'all' | ResourceSection

const tabs: Array<{ label: string; value: FilterTab }> = [
  { label: 'Everything', value: 'all' },
  { label: 'Prompts', value: 'prompt' },
  { label: 'Backgrounds', value: 'background' },
  { label: 'Interactions', value: 'interaction' },
  { label: 'External', value: 'external' },
]

const categoryHighlights = [
  { label: 'Prompts', description: 'Landing pages and product narratives', count: coreCounts.prompts, route: '/explore/prompts' },
  { label: 'Motion', description: 'Backgrounds and ambient loops', count: coreCounts.backgrounds, route: '/explore/backgrounds' },
  { label: 'Interactions', description: 'Buttons, menus, scroll, and UI motion', count: coreCounts.interactions, route: '/explore/components' },
  { label: 'Collections', description: 'External sources, attributions, and references', count: externalCatalog.length, route: '/about' },
]

function typeLabel(type: Resource['type']) {
  if (type === 'prompt') return 'Prompt'
  if (type === 'background' || type === 'shader') return 'Background'
  if (type === '3d-model') return '3D / WebGL'
  if (type === 'resource') return 'Library'
  if (type === 'tutorial') return 'Tutorial'
  return 'Interaction'
}

function typeIcon(type: Resource['type']) {
  return type === 'prompt' ? <Sparkles size={14} /> : type === 'background' || type === 'shader' ? <Layers3 size={14} /> : <Code2 size={14} />
}

function sectionFromRoute(path: string): ResourceSection | null {
  if (path.includes('/prompts')) return 'prompt'
  if (path.includes('/backgrounds') || path.includes('/3d-assets') || path.includes('/webgl')) return 'background'
  if (path.includes('/code') || path.includes('/components')) return 'interaction'
  return null
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export default function App() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [tag, setTag] = useState('All tags')
  const [page, setPage] = useState(1)
  const [route, setRoute] = useState(window.location.pathname)
  const [selected, setSelected] = useState<Resource | null>(null)
  const [returnRoute, setReturnRoute] = useState('/')
  const [saved, setSaved] = useState<string[]>(() => JSON.parse(localStorage.getItem('dynamic-sites-saved') || '[]'))
  const [toast, setToast] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const perPage = 9
  const routeSection = sectionFromRoute(route)
  const isSavedRoute = route === '/saved'
  const isInfoRoute = route === '/about' || route === '/submit'
  const featured = prompts[0] ?? allResources[0]

  const categories = useMemo(() => ['All categories', ...Array.from(new Set(allResources.map(resource => resource.category)))], [])
  const tags = useMemo(() => ['All tags', ...Array.from(new Set(allResources.flatMap(resource => resource.tags)))], [])

  const filtered = useMemo(() => allResources.filter(resource => {
    const haystack = `${resource.title} ${resource.description} ${resource.category} ${resource.tags.join(' ')} ${resource.technologies.join(' ')} ${resource.prompt} ${resource.attribution}`.toLowerCase()
    const selectedSection = routeSection || activeTab
    const matchesQuery = !query || haystack.includes(query.toLowerCase())
    const matchesCategory = category === 'All categories' || resource.category === category
    const matchesTag = tag === 'All tags' || resource.tags.includes(tag)
    const matchesSaved = !isSavedRoute || saved.includes(resource.id)
    const matchesRoute = selectedSection === 'all' || resource.section === selectedSection

    return matchesQuery && matchesCategory && matchesTag && matchesSaved && matchesRoute
  }), [activeTab, category, isSavedRoute, query, routeSection, saved, tag])

  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const visible = filtered.slice((page - 1) * perPage, page * perPage)

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function toggleSaved(id: string) {
    const next = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem('dynamic-sites-saved', JSON.stringify(next))
    notify(next.includes(id) ? 'Saved to your collection' : 'Removed from saved')
  }

  async function copy(text: string, label: string) {
    await navigator.clipboard?.writeText(text)
    notify(`${label} copied`)
  }

  function navigate(nextRoute: string) {
    window.history.pushState({}, '', nextRoute)
    setRoute(nextRoute)
    setPage(1)
    if (nextRoute !== '/resource/' && !nextRoute.startsWith('/resource/')) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openResource(resource: Resource) {
    setReturnRoute(route)
    setSelected(resource)
    window.history.pushState({}, '', `/resource/${resource.id}`)
    setRoute(`/resource/${resource.id}`)
  }

  function closeResource() {
    setSelected(null)
    navigate(returnRoute)
  }

  function changeTab(value: FilterTab) {
    setActiveTab(value)
    setPage(1)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.querySelector<HTMLInputElement>('.hero-search input')?.focus()
      }
      if (event.key === 'Escape' && selected) closeResource()
    }
    const onPop = () => setRoute(window.location.pathname)
    window.addEventListener('keydown', onKey)
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('popstate', onPop)
    }
  }, [selected, returnRoute])

  return <div className="app-shell">
    <div className="noise" />

    <header className="topbar">
      <a className="brand" href="/" onClick={event => { event.preventDefault(); navigate('/') }} aria-label="Dynamic Sites home">
        <span className="brand-mark"><span className="brand-mark-inner">DS</span></span>
        <span className="brand-word">dynamic<span className="brand-dot">.</span>sites</span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="/explore" onClick={event => { event.preventDefault(); navigate('/explore') }}>Explore</a>
        <a href="/explore/backgrounds" onClick={event => { event.preventDefault(); navigate('/explore/backgrounds') }}>Backgrounds</a>
        <a href="/explore/components" onClick={event => { event.preventDefault(); navigate('/explore/components') }}>Interactions</a>
        <a href="/saved" onClick={event => { event.preventDefault(); navigate('/saved') }}>Saved <span className="nav-count">{saved.length}</span></a>
      </nav>

      <div className="top-actions">
        <button className="icon-button" onClick={() => setShowFilters(!showFilters)} aria-label="Toggle filters"><Filter size={17} /></button>
        <button className="menu-button" aria-label="Open menu"><Menu size={17} /></button>
        <button className="outline-button" onClick={() => navigate('/about')}>About</button>
      </div>
    </header>

    <main id="top">
      {isInfoRoute ? <InfoPage route={route} onNavigate={navigate} /> : <>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="pulse-dot" /> A living library for digital makers</p>
            <h1>Build the <em>remarkable.</em></h1>
            <p className="hero-lede">Curated prompts, motion backgrounds, and interaction patterns for modern product sites, portfolios, launches, and narrative-first experiences.</p>

            <div className="hero-search">
              <Search size={16} />
              <input
                aria-label="Search resources"
                value={query}
                onChange={event => { setQuery(event.target.value); setPage(1) }}
                placeholder="Search prompts, tags, technologies, categories"
              />
            </div>

            <div className="hero-actions">
              <button className="primary-button" onClick={() => navigate('/explore')}>
                Explore resources
                <ArrowUpRight size={16} />
              </button>
              <button className="secondary-button" onClick={() => navigate('/explore/backgrounds')}>
                Browse motion
              </button>
            </div>

            <div className="hero-metrics">
              <div>
                <strong>{formatCount(coreCounts.prompts)}</strong>
                <span>prompt directions</span>
              </div>
              <div>
                <strong>{formatCount(coreCounts.backgrounds)}</strong>
                <span>ambient loops</span>
              </div>
              <div>
                <strong>{formatCount(coreCounts.interactions)}</strong>
                <span>interaction recipes</span>
              </div>
            </div>
          </div>

          <div className="hero-preview" style={{ '--accent': featured.accent } as React.CSSProperties}>
            <div className="browser-bar">
              <span className="browser-dot dot-red" />
              <span className="browser-dot dot-yellow" />
              <span className="browser-dot dot-green" />
              <span className="browser-address">dynamic-sites.app</span>
            </div>

            <div className="preview-window">
              <div className="preview-top-row">
                <div>
                  <p className="preview-label">Featured prompt</p>
                  <h3>{featured.title}</h3>
                </div>
                <button className="preview-save" onClick={() => toggleSaved(featured.id)} aria-label="Save featured resource">
                  <Bookmark size={14} fill={saved.includes(featured.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="preview-hero-block">
                <div className="preview-hero-copy">
                  <span className="small-tag">{featured.category}</span>
                  <p>{featured.description}</p>
                  <div className="preview-cta-row">
                    <button className="mini-primary" onClick={() => openResource(featured)}>Open</button>
                    <button className="mini-ghost" onClick={() => copy(featured.prompt, 'Prompt')}>Copy</button>
                  </div>
                </div>
                <div className="preview-hero-art">
                  <div className="art-panel giant" />
                  <div className="art-panel small" />
                </div>
              </div>

              <div className="preview-cards-row">
                <div className="stat-card">
                  <span>Hero</span>
                  <strong>07</strong>
                </div>
                <div className="stat-card">
                  <span>CTA</span>
                  <strong>02</strong>
                </div>
                <div className="stat-card highlight">
                  <span>Motion</span>
                  <strong>High</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="category-showcase">
          {categoryHighlights.map(item => (
            <button key={item.label} className="category-tile" onClick={() => navigate(item.route)}>
              <div className="category-tile-top">
                <span className="category-name">{item.label}</span>
                <span className="category-count">{item.count}</span>
              </div>
              <p>{item.description}</p>
            </button>
          ))}
        </section>

        <section className="library-section" id="library">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{isSavedRoute ? '05 / Saved resources' : routeSection ? `Explore / ${routeSection}` : '01 / Explore library'}</p>
              <h2>{isSavedRoute ? 'Your saved picks' : 'Discover the library'}</h2>
            </div>
            <div className="heading-inline">
              <span>{filtered.length} results</span>
            </div>
          </div>

          <div className="toolbar">
            <div className="tabs" aria-label="Resource tabs">
              {tabs.map(tab => (
                <button
                  key={tab.value}
                  className={activeTab === tab.value && !routeSection ? 'active' : ''}
                  onClick={() => changeTab(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)} aria-label="Advanced filters">
              <Filter size={15} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="filter-drawer">
              <div className="filter-group">
                <label>Category</label>
                <select value={category} onChange={event => { setCategory(event.target.value); setPage(1) }}>
                  {categories.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Tag</label>
                <select value={tag} onChange={event => { setTag(event.target.value); setPage(1) }}>
                  {tags.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="resource-grid">
            {visible.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                saved={saved.includes(resource.id)}
                onSave={() => toggleSaved(resource.id)}
                onOpen={() => openResource(resource)}
                onCopy={() => copy(resource.prompt, 'Prompt')}
              />
            ))}
          </div>

          <div className="pagination">
            <span>
              Showing {filtered.length ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </span>
            <div className="pager-controls">
              <button onClick={() => setPage(value => Math.max(1, value - 1))} disabled={page === 1}>Prev</button>
              <button onClick={() => setPage(value => Math.min(pages, value + 1))} disabled={page >= pages}>Next</button>
            </div>
          </div>
        </section>

        <section className="catalog-scope">
          <div className="scope-copy">
            <p className="eyebrow">02 / Catalog scope</p>
            <h2>87 core resources.<br /><em>12,933+ external units.</em></h2>
            <p>Dynamic Sites keeps the library intentionally curated: the core catalog stays explicit, sourced, and attributable, while broader external units remain clearly marked as inventory-only references until they are individually verified.</p>
          </div>

          <div className="scope-grid">
            {externalCatalog.slice(0, 6).map(item => (
              <div key={item.label} className="scope-item">
                <strong>{item.label}</strong>
                <span>{item.count}{item.suffix || ''}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="split-section" id="backgrounds">
          <div className="split-copy">
            <p className="eyebrow">03 / Ambient backgrounds</p>
            <h2>Give the page a <em>pulse.</em></h2>
            <p>From parallax loops to procedural depth, the motion layer makes each landing page feel editorial rather than static.</p>
            <button className="secondary-button" onClick={() => navigate('/explore/backgrounds')}>Browse backgrounds</button>
          </div>

          <div className="split-preview">
            <div className="mini-browser-window">
              <div className="mini-bar" />
              <div className="mini-screen">
                <div className="mini-grid" />
                <div className="mini-orb orb-one" />
                <div className="mini-orb orb-two" />
              </div>
            </div>
          </div>
        </section>

        <section className="interaction-section" id="interactions">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 / Interaction lab</p>
              <h2>Small physics. <em>Big feeling.</em></h2>
            </div>
          </div>

          <div className="interaction-grid">
            {interactions.slice(0, 3).map(resource => (
              <button key={resource.id} className="interaction-card" onClick={() => openResource(resource)}>
                <span className="interaction-pill">{typeLabel(resource.type)}</span>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="saved-section" id="saved">
          <div className="saved-copy">
            <p className="eyebrow">05 / Your collection</p>
            <h2>Keep the <em>good stuff.</em></h2>
            <p>{saved.length ? `You have ${saved.length} saved resources ready to revisit.` : 'Save prompts and interactions you want to revisit later.'}</p>
            <button className="primary-button" onClick={() => navigate('/saved')}>Open saved</button>
          </div>
        </section>
      </>}
    </main>

    <footer>
      <div className="brand footer-brand">
        <span className="brand-mark"><span className="brand-mark-inner">DS</span></span>
        <span className="brand-word">dynamic<span className="brand-dot">.</span>sites</span>
      </div>
      <span>For the curious, the coded, the experimental, and the build-ready.</span>
    </footer>

    {selected && (
      <DetailModal
        resource={selected}
        saved={saved.includes(selected.id)}
        onClose={closeResource}
        onSave={() => toggleSaved(selected.id)}
        onCopyPrompt={() => copy(selected.prompt, 'Prompt')}
        onCopyCode={() => copy(selected.code || '', 'Code')}
      />
    )}

    {toast && <div className="toast"><Check size={15} /> {toast}</div>}
  </div>
}

function InfoPage({ route, onNavigate }: { route: string; onNavigate: (path: string) => void }) {
  const isSubmit = route === '/submit'
  return <section className="route-panel">
    <p className="eyebrow">{isSubmit ? 'Submit resource' : 'About Dynamic Sites'}</p>
    <h1>{isSubmit ? <>Bring the <em>good stuff.</em></> : <>A living system for <em>better web ideas.</em></>}</h1>
    <p>
      Dynamic Sites curates prompts, motion backgrounds, and interaction patterns for digital makers. We keep the catalog explicit, source-aware, and easy to browse.
    </p>
    <div className="route-actions">
      <button className="primary-button" onClick={() => onNavigate('/explore')}>
        Explore catalog
      </button>
      <button className="secondary-button" onClick={() => onNavigate('/submit')}>
        Submit a resource
      </button>
    </div>
  </section>
}

function ResourceCard({ resource, saved, onSave, onOpen, onCopy }: { resource: Resource; saved: boolean; onSave: () => void; onOpen: () => void; onCopy: () => void }) {
  return <article className="resource-card">
    <button className="card-visual" onClick={onOpen} style={{ '--accent': resource.accent } as React.CSSProperties}>
      <div className="card-scanlines" />
      <div className="card-window-bar">
        <span />
        <span />
        <span />
      </div>
      <div className="card-window-body">
        <div className="mini-nav" />
        <div className="preview-block preview-block-large" />
        <div className="preview-row">
          <div className="preview-block preview-block-small" />
          <div className="preview-block preview-block-small" />
        </div>
      </div>
    </button>

    <div className="card-content">
      <div className="card-meta">
        <span className="type-pill">{typeIcon(resource.type)} {typeLabel(resource.type)}</span>
        <button className="save-button" onClick={onSave} aria-label="Save resource">
          <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <h3>{resource.title}</h3>
      <p>{resource.description}</p>

      <div className="card-tags">
        {resource.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}
      </div>

      <div className="card-actions">
        <button onClick={onOpen}>Open</button>
        <button onClick={onCopy}>Copy prompt</button>
      </div>
    </div>
  </article>
}

function DetailModal({ resource, saved, onClose, onSave, onCopyPrompt, onCopyCode }: { resource: Resource; saved: boolean; onClose: () => void; onSave: () => void; onCopyPrompt: () => void; onCopyCode: () => void }) {
  return <div className="modal-backdrop" onMouseDown={event => event.currentTarget === event.target && onClose()}>
    <div className="modal">
      <button className="modal-close" onClick={onClose} aria-label="Close resource details">
        <X size={16} />
      </button>

      <div className="modal-header">
        <div>
          <p className="eyebrow">{typeLabel(resource.type)}</p>
          <h3>{resource.title}</h3>
        </div>
        <button className="save-button modal-save" onClick={onSave} aria-label="Save resource">
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="modal-preview" style={{ '--accent': resource.accent } as React.CSSProperties}>
        <div className="modal-preview-window">
          <div className="preview-block preview-block-large large-modal" />
          <div className="preview-row small-row">
            <div className="preview-block preview-block-small" />
            <div className="preview-block preview-block-small" />
          </div>
        </div>
      </div>

      <div className="modal-copy">
        <p>{resource.description}</p>
        <div className="card-tags">
          {resource.tags.map(tag => <span key={tag}>{tag}</span>)}
        </div>

        <div className="modal-actions">
          <button className="primary-button" onClick={onCopyPrompt}>Copy prompt</button>
          {resource.code && <button className="secondary-button" onClick={onCopyCode}>Copy code</button>}
          {resource.liveUrl && <a className="inline-link" href={resource.liveUrl} target="_blank" rel="noreferrer">Live demo <ExternalLink size={14} /></a>}
          {resource.sourceUrl && <a className="inline-link" href={resource.sourceUrl} target="_blank" rel="noreferrer">Source <ArrowUpRight size={14} /></a>}
        </div>
      </div>
    </div>
  </div>
}
