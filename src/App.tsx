import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Bookmark, Check, Code2, Copy, ExternalLink, Filter, Layers3, Menu, Search, Sparkles, X } from 'lucide-react'
import { allResources, coreCounts, externalCatalog, interactions, prompts, type Resource, type ResourceSection } from './data'

type FilterTab = 'all' | ResourceSection
type ResourceWithPreview = Resource & { previewVideoUrl?: string; previewEmbedUrl?: string }
const tabs: Array<{ label: string; value: FilterTab }> = [
  { label: 'Everything', value: 'all' }, { label: 'Prompts', value: 'prompt' },
  { label: 'Backgrounds', value: 'background' }, { label: 'Interactions', value: 'interaction' }, { label: 'External', value: 'external' },
]
const categories = [
  { label: 'Prompts', description: 'Landing pages and product narratives', count: coreCounts.prompts, route: '/explore/prompts' },
  { label: 'Motion', description: 'Backgrounds and ambient loops', count: coreCounts.backgrounds, route: '/explore/backgrounds' },
  { label: 'Interactions', description: 'Buttons, menus, scroll, and UI motion', count: coreCounts.interactions, route: '/explore/components' },
  { label: 'Collections', description: 'External sources and references', count: externalCatalog.length, route: '/about' },
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
function safeSavedItems(): string[] {
  try { const parsed = JSON.parse(localStorage.getItem('dynamic-sites-saved') || '[]'); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [] }
  catch { return [] }
}
function formatCount(value: number) { return new Intl.NumberFormat('en-US').format(value) }

function Preview({ resource, compact = false }: { resource: Resource; compact?: boolean }) {
  const preview = resource as ResourceWithPreview
  if (preview.previewVideoUrl) return <div className={`site-preview ${compact ? 'site-preview-compact' : ''}`}><video src={preview.previewVideoUrl} controls muted playsInline preload="metadata" aria-label={`Video preview of ${resource.title}`} /></div>
  if (preview.previewEmbedUrl) return <div className={`site-preview ${compact ? 'site-preview-compact' : ''}`}><iframe src={preview.previewEmbedUrl} title={`Live preview of ${resource.title}`} loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerPolicy="strict-origin-when-cross-origin" /></div>
  return <div className={`concept-preview ${compact ? 'concept-preview-compact' : ''}`} style={{ '--accent': resource.accent } as React.CSSProperties} aria-label={`Concept preview for ${resource.title}`}>
    <div className="concept-topline"><span className="concept-brand">{resource.title.split(' ')[0]}</span><span className="concept-menu">INDEX&nbsp;&nbsp; STUDIO&nbsp;&nbsp; ABOUT</span></div>
    <div className="concept-content">
      <div className="concept-copy"><span className="concept-kicker">{resource.category} · CONCEPT PREVIEW</span><strong>{resource.title}</strong><p>{resource.description}</p><span className="concept-link">Explore the experience&nbsp; ↗</span></div>
      <div className="concept-art" aria-hidden="true"><div className="concept-orbit orbit-a"/><div className="concept-orbit orbit-b"/><div className="concept-glass"/><span>DS—01</span></div>
    </div>
    <div className="concept-foot"><span>VISUAL DIRECTION</span><span>CONCEPT PREVIEW · NOT A LIVE SITE</span></div>
  </div>
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
  const [saved, setSaved] = useState<string[]>(safeSavedItems)
  const [toast, setToast] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const perPage = 9
  const routeSection = sectionFromRoute(route)
  const isSavedRoute = route === '/saved'
  const isInfoRoute = route === '/about' || route === '/submit'
  const featured = prompts[0] ?? allResources[0]
  const availableCategories = useMemo(() => ['All categories', ...Array.from(new Set(allResources.map(resource => resource.category)))], [])
  const tags = useMemo(() => ['All tags', ...Array.from(new Set(allResources.flatMap(resource => resource.tags)))], [])
  const filtered = useMemo(() => allResources.filter(resource => {
    const haystack = `${resource.title} ${resource.description} ${resource.category} ${resource.tags.join(' ')} ${resource.technologies.join(' ')} ${resource.prompt} ${resource.attribution}`.toLowerCase()
    const section = routeSection || activeTab
    return (!query || haystack.includes(query.toLowerCase())) && (category === 'All categories' || resource.category === category) && (tag === 'All tags' || resource.tags.includes(tag)) && (!isSavedRoute || saved.includes(resource.id)) && (section === 'all' || resource.section === section)
  }), [activeTab, category, isSavedRoute, query, routeSection, saved, tag])
  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const visible = filtered.slice((page - 1) * perPage, page * perPage)
  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2200) }
  function toggleSaved(id: string) {
    const next = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id]
    setSaved(next); localStorage.setItem('dynamic-sites-saved', JSON.stringify(next)); notify(next.includes(id) ? 'Saved to your collection' : 'Removed from saved')
  }
  async function copy(text: string, label: string) {
    try { await navigator.clipboard.writeText(text); notify(`${label} copied`) }
    catch { notify('Clipboard unavailable in this browser') }
  }
  function navigate(nextRoute: string) {
    window.history.pushState({}, '', nextRoute); setRoute(nextRoute); setPage(1)
    if (!nextRoute.startsWith('/resource/')) window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function openResource(resource: Resource) { setReturnRoute(route); setSelected(resource); window.history.pushState({}, '', `/resource/${resource.id}`); setRoute(`/resource/${resource.id}`) }
  function closeResource() { setSelected(null); navigate(returnRoute) }
  function changeTab(value: FilterTab) { setActiveTab(value); setPage(1) }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.querySelector<HTMLInputElement>('.hero-search input')?.focus() }
      if (event.key === 'Escape' && selected) closeResource()
    }
    const onPop = () => setRoute(window.location.pathname)
    window.addEventListener('keydown', onKey); window.addEventListener('popstate', onPop)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('popstate', onPop) }
  }, [selected, returnRoute])

  return <div className="app-shell"><div className="noise" />
    <header className="topbar">
      <a className="brand" href="/" onClick={event => { event.preventDefault(); navigate('/') }} aria-label="Dynamic Sites home"><span className="brand-mark"><span className="brand-mark-inner">DS</span></span><span className="brand-word">dynamic<span className="brand-dot">.</span>sites</span></a>
      <nav className="desktop-nav" aria-label="Primary navigation"><a href="/explore" onClick={event => { event.preventDefault(); navigate('/explore') }}>Explore</a><a href="/explore/backgrounds" onClick={event => { event.preventDefault(); navigate('/explore/backgrounds') }}>Motion</a><a href="/explore/components" onClick={event => { event.preventDefault(); navigate('/explore/components') }}>Interactions</a><a href="/saved" onClick={event => { event.preventDefault(); navigate('/saved') }}>Saved <span className="nav-count">{saved.length}</span></a></nav>
      <div className="top-actions"><button className="icon-button" onClick={() => setShowFilters(!showFilters)} aria-label="Toggle filters"><Filter size={17} /></button><button className="menu-button" aria-label="Open menu"><Menu size={17} /></button><button className="outline-button" onClick={() => navigate('/about')}>About</button></div>
    </header>

    <main id="top">{isInfoRoute ? <InfoPage route={route} onNavigate={navigate} /> : <>
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow"><span className="pulse-dot" /> A considered library for digital makers</p><h1>Ideas, set<br/>in <em>motion.</em></h1><p className="hero-lede">A carefully sourced library of website prompts, motion systems, and interaction patterns for making the internet feel more alive.</p>
          <div className="hero-search"><Search size={16}/><input aria-label="Search resources" value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="Search the collection"/><kbd>⌘ K</kbd></div>
          <div className="hero-actions"><button className="primary-button" onClick={() => navigate('/explore')}>Explore the library <ArrowUpRight size={16}/></button><button className="secondary-button" onClick={() => navigate('/explore/backgrounds')}>Discover motion</button></div>
          <div className="hero-metrics"><div><strong>{coreCounts.prompts}</strong><span>prompt directions</span></div><div><strong>{coreCounts.backgrounds}</strong><span>motion studies</span></div><div><strong>{coreCounts.interactions}</strong><span>interactions</span></div></div>
        </div>
        <div className="hero-preview-wrap"><div className="preview-caption"><span>01 — SELECTED DIRECTION</span><button onClick={() => openResource(featured)}>View prompt <ArrowUpRight size={13}/></button></div><Preview resource={featured}/><div className="preview-note">Original concept visualization · source video previews appear when a verified URL is supplied.</div></div>
      </section>

      <section className="category-showcase" aria-label="Browse by category">{categories.map(item => <button key={item.label} className="category-tile" onClick={() => navigate(item.route)}><div className="category-tile-top"><span className="category-name">{item.label}</span><span className="category-count">{String(item.count).padStart(2, '0')}</span></div><p>{item.description}</p><span className="category-arrow"><ArrowUpRight size={15}/></span></button>)}</section>

      <section className="library-section" id="library"><div className="section-heading"><div><p className="eyebrow">{isSavedRoute ? 'Collection / Saved' : routeSection ? `Explore / ${routeSection}` : 'The collection'}</p><h2>{isSavedRoute ? 'Saved for later' : 'Find your next direction'}</h2></div><div className="heading-inline"><span>{filtered.length} resources</span></div></div>
        <div className="toolbar"><div className="tabs" aria-label="Resource tabs">{tabs.map(tab => <button key={tab.value} className={activeTab === tab.value && !routeSection ? 'active' : ''} onClick={() => changeTab(tab.value)}>{tab.label}</button>)}</div><button className="filter-toggle" onClick={() => setShowFilters(!showFilters)} aria-label="Advanced filters"><Filter size={15}/> Refine</button></div>
        {showFilters && <div className="filter-drawer"><div className="filter-group"><label>Category</label><select value={category} onChange={event => { setCategory(event.target.value); setPage(1) }}>{availableCategories.map(item => <option key={item} value={item}>{item}</option>)}</select></div><div className="filter-group"><label>Tag</label><select value={tag} onChange={event => { setTag(event.target.value); setPage(1) }}>{tags.map(item => <option key={item} value={item}>{item}</option>)}</select></div></div>}
        {visible.length ? <div className="resource-grid">{visible.map(resource => <ResourceCard key={resource.id} resource={resource} saved={saved.includes(resource.id)} onSave={() => toggleSaved(resource.id)} onOpen={() => openResource(resource)} onCopy={() => copy(resource.prompt, 'Prompt')}/>)}</div> : <div className="empty-state"><h3>No matching resources</h3><p>Try clearing a filter or using a broader search.</p><button className="secondary-button" onClick={() => { setQuery(''); setCategory('All categories'); setTag('All tags'); setActiveTab('all'); setPage(1) }}>Clear filters</button></div>}
        <div className="pagination"><span>Showing {filtered.length ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span><div className="pager-controls"><button onClick={() => setPage(value => Math.max(1, value - 1))} disabled={page === 1}>Previous</button><button onClick={() => setPage(value => Math.min(pages, value + 1))} disabled={page >= pages}>Next</button></div></div>
      </section>

      <section className="catalog-scope"><div className="scope-copy"><p className="eyebrow">Curation & provenance</p><h2>87 core resources.<br/><em>12,933+ external units.</em></h2><p>The core collection is explicitly represented and sourced. Wider external counts are inventory estimates—not a claim that every item has been individually imported, verified, or cleared for reuse.</p></div><div className="scope-grid">{externalCatalog.slice(0, 6).map(item => <div key={item.label} className="scope-item"><strong>{item.label}</strong><span>{item.count}{item.suffix || ''}</span></div>)}</div></section>

      <section className="split-section" id="backgrounds"><div className="split-copy"><p className="eyebrow">Motion studies</p><h2>Atmosphere is<br/>part of the <em>story.</em></h2><p>Parallax, shader, and ambient motion directions to make a digital space feel considered, not static.</p><button className="secondary-button" onClick={() => navigate('/explore/backgrounds')}>Explore motion <ArrowUpRight size={15}/></button></div><div className="split-preview"><div className="motion-art"><div className="motion-art-orbit orbit-one"/><div className="motion-art-orbit orbit-two"/><span>FORM / FIELD<br/>MOTION STUDY 001</span></div></div></section>

      <section className="interaction-section" id="interactions"><div className="section-heading"><div><p className="eyebrow">Interaction studies</p><h2>Small gestures.<br/><em>Lasting impression.</em></h2></div><button className="text-link" onClick={() => navigate('/explore/components')}>View all <ArrowUpRight size={14}/></button></div><div className="interaction-grid">{interactions.slice(0, 3).map(resource => <button key={resource.id} className="interaction-card" onClick={() => openResource(resource)}><span className="interaction-pill">{typeLabel(resource.type)}</span><h3>{resource.title}</h3><p>{resource.description}</p><span className="card-arrow"><ArrowUpRight size={16}/></span></button>)}</div></section>

      <section className="saved-section"><div className="saved-copy"><p className="eyebrow">A personal edit</p><h2>Keep what<br/><em>moves you.</em></h2><p>{saved.length ? `Your collection has ${saved.length} saved resource${saved.length === 1 ? '' : 's'}.` : 'Save ideas worth coming back to. Your collection stays on this device.'}</p><button className="primary-button" onClick={() => navigate('/saved')}>Open saved collection <ArrowUpRight size={15}/></button></div></section>
    </>}</main>

    <footer><div className="brand footer-brand"><span className="brand-mark"><span className="brand-mark-inner">DS</span></span><span className="brand-word">dynamic<span className="brand-dot">.</span>sites</span></div><span>Independent curation for the considered web.</span><button onClick={() => navigate('/about')}>Sources & attribution</button></footer>
    {selected && <DetailModal resource={selected} saved={saved.includes(selected.id)} onClose={closeResource} onSave={() => toggleSaved(selected.id)} onCopyPrompt={() => copy(selected.prompt, 'Prompt')} onCopyCode={() => copy(selected.code || '', 'Code')}/>}
    {toast && <div className="toast"><Check size={15}/> {toast}</div>}
  </div>
}

function InfoPage({ route, onNavigate }: { route: string; onNavigate: (path: string) => void }) {
  const isSubmit = route === '/submit'
  return <section className="route-panel"><p className="eyebrow">{isSubmit ? 'Submit resource' : 'About Dynamic Sites'}</p><h1>{isSubmit ? <>Bring the <em>good stuff.</em></> : <>A living system for <em>better web ideas.</em></>}</h1><p>Dynamic Sites curates prompts, motion backgrounds, and interaction patterns for digital makers. We keep resources source-aware, clearly attributed, and honest about their license and preview status.</p><div className="route-actions"><button className="primary-button" onClick={() => onNavigate('/explore')}>Explore catalog</button><button className="secondary-button" onClick={() => onNavigate('/submit')}>Submit a resource</button></div></section>
}

function ResourceCard({ resource, saved, onSave, onOpen, onCopy }: { resource: Resource; saved: boolean; onSave: () => void; onOpen: () => void; onCopy: () => void }) {
  return <article className="resource-card"><button className="card-visual" onClick={onOpen} aria-label={`Open ${resource.title} preview`}><Preview resource={resource} compact/></button><div className="card-content"><div className="card-meta"><span className="type-pill">{typeIcon(resource.type)} {typeLabel(resource.type)}</span><button className="save-button" onClick={onSave} aria-label={saved ? 'Remove saved resource' : 'Save resource'}><Bookmark size={14} fill={saved ? 'currentColor' : 'none'}/></button></div><h3>{resource.title}</h3><p>{resource.description}</p><div className="card-tags">{resource.tags.slice(0, 3).map(item => <span key={item}>{item}</span>)}</div><div className="card-actions"><button onClick={onOpen}>View details <ArrowUpRight size={13}/></button><button onClick={onCopy}><Copy size={13}/> Copy prompt</button></div></div></article>
}

function DetailModal({ resource, saved, onClose, onSave, onCopyPrompt, onCopyCode }: { resource: Resource; saved: boolean; onClose: () => void; onSave: () => void; onCopyPrompt: () => void; onCopyCode: () => void }) {
  return <div className="modal-backdrop" onMouseDown={event => event.currentTarget === event.target && onClose()}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="resource-title"><button className="modal-close" onClick={onClose} aria-label="Close resource details"><X size={16}/></button><div className="modal-header"><div><p className="eyebrow">{typeLabel(resource.type)} / {resource.category}</p><h3 id="resource-title">{resource.title}</h3></div><button className="save-button modal-save" onClick={onSave} aria-label={saved ? 'Remove saved resource' : 'Save resource'}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'}/></button></div><Preview resource={resource}/><p className="preview-note">{(resource as ResourceWithPreview).previewVideoUrl || (resource as ResourceWithPreview).previewEmbedUrl ? 'Preview supplied by the source.' : 'Concept visualization only. No verified source video or live-site embed is available for this resource.'}</p><div className="modal-copy"><p>{resource.description}</p><div className="card-tags">{resource.tags.map(item => <span key={item}>{item}</span>)}</div><div className="provenance"><strong>Attribution & license</strong><p>{resource.attribution}</p><p>{resource.license}</p></div><div className="modal-actions"><button className="primary-button" onClick={onCopyPrompt}>Copy prompt</button>{resource.code && <button className="secondary-button" onClick={onCopyCode}>Copy code</button>}{resource.sourceUrl && <a className="inline-link" href={resource.sourceUrl} target="_blank" rel="noreferrer">View source <ExternalLink size={14}/></a>}{resource.liveUrl && resource.liveUrl !== resource.sourceUrl && <a className="inline-link" href={resource.liveUrl} target="_blank" rel="noreferrer">Open demo <ArrowUpRight size={14}/></a>}</div></div></div></div>
}
