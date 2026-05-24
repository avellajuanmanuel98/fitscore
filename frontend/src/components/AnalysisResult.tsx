import { RotateCcw } from 'lucide-react'
import type { AnalysisResult } from '../types'

interface Props {
  result: AnalysisResult
  onReset: () => void
}

// ─── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const color  = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const glow   = score >= 75 ? 'rgba(16,185,129,0.2)' : score >= 50 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'
  const label  = score >= 75 ? 'Excelente fit' : score >= 50 ? 'Fit moderado' : 'Fit bajo'
  const radius = 52
  const circ   = 2 * Math.PI * radius
  const offset = circ - (score / 100) * circ

  return (
    <div className="flex flex-col items-center gap-4 shrink-0">
      <div className="relative w-36 h-36">
        <div className="absolute inset-0 rounded-full blur-2xl animate-glow" style={{ background: glow }} />
        <svg className="relative w-full h-full -rotate-90" viewBox="0 0 116 116">
          <circle cx="58" cy="58" r={radius} fill="none"
            style={{ stroke: 'var(--border)' }} strokeWidth="7" />
          <circle cx="58" cy="58" r={radius} fill="none"
            stroke={color} strokeWidth="7"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-invisible text-4xl leading-none" style={{ color }}>{score}</span>
          <span className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>/ 100</span>
        </div>
      </div>
      <span className="text-xs font-semibold px-3 py-1 rounded-full tracking-wide"
        style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}>
        {label}
      </span>
    </div>
  )
}

// ─── Skill dot (matched o gap) ──────────────────────────────────────────────
function SkillRow({ name, matched }: { name: string; matched: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2.5"
      style={{ borderBottom: '1px solid var(--border)' }}>
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{
          background: matched ? '#10b981' : 'transparent',
          border: matched ? 'none' : '1.5px dashed #ef4444',
        }}
      />
      <span className="text-sm font-mono" style={{ color: matched ? 'var(--text-2)' : 'var(--text-3)' }}>
        {name}
      </span>
      {matched && (
        <span className="ml-auto text-xs font-semibold" style={{ color: 'var(--accent-mid)' }}>detectado</span>
      )}
    </div>
  )
}

// ─── Fortaleza highlight ────────────────────────────────────────────────────
function Strength({ text, index }: { text: string; index: number }) {
  const labels = ['01', '02', '03', '04']
  return (
    <div className="flex items-start gap-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <span className="font-invisible text-2xl leading-none shrink-0"
        style={{ color: 'var(--text-1)' }}>{labels[index] ?? '0' + (index + 1)}</span>
      <p className="text-sm leading-relaxed pt-0.5" style={{ color: 'var(--text-2)' }}>{text}</p>
    </div>
  )
}

// ─── Recommendation card ────────────────────────────────────────────────────
function Rec({ text, index }: { text: string; index: number }) {
  const priority = index === 0 ? { label: 'Alta prioridad', color: '#ef4444', bg: 'var(--rec-high-bg)' }
                 : index === 1 ? { label: 'Media prioridad', color: '#f59e0b', bg: 'var(--rec-mid-bg)' }
                 : { label: 'Complementario', color: '#34d399', bg: 'var(--rec-low-bg)' }
  return (
    <div className="p-4 rounded-xl transition-all"
      style={{ background: priority.bg, border: `1px solid ${priority.color}15` }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: priority.color }} />
        <span className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: priority.color }}>{priority.label}</span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-3)' }}>{text}</p>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function AnalysisResult({ result, onReset }: Props) {
  const allSkills = [
    ...result.habilidades_encontradas.map(s => ({ name: s, matched: true })),
    ...result.habilidades_faltantes.map(s => ({ name: s, matched: false })),
  ]

  return (
    <div className="space-y-6 animate-fade-up">

      {/* ── Hero card: score + resumen ── */}
      <div className="rounded-2xl p-8 flex flex-col lg:flex-row items-center gap-10"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <ScoreRing score={result.score} />
        <div className="flex-1 text-center lg:text-left">
          <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>
            Evaluación general
          </p>
          <h3 className="font-invisible text-2xl mb-3" style={{ color: 'var(--text-1)' }}>
            Análisis completado
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-3)' }}>{result.resumen}</p>
        </div>
      </div>

      {/* ── Fila central: habilidades + fortalezas ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Mapa de habilidades */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--text-1)' }}>
              Mapa de habilidades
            </p>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-1)' }}>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> detectado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full border border-dashed border-red-500" /> faltante
              </span>
            </div>
          </div>
          <div className="mt-4">
            {allSkills.map((s, i) => <SkillRow key={i} name={s.name} matched={s.matched} />)}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(result.habilidades_encontradas.length / allSkills.length) * 100}%`,
                  background: 'linear-gradient(90deg, #10b981, #059669)',
                  transition: 'width 1.2s ease-out',
                }}
              />
            </div>
            <span className="text-xs font-mono shrink-0" style={{ color: 'var(--text-3)' }}>
              {result.habilidades_encontradas.length}/{allSkills.length}
            </span>
          </div>
        </div>

        {/* Fortalezas */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: 'var(--text-1)' }}>
            Puntos destacados
          </p>
          <div>
            {result.fortalezas.map((f, i) => <Strength key={i} text={f} index={i} />)}
          </div>
        </div>
      </div>

      {/* ── Plan de acción ── */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-mono tracking-widest uppercase mb-5" style={{ color: 'var(--text-3)' }}>
          Plan de acción
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {result.recomendaciones.map((r, i) => <Rec key={i} text={r} index={i} />)}
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-center pt-2">
        <button onClick={onReset}
          className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl transition-all"
          style={{ color: 'var(--text-3)', border: '1px solid var(--border)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--text-3)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Analizar otro CV
        </button>
      </div>
    </div>
  )
}
