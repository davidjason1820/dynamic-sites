export type ResourceSection = 'prompt' | 'background' | 'interaction'
export type CatalogType = 'prompt' | 'code' | 'component' | 'background' | '3d-model' | 'shader' | 'demo'

export type Resource = {
  id: string
  title: string
  section: ResourceSection
  type: CatalogType
  category: string
  technologies: string[]
  description: string
  tags: string[]
  prompt: string
  code?: string
  liveUrl?: string
  tutorialUrl?: string
  assetUrl?: string
  sourceUrl: string
  license: string
  attribution: string
  commercialUse: boolean
  redistributionAllowed: boolean
  accent: string
}

const SOURCES = {
  prompts: 'https://github.com/davidjason1820/motionsites.ai',
  parallax: 'https://github.com/davidjason1820/infinite-scroll-with-parallax',
  clipMenu: 'https://github.com/davidjason1820/EaseReverseClipMenu',
  three: 'https://github.com/davidjason1820/littlesttokyo',
  skull: 'https://github.com/davidjason1820/three-skull',
} as const

const promptNames: Array<[string, string]> = [
  ['AI Designer Agency', 'Landing Pages'], ['AI Designer Portfolio', 'Landing Pages'], ['AKOR Security', 'Landing Pages'], ['ClubX Investors', 'Landing Pages'], ['CodeNest Coding Platform', 'Landing Pages'], ['E-commerce Website', 'Landing Pages'], ['Liquid Glass Agency', 'Landing Pages'], ['Mindloop Landing', 'Landing Pages'], ['NeoVision', 'Landing Pages'], ['NOVA Space Systems', 'Landing Pages'], ['Orbis NFT', 'Landing Pages'], ['SkyElite Private Jets', 'Landing Pages'], ['Space Voyage', 'Landing Pages'], ['Weblex Dark Hero', 'Landing Pages'],
  ['AI Automation Hero', 'SaaS & AI'], ['Apex SaaS', 'SaaS & AI'], ['Bionova Biotech', 'SaaS & AI'], ['ClearInvoice SaaS Hero', 'SaaS & AI'], ['Datacore Booking', 'SaaS & AI'], ['Datacore SaaS Hero', 'SaaS & AI'], ['Digitwist AI Builder', 'SaaS & AI'], ['Finlytic AI Agent', 'SaaS & AI'], ['Grow AI Talent Platform', 'SaaS & AI'], ['HR SaaS Hero', 'SaaS & AI'], ['Mindloop SaaS', 'SaaS & AI'], ['Neuralyn SaaS', 'SaaS & AI'], ['Nexora Automation', 'SaaS & AI'], ['Nickel Payments', 'SaaS & AI'], ['Planet Orbit SaaS', 'SaaS & AI'], ['Price Calculator', 'SaaS & AI'], ['Synapse Dark Hero', 'SaaS & AI'], ['Targo Logistics Hero', 'SaaS & AI'], ['Taskora SaaS Hero', 'SaaS & AI'], ['Terra Geo Map', 'SaaS & AI'],
  ['Aethera Studio', 'Hero Sections'], ['Asme', 'Hero Sections'], ['Automation Machines', 'Hero Sections'], ['Bloom AI', 'Hero Sections'], ['DesignPro Academy', 'Hero Sections'], ['EVR Ventures', 'Hero Sections'], ['Nexus IT Solutions', 'Hero Sections'], ['Power AI', 'Hero Sections'], ['Railroad.ai', 'Hero Sections'], ['Stellar AI', 'Hero Sections'], ['Sync AI', 'Hero Sections'], ['Taskly', 'Hero Sections'], ['Transform Data', 'Hero Sections'], ['xPortfolio Hero', 'Hero Sections'], ['Loader Animation', 'Hero Sections'], ['New Era Automotive Hero', 'Hero Sections'], ['Orbit Web3', 'Hero Sections'], ['Web3 EOS Hero', 'Hero Sections'],
  ['Buzzentic Agency', 'Agency & 3D'], ['Glassmorphism Agency Hero', 'Agency & 3D'], ['New Era Bold Hero', 'Agency & 3D'], ['Framelix 3D Studios', 'Agency & 3D'], ['Logoisum Video Agency', 'Agency & 3D'], ['Orbit Engineers', 'Agency & 3D'], ['Velorah Agency', 'Agency & 3D'], ['Wealth Video Hero', 'Agency & 3D'], ['Investor Deck', 'Agency & 3D'],
  ['Bold Portfolio Hero', 'Portfolios'], ['Dark Portfolio Hero', 'Portfolios'], ['Portfolio Cosmic', 'Portfolios'], ['Viktor Portfolio', 'Portfolios'],
]

const palettes = ['#d6ff52', '#8ff5ff', '#ff9f68', '#b99cff', '#f2f0e8', '#77d6b5']
const promptLicense = 'MIT repository license; verify embedded media and third-party assets before reuse.'

export const prompts: Resource[] = promptNames.map(([title, category], index) => ({
  id: `prompt-${index + 1}`,
  title,
  section: 'prompt',
  type: 'prompt',
  category,
  technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'HLS.js'],
  description: `A production-ready ${category.toLowerCase()} direction for ${title}, with a clear hierarchy, cinematic motion, and responsive intent.`,
  tags: [category, index % 3 === 0 ? 'Cinematic' : index % 3 === 1 ? 'Dark mode' : 'Responsive', index % 2 ? 'Motion' : 'Editorial'],
  prompt: `Build a ${title} experience with a confident visual system, clear hierarchy, expressive but purposeful motion, responsive behavior, and production-ready details. Use the ${category.toLowerCase()} brief as the source of truth.`,
  code: index % 3 === 0 ? `// ${title}\n// Use the source prompt as the visual and interaction brief.\n// Preserve the source attribution when adapting media.` : undefined,
  sourceUrl: SOURCES.prompts,
  liveUrl: SOURCES.prompts,
  license: promptLicense,
  attribution: 'MotionSites.ai Prompt Library / original prompt and media creators where applicable.',
  commercialUse: true,
  redistributionAllowed: false,
  accent: palettes[index % palettes.length],
}))

const backgroundNames: Array<[string, string, CatalogType, string, string[]]> = [
  ['Infinite Parallax Gallery', 'Parallax & Scroll', 'demo', SOURCES.parallax, ['Parallax', 'Lenis', 'GSAP']],
  ['Seamless Hero Loop', 'Parallax & Scroll', 'background', SOURCES.parallax, ['Infinite scroll', 'Scrubbed', 'Responsive']],
  ['Image Drift Field', 'Parallax & Scroll', 'background', SOURCES.parallax, ['ScrollTrigger', 'Marquee', 'Depth']],
  ['Snap-Scroll Atmosphere', 'Parallax & Scroll', 'shader', SOURCES.parallax, ['Snap', 'Scroll', 'Motion']],
  ['Clip Reveal Video', 'Clip Menus & Video', 'background', SOURCES.clipMenu, ['Clip-path', 'Video', 'GSAP']],
  ['Radial Cover Scatter', 'Clip Menus & Video', 'demo', SOURCES.clipMenu, ['Radial motion', 'Elastic', 'Menu']],
  ['EaseReverse Exit Field', 'Clip Menus & Video', 'background', SOURCES.clipMenu, ['EaseReverse', 'Interruptible', 'Timeline']],
  ['WebGL Procedural Surface', 'Three.js & WebGL', 'shader', SOURCES.three, ['Three.js', 'WebGL', 'Shader']],
  ['Postprocess Bloom Room', 'Three.js & WebGL', 'background', SOURCES.three, ['Three.js', 'Post-processing', 'Depth']],
  ['Particle Geometry Drift', 'Three.js & WebGL', '3d-model', SOURCES.three, ['Three.js', 'Geometry', 'Particles']],
  ['Skeleton Fluid Reveal', 'Three.js & WebGPU', 'background', SOURCES.skull, ['WebGPU', 'TSL', 'Fluid']],
  ['CRT Scanline Void', 'Three.js & WebGPU', 'shader', SOURCES.skull, ['Bloom', 'Scan lines', 'WebGPU']],
]

const sourceLicense: Record<string, { license: string; attribution: string; commercialUse: boolean; redistributionAllowed: boolean }> = {
  [SOURCES.parallax]: { license: 'MIT code; bundled client images are restricted to the tutorial repository and live demo.', attribution: 'Joe Ben Taylor; client-owned tutorial imagery must not be redistributed.', commercialUse: false, redistributionAllowed: false },
  [SOURCES.clipMenu]: { license: 'MIT code; bundled generated media should be reviewed separately before reuse.', attribution: 'Codrops / original demo authors; media credits remain with their creators.', commercialUse: true, redistributionAllowed: false },
  [SOURCES.three]: { license: 'MIT Three.js repository; individual example assets may have separate terms.', attribution: 'Three.js authors / original example contributors.', commercialUse: true, redistributionAllowed: true },
  [SOURCES.skull]: { license: 'MIT code; bundled models and media should be reviewed separately before redistribution.', attribution: 'Codrops / Cullen Webber / Three.js contributors.', commercialUse: true, redistributionAllowed: false },
}

export const backgrounds: Resource[] = backgroundNames.map(([title, category, type, sourceUrl, tags], index) => {
  const terms = sourceLicense[sourceUrl]
  return {
    id: `background-${index + 1}`,
    title,
    section: 'background',
    type,
    category,
    technologies: tags.filter(tag => ['Lenis', 'GSAP', 'Three.js', 'WebGL', 'WebGPU', 'TSL'].includes(tag)),
    description: `A source-grounded ambient direction based on ${title.toLowerCase()}, adapted for a dark Dynamic Sites canvas without copying the original demo branding.`,
    tags: ['Background', ...tags],
    prompt: `Create a ${title.toLowerCase()} layer with restrained contrast, cinematic depth, responsive behavior, and a readable foreground. Respect the source repository's license and attribution requirements.`,
    code: `// ${title}\n// Source pattern: ${sourceUrl}\n// Adapt the motion; do not redistribute restricted media.`,
    sourceUrl,
    liveUrl: sourceUrl,
    license: terms.license,
    attribution: terms.attribution,
    commercialUse: terms.commercialUse,
    redistributionAllowed: terms.redistributionAllowed,
    accent: palettes[(index + 2) % palettes.length],
  }
})

const interactionNames: Array<[string, CatalogType, string, string[]]> = [
  ['Liquid Glass 3D Tilt Card', 'component', SOURCES.parallax, ['React', 'Pointer', 'Depth']],
  ['Magnetic Cursor Attraction CTA', 'component', SOURCES.parallax, ['Cursor', 'Spring', 'Motion']],
  ['Kinetic Split-Typography Wave', 'component', SOURCES.parallax, ['Marquee', 'Type', 'Scroll']],
  ['Prismatic Refraction Border', 'component', SOURCES.clipMenu, ['GSAP', 'Timeline', 'Elastic']],
  ['Radial Clip Menu', 'component', SOURCES.clipMenu, ['GSAP', 'Clip-path', 'Menu']],
  ['Interruptible Reverse Motion', 'code', SOURCES.clipMenu, ['EaseReverse', 'A11y', 'Controls']],
  ['WebGL Scene Boot Sequence', 'code', SOURCES.three, ['Three.js', 'Renderer', 'Camera']],
  ['Postprocess Shader Stack', 'shader', SOURCES.three, ['Three.js', 'Shader', 'Bloom']],
  ['Fluid Skeleton Reveal', 'demo', SOURCES.skull, ['WebGPU', 'TSL', 'Fluid']],
  ['Accessible Loading Transition', 'component', SOURCES.skull, ['Loading', 'CSS', 'Responsive']],
]

export const interactions: Resource[] = interactionNames.map(([title, type, sourceUrl, tags], index) => {
  const terms = sourceLicense[sourceUrl]
  return {
    id: `interaction-${index + 1}`,
    title,
    section: 'interaction',
    type,
    category: 'Micro-Interactions',
    technologies: tags.filter(tag => ['GSAP', 'Three.js', 'WebGPU', 'TSL', 'CSS'].includes(tag)),
    description: `A focused interaction study for ${title.toLowerCase()}, distilled from an authorized source and framed as a reusable Dynamic Sites building block.`,
    tags: ['Interaction', ...tags],
    prompt: `Implement ${title} as a polished, accessible interaction. Keep the motion purposeful, preserve reduced-motion behavior, and credit the original source when adapting code or assets.`,
    code: `export function DynamicInteraction() {\n  // ${title}\n  // Source: ${sourceUrl}\n  return <div data-interaction="${title}">${title}</div>\n}`,
    sourceUrl,
    liveUrl: sourceUrl,
    license: terms.license,
    attribution: terms.attribution,
    commercialUse: terms.commercialUse,
    redistributionAllowed: terms.redistributionAllowed,
    accent: palettes[(index + 3) % palettes.length],
  }
})

export const allResources = [...prompts, ...backgrounds, ...interactions]

export const coreCounts = {
  prompts: prompts.length,
  backgrounds: backgrounds.length,
  interactions: interactions.length,
} as const

type ExternalCatalogItem = { label: string; count: number; suffix?: string; note: string }

export const externalCatalog: ExternalCatalogItem[] = [
  { label: 'External prompts', count: 813, note: 'Inventory-only collection; external ownership and license terms apply.' },
  { label: 'Claude prompts', count: 40, note: 'Example prompts and media remain subject to their original terms.' },
  { label: 'Cinematic videos', count: 50, suffix: '+', note: 'Counted as external media references, not redistributed assets.' },
  { label: 'Transparent 3D cut-outs', count: 30, note: 'External asset references with per-item terms.' },
  { label: 'Images', count: 29, note: 'External image references with per-item terms.' },
  { label: 'Technique recipes', count: 55, suffix: '+', note: 'External implementation references.' },
  { label: 'React components/backgrounds', count: 215, suffix: '+', note: 'External collection; not part of the core count.' },
  { label: 'GLB models', count: 991, suffix: '+', note: 'External model registry; license varies by collection.' },
  { label: 'Poly Pizza models', count: 10700, suffix: '+', note: 'External model references with per-model terms.' },
  { label: 'Codrops entries', count: 10, note: 'External tutorial/demo references.' },
]

export const catalogedResourceUnits = 13020
