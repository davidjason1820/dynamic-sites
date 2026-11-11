import React, { useMemo } from 'react'
import { Sparkles, Code2, Layers, Cpu } from 'lucide-react'

interface ConceptPreviewProps {
  title: string
  type: string
  category: string
  accent?: string
  className?: string
  aspectRatio?: '16/9' | '4/3' | '1/1'
}

export const ConceptPreview: React.FC<ConceptPreviewProps> = ({
  title,
  type,
  category,
  accent = '#6366f1',
  className = '',
}) => {
  // Deterministic seed based on title
  const seed = useMemo(() => {
    let hash = 0
    for (let i = 0; i < title.length; i++) {
      hash = (hash << 5) - hash + title.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash)
  }, [title])

  const patternType = seed % 4

  const IconComponent = useMemo(() => {
    switch (type) {
      case 'shader':
      case 'background':
        return Layers
      case 'component':
      case 'code':
        return Code2
      case '3d-model':
      case 'demo':
        return Cpu
      default:
        return Sparkles
    }
  }, [type])

  return (
    <div
      className={`concept-preview-box ${className}`}
      style={{
        background: `radial-gradient(circle at ${(seed % 60) + 20}% ${(seed % 40) + 30}%, ${accent}22 0%, #0d1017 80%)`,
        borderColor: `${accent}33`,
      }}
    >
      {/* Decorative background grid / geometry */}
      <div className="concept-grid-overlay" />

      {patternType === 0 && (
        <div className="concept-radial-rings">
          <div className="ring ring-1" style={{ borderColor: `${accent}40` }} />
          <div className="ring ring-2" style={{ borderColor: `${accent}25` }} />
          <div className="ring ring-3" style={{ borderColor: `${accent}15` }} />
        </div>
      )}

      {patternType === 1 && (
        <div className="concept-mesh-waves">
          <div className="wave wave-1" style={{ background: `linear-gradient(45deg, ${accent}20, transparent)` }} />
          <div className="wave wave-2" style={{ background: `linear-gradient(135deg, ${accent}15, transparent)` }} />
        </div>
      )}

      {patternType === 2 && (
        <div className="concept-isometric-grid">
          <div className="iso-plane" style={{ borderColor: `${accent}30` }} />
        </div>
      )}

      {patternType === 3 && (
        <div className="concept-abstract-cubes">
          <div className="cube cube-1" style={{ borderColor: `${accent}40` }} />
          <div className="cube cube-2" style={{ borderColor: `${accent}25` }} />
        </div>
      )}

      {/* Center content */}
      <div className="concept-content">
        <div className="concept-icon-wrap" style={{ color: accent, borderColor: `${accent}50` }}>
          <IconComponent size={24} />
        </div>
        <p className="concept-title">{title}</p>
        <span className="concept-category">{category}</span>
      </div>

      {/* Prominent Concept Preview Badge */}
      <div className="concept-pill-badge">
        <Sparkles size={11} className="concept-pill-icon" />
        <span>Concept preview</span>
      </div>
    </div>
  )
}
