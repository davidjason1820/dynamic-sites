import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Bookmark, Check, Code2, Copy, ExternalLink, Filter, Layers3, Menu, Search, Sparkles, X } from 'lucide-react'
import { allResources, backgrounds, catalogedResourceUnits, coreCounts, externalCatalog, interactions, prompts, type Resource, type ResourceSection } from './data'

type FilterTab = 'all' | ResourceSection

const tabs: Array<{ label: string; value: FilterTab }> = [
  { label: 'Everything', value: 'all' },
  { label: 'Prompts', value: 'prompt' },
  { label: 'Backgrounds', value: 'background' },
  { label: 'Interactions', value: 'interaction' },
]

function typeLabel(type: Resource['type']) {
  if (type === 'prompt') return 'Prompt'
  if (type === 'background' || type === 'shader') return 'Background'
  if (type === '3d-model') return '3D / WebGL'
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

  const categories = useMemo(() => ['All categories', ...Array.from(new Set(allResources.map(resource => resource.category)))], [])
  const tags = useMemo(() => ['All tags', ...Array.from(new Set(allResources.flatMap(resource => resource.tags)))], [])
  const filtered = useMemo(() => allResources.filter(resource => {
    const haystack = `${resource.title} ${resource.description} ${resource.category} ${resource.tags.join(' ')} ${resource.technologies.join(' ')} ${resource.prompt} ${resource.attribution}`.toLowerCase()
    const selectedSection = routeSection || activeTab
    return (isSavedRoute ? saved.includes(resource.id) : true) && (selectedSection === 'all' || resource.section === selectedSection) && (category === 'All categories' || resource.category === category) && (tag === 'All tags' || resource.tags.includes(tag)) && haystack.includes(query.toLowerCase())
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
      <a className="brand" href="/" onClick={event => { event.preventDefault(); navigate('/') }} aria-label="Dynamic Sites home"><span className="brand-mark"><i>D</i><i>S</i></span><span>dynamic<span className="brand-dot">.</span>sites</span></a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="/explore" onClick={event => { event.preventDefault(); navigate('/explore') }}>Explore</a>
        <a href="/explore/backgrounds" onClick={event => { event.preventDefault(); navigate('/explore/backgrounds') }}>Backgrounds</a>
        <a href="/explore/components" onClick={event => { event.preventDefault(); navigate('/explore/components') }}>Interactions</a>
        <a href="/saved" onClick={event => { event.preventDefault(); navigate('/saved') }}>Saved <span className="nav-count">{saved.length}</span></a>
      </nav>
      <div className="top-actions"><button className="icon-button" onClick={() => setShowFilters(!showFilters)} aria-label="Toggle filters"><Filter size={17} /></button><button className="menu-button" onClick={() => setShowFilters(!showFilters)} aria-label="Menu"><Menu size={18} /></button><a className="outline-button" href="/explore" onClick={event => { event.preventDefault(); navigate('/explore') }}>Explore <ArrowUpRight size={16} /></a></div>
    </header>

    <main id="top">
      {isInfoRoute ? <InfoPage route={route} onNavigate={navigate} /> : <>
        <section className="hero">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="hero-copy"><p className="eyebrow"><span className="pulse-dot" /> A living library for digital makers</p><h1>Build the <em>remarkable.</em></h1><p className="hero-lede">Prompts, motion, code, and 3D resources for people who care about the final 10%.</p><div className="hero-search"><Search size={20} /><input value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="Search prompts, motion, code..." /><kbd>⌘ / Ctrl K</kbd></div><div className="hero-meta"><span><strong>{coreCounts.prompts}</strong> core prompts</span><span><strong>{coreCounts.backgrounds}</strong> backgrounds</span><span><strong>{coreCounts.interactions}</strong> interactions</span><span><strong>{catalogedResourceUnits.toLocaleString()}</strong> cataloged units</span></div></div>
          <div className="hero-card"><div className="hero-card-visual"><div className="visual-grid" /><div className="visual-glow" /><span className="hero-card-label">Featured prompt / 001</span><span className="hero-card-title">Liquid intelligence<br /><em>in motion.</em></span><span className="hero-card-corner">DS / 01</span></div><div className="hero-card-footer"><span>AI Designer Agency</span><button onClick={() => openResource(prompts[0])}>View prompt <ArrowUpRight size={14} /></button></div></div>
        </section>

        <section className="library-section" id="library"><div className="section-heading"><div><p className="eyebrow">{isSavedRoute ? '05 / Saved resources' : routeSection ? `Explore / ${routeSection}` : '01 / Browse the collection'}</p><h2>{isSavedRoute ? <>Your saved <em>collection.</em></> : <>Find your next <em>starting point.</em></>}</h2></div><p className="section-note">{isSavedRoute ? (saved.length ? 'A focused shelf of the ideas you want to keep close.' : 'Nothing saved yet. Bookmark a resource to build this shelf.') : 'A curated system of references, recipes, and building blocks. Save what sparks something.'}</p></div>
          <div className="toolbar"><div className="tabs">{tabs.map(tab => <button key={tab.value} className={activeTab === tab.value && !routeSection ? 'active' : ''} onClick={() => changeTab(tab.value)}>{tab.label}<span>{tab.value === 'all' ? allResources.length : tab.value === 'prompt' ? coreCounts.prompts : tab.value === 'background' ? coreCounts.backgrounds : coreCounts.interactions}</span></button>)}</div><div className="toolbar-right"><select value={category} onChange={event => { setCategory(event.target.value); setPage(1) }} aria-label="Filter by category">{categories.map(item => <option key={item}>{item}</option>)}</select><select value={tag} onChange={event => { setTag(event.target.value); setPage(1) }} aria-label="Filter by tag">{tags.map(item => <option key={item}>{item}</option>)}</select><span className="result-count">{filtered.length} results</span></div></div>
          {showFilters && <div className="filter-drawer"><span>Filter by type</span>{tabs.map(tab => <button key={tab.value} onClick={() => changeTab(tab.value)}>{tab.label}</button>)}<button onClick={() => { setQuery(''); setCategory('All categories'); setTag('All tags'); setActiveTab('all'); setPage(1) }}>Reset</button></div>}
          <div className="resource-grid">{visible.map(resource => <ResourceCard key={resource.id} resource={resource} saved={saved.includes(resource.id)} onSave={() => toggleSaved(resource.id)} onOpen={() => openResource(resource)} onCopy={() => copy(resource.prompt, 'Prompt')} />)}</div>
          <div className="pagination"><span>Showing {filtered.length ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span><div>{Array.from({ length: pages }, (_, index) => index + 1).map(number => <button key={number} className={page === number ? 'current' : ''} onClick={() => setPage(number)}>{String(number).padStart(2, '0')}</button>)}</div></div>
        </section>

        <section className="catalog-scope"><div><p className="eyebrow">05 / Catalog scope</p><h2>87 core resources.<br /><em>13,020 cataloged units.</em></h2><p>Dynamic Sites keeps its core collection separate from the broader external inventory. External collections stay attributed and are not presented as owned repositories or redistributed assets.</p></div><div className="scope-grid">{externalCatalog.slice(0, 6).map(item => <div className="scope-card" key={item.label}><strong>{item.count.toLocaleString()}{item.suffix || ''}</strong><span>{item.label}</span></div>)}</div></section>

        <section className="split-section" id="backgrounds"><div className="split-copy"><p className="eyebrow">02 / Ambient backgrounds</p><h2>Give the page a <em>pulse.</em></h2><p>Loops, shaders, and spatial atmospheres that make the first viewport feel alive without fighting the content.</p><button className="text-button" onClick={() => navigate('/explore/backgrounds')}>Explore backgrounds <ArrowUpRight size={16} /></button></div><div className="mini-stack">{backgrounds.slice(0, 3).map((item, index) => <button key={item.id} className={`mini-card mini-${index}`} onClick={() => openResource(item)}><span className="mini-index">0{index + 1}</span><strong>{item.title}</strong><span>{item.tags.slice(0, 3).join(' · ')}</span></button>)}</div></section>
        <section className="interaction-section" id="interactions"><div className="section-heading"><div><p className="eyebrow">03 / Interaction lab</p><h2>Small physics. <em>Big feeling.</em></h2></div><p className="section-note">Micro-interactions with enough restraint to feel intentional and enough energy to be remembered.</p></div><div className="interaction-row">{interactions.slice(0, 5).map((item, index) => <button key={item.id} className="interaction-tile" onClick={() => openResource(item)} style={{ '--accent': item.accent } as React.CSSProperties}><span>0{index + 1}</span><strong>{item.title}</strong><i><ArrowUpRight size={16} /></i></button>)}</div></section>
        <section className="saved-section" id="saved"><div className="saved-copy"><p className="eyebrow">04 / Your collection</p><h2>Keep the <em>good stuff.</em></h2><p>{saved.length ? `You have ${saved.length} resource${saved.length === 1 ? '' : 's'} saved for later.` : 'Bookmark ideas as you explore and build your own private shelf of references.'}</p><a href="/saved" className="outline-button" onClick={event => { event.preventDefault(); navigate('/saved') }}>{saved.length ? 'Open saved' : 'Start saving'} <ArrowUpRight size={16} /></a></div><div className="saved-mark"><Bookmark size={34} strokeWidth={1.2} /><span>DS / SAVED</span></div></section>
      </>}
    </main>
    <footer><div className="brand footer-brand"><span className="brand-mark"><i>D</i><i>S</i></span><span>dynamic<span className="brand-dot">.</span>sites</span></div><span>For the curious, the precise, and the slightly obsessed.</span><div className="footer-links"><a href="/submit" onClick={event => { event.preventDefault(); navigate('/submit') }}>Submit</a><a href="/about" onClick={event => { event.preventDefault(); navigate('/about') }}>About</a><span>© 2026 Dynamic Sites</span></div></footer>
    {selected && <DetailModal resource={selected} saved={saved.includes(selected.id)} onClose={closeResource} onSave={() => toggleSaved(selected.id)} onCopyPrompt={() => copy(selected.prompt, 'Prompt')} onCopyCode={() => selected.code && copy(selected.code, 'Code')} />}
    {toast && <div className="toast"><Check size={15} /> {toast}</div>}
  </div>
}

function InfoPage({ route, onNavigate }: { route: string; onNavigate: (path: string) => void }) {
  const isSubmit = route === '/submit'
  return <section className="route-panel"><p className="eyebrow">{isSubmit ? 'Submit Resource' : 'About Dynamic Sites'}</p><h1>{isSubmit ? <>Bring the <em>good stuff.</em></> : <>A living system for <em>better builds.</em></>}</h1><p>{isSubmit ? 'Have a prompt, interaction, shader, or 3D experiment worth sharing? This route is reserved for the submission workflow and keeps attribution at the center.' : 'Dynamic Sites is an independent, source-conscious library for prompts, motion, code, and 3D references. The core collection stays small and inspectable while the external inventory remains clearly attributed.'}</p><div className="route-actions"><button className="outline-button" onClick={() => onNavigate('/explore')}>Explore the core <ArrowUpRight size={15} /></button><button className="text-button" onClick={() => onNavigate('/')}>Back home <ArrowUpRight size={15} /></button></div></section>
}

function ResourceCard({ resource, saved, onSave, onOpen, onCopy }: { resource: Resource; saved: boolean; onSave: () => void; onOpen: () => void; onCopy: () => void }) {
  return <article className="resource-card"><button className="card-visual" onClick={onOpen} style={{ '--accent': resource.accent } as React.CSSProperties}><div className="card-scanlines" /><div className="card-orb" /><span className="resource-type">{typeIcon(resource.type)} {typeLabel(resource.type)}</span><span className="card-code">DS / {resource.id.split('-')[1].padStart(2, '0')}</span><strong>{resource.title}</strong><span className="card-open">Open <ArrowUpRight size={15} /></span></button><div className="card-body"><div><p className="card-category">{resource.category}</p><h3>{resource.title}</h3><p>{resource.description}</p></div><div className="card-footer"><div className="tag-row">{resource.tags.slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}</div><div className="card-actions"><button onClick={onCopy} aria-label="Copy resource"><Copy size={15} /></button><button onClick={onSave} aria-label="Save resource" className={saved ? 'saved' : ''}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'} /></button></div></div></div></article>
}

function DetailModal({ resource, saved, onClose, onSave, onCopyPrompt, onCopyCode }: { resource: Resource; saved: boolean; onClose: () => void; onSave: () => void; onCopyPrompt: () => void; onCopyCode: () => void }) {
  return <div className="modal-backdrop" onMouseDown={event => event.currentTarget === event.target && onClose()}><div className="modal"><button className="modal-close" onClick={onClose} aria-label="Close detail"><X size={18} /></button><div className="modal-visual" style={{ '--accent': resource.accent } as React.CSSProperties}><span>{typeLabel(resource.type)} / {resource.category}</span><strong>{resource.title}</strong></div><div className="modal-content"><div className="modal-heading"><div><p className="eyebrow">Resource specification</p><h2>{resource.title}</h2></div><button className={saved ? 'save-button saved' : 'save-button'} onClick={onSave}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}</button></div><p className="modal-description">{resource.description}</p><div className="modal-tags">{resource.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="modal-actions"><button onClick={onCopyPrompt}><Copy size={14} /> Copy prompt</button>{resource.code && <button onClick={onCopyCode}><Code2 size={14} /> Copy code</button>}{resource.liveUrl && <a href={resource.liveUrl} target="_blank" rel="noreferrer"><ArrowUpRight size={14} /> Live demo</a>}{resource.sourceUrl && <a href={resource.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> View source</a>}</div><div className="prompt-box"><div className="prompt-box-head"><span>{resource.code ? 'Implementation note' : 'Prompt direction'}</span><button onClick={onCopyPrompt}><Copy size={14} /> Copy prompt</button></div><code>{resource.code || resource.prompt}</code></div><div className="modal-meta"><div><span>License</span><strong>{resource.license}</strong></div><div><span>Attribution</span><strong>{resource.attribution}</strong></div><div><span>Commercial use</span><strong>{resource.commercialUse ? 'Allowed subject to source terms' : 'Not cleared for redistribution'}</strong></div><div><span>Redistribution</span><strong>{resource.redistributionAllowed ? 'Allowed with license preserved' : 'Not allowed for bundled media'}</strong></div><div><span>Source</span><a href={resource.sourceUrl} target="_blank" rel="noreferrer">Open source <ExternalLink size={13} /></a></div></div></div></div></div>
}
