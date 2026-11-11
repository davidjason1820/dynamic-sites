import { useMemo, useState } from 'react'
import { allResources, coreCounts, externalCatalog } from './data'

type FilterKey = 'all' | 'prompt' | 'background' | 'interaction' | 'external'

const tabs: Array<{ label: string; value: FilterKey }> = [
  { label: 'All', value: 'all' },
  { label: 'Prompts', value: 'prompt' },
  { label: 'Backgrounds', value: 'background' },
  { label: 'Interactions', value: 'interaction' },
  { label: 'External', value: 'external' },
]

const sectionLabel: Record<FilterKey, string> = {
  all: 'All resources',
  prompt: 'Prompts',
  background: 'Backgrounds',
  interaction: 'Interactions',
  external: 'External resources',
}

export default function App() {
  const [activeTab, setActiveTab] = useState<FilterKey>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allResources.filter((resource) => {
      const matchesTab = activeTab === 'all' || resource.section === activeTab
      const haystack = `${resource.title} ${resource.description} ${resource.category} ${resource.tags.join(' ')} ${resource.technologies.join(' ')} ${resource.prompt}`.toLowerCase()
      const matchesQuery = !q || haystack.includes(q)
      return matchesTab && matchesQuery
    })
  }, [activeTab, query])

  const totalResources = allResources.length
  const catalogSummary = [
    { label: 'Core prompts', value: coreCounts.prompts },
    { label: 'Backgrounds', value: coreCounts.backgrounds },
    { label: 'Interactions', value: coreCounts.interactions },
    { label: 'Catalog cards', value: totalResources },
  ]

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">DS</span>
          <span className="brand-text">Dynamic Sites</span>
        </div>

        <nav className="top-nav" aria-label="Main navigation">
          <a href="#library">Library</a>
          <a href="#catalog">Catalog</a>
          <a href="#external">External</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Resource library</p>
            <h1>Build the remarkable.</h1>
            <p className="lede">
              A clean, organized collection of prompts, motion patterns, UI ideas, and attributed external references.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#library">Explore library</a>
              <a className="secondary-button" href="#catalog">View catalog</a>
            </div>

            <div className="summary-grid">
              {catalogSummary.map((item) => (
                <div key={item.label} className="summary-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-topline">Featured prompt</div>
            <h2>AI Designer Agency</h2>
            <p>
              A landing-page direction built for strong hierarchy, cinematic motion, and modern conversion-focused storytelling.
            </p>
            <div className="panel-tags">
              <span>Landing Page</span>
              <span>React</span>
              <span>Motion</span>
            </div>
          </div>
        </section>

        <section className="library" id="library">
          <div className="section-head">
            <div>
              <p className="eyebrow">Browse</p>
              <h2>Resource library</h2>
            </div>

            <div className="search-wrap">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search prompts, categories, skills, tags..."
                aria-label="Search resources"
              />
            </div>
          </div>

          <div className="tabs" role="tablist" aria-label="Resource type tabs">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={activeTab === tab.value ? 'tab active' : 'tab'}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="results-row">
            <span>{filtered.length} results</span>
            <span>{sectionLabel[activeTab]}</span>
          </div>

          <div className="resource-grid">
            {filtered.map((resource) => (
              <article key={resource.id} className="resource-card">
                <div className="card-visual" data-section={resource.section}>
                  <span>{resource.type}</span>
                </div>
                <div className="card-body">
                  <div className="card-meta">
                    <span>{resource.section}</span>
                    <span>{resource.category}</span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>

                  <div className="tag-list">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span key={`${resource.id}-${tag}`}>{tag}</span>
                    ))}
                  </div>

                  <div className="card-links">
                    <a href={resource.sourceUrl} target="_blank" rel="noreferrer">
                      Source
                    </a>
                    <a href={resource.liveUrl ?? resource.sourceUrl} target="_blank" rel="noreferrer">
                      Preview
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="catalog" id="catalog">
          <div className="section-head compact">
            <div>
              <p className="eyebrow">Scope</p>
              <h2>Catalog overview</h2>
            </div>
          </div>

          <div className="catalog-grid">
            {externalCatalog.map((item) => (
              <div key={item.label} className="catalog-card">
                <strong>{item.count}{item.suffix ?? ''}</strong>
                <span>{item.label}</span>
                <small>{item.note}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="external" id="external">
          <div className="section-head compact">
            <div>
              <p className="eyebrow">External</p>
              <h2>Attribution-first references</h2>
            </div>
          </div>

          <div className="resource-grid compact-grid">
            {allResources.filter((resource) => resource.section === 'external').slice(0, 6).map((resource) => (
              <article key={resource.id} className="resource-card">
                <div className="card-visual muted" data-section="external">
                  <span>External</span>
                </div>
                <div className="card-body">
                  <div className="card-meta">
                    <span>{resource.type}</span>
                    <span>{resource.category}</span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
