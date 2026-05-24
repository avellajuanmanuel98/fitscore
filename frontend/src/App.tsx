import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './hooks/useTheme'
import InputForm from './components/InputForm'
import AnalysisResult from './components/AnalysisResult'
import type { AnalysisResult as AnalysisResultType } from './types'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

async function analyzeCV(job: string, cv: string | File): Promise<AnalysisResultType> {
  let res: Response
  if (cv instanceof File) {
    const form = new FormData()
    form.append('job_description', job)
    form.append('cv_file', cv)
    res = await fetch(`${API_BASE}/api/analyze/`, { method: 'POST', body: form })
  } else {
    res = await fetch(`${API_BASE}/api/analyze/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description: job, cv_text: cv }),
    })
  }
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al analizar')
  return data
}

export default function App() {
  const { isDark, toggle } = useTheme()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResultType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (job: string, cv: string | File) => {
    setLoading(true)
    setError(null)
    try {
      setResult(await analyzeCV(job, cv))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', transition: 'background 0.3s' }}>

      {/* Glow de fondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(ellipse, var(--glow) 0%, transparent 70%)', opacity: 1 }} />
      </div>

      {/* Header */}
      <header className="relative z-10" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg)', transition: 'all 0.3s' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo SVG */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1"/>
              <path d="M9 24 A11 11 0 0 1 27 24" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M11.5 24 A8.5 8.5 0 0 1 24.5 24" stroke="var(--accent-mid)" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <line x1="18" y1="24" x2="13" y2="14" stroke="var(--accent-light)" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="18" cy="24" r="2" fill="var(--accent-mid)"/>
            </svg>
            <div>
              <h1 className="font-invisible text-lg leading-none tracking-wide" style={{ color: 'var(--text-1)' }}>
                FitScore
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>
                CV Analyzer · LLaMA 3.3 70B
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Badge ecualizador */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{ background: 'var(--badge-bg)', border: '1px solid var(--badge-border)' }}>
              <div className="flex items-end gap-0.5 h-4">
                <div className="eq-bar" /><div className="eq-bar" />
                <div className="eq-bar" /><div className="eq-bar" />
              </div>
              <span className="text-xs font-mono font-semibold tracking-widest uppercase"
                style={{ color: 'var(--accent)' }}>
                IA · Lista
              </span>
            </div>

            {/* Toggle dark/light */}
            <button
              onClick={toggle}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark
                ? <Sun className="w-4 h-4" style={{ color: 'var(--accent-mid)' }} />
                : <Moon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              }
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        {/* Hero */}
        {!result && (
          <div className="text-center mb-12">
            <p className="text-xs font-mono tracking-widest uppercase mb-5" style={{ color: 'var(--accent)' }}>
              Análisis inteligente de CV
            </p>
            <h2 className="font-invisible text-5xl lg:text-6xl leading-tight mb-5" style={{ color: 'var(--text-1)' }}>
              ¿Encajas en{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                esa oferta?
              </span>
            </h2>
            <p className="text-base max-w-md mx-auto" style={{ color: 'var(--text-3)' }}>
              La IA analiza tu CV contra la oferta, detecta qué te falta
              y te dice exactamente cómo mejorar.
            </p>
          </div>
        )}

        {result && (
          <div className="mb-8">
            <h2 className="font-invisible text-3xl" style={{ color: 'var(--text-1)' }}>
              Resultado del análisis
            </h2>
          </div>
        )}

        {error && (
          <div className="rounded-2xl px-5 py-4 mb-6 text-sm"
            style={{ background: 'var(--err-bg)', border: '1px solid var(--err-border)', color: 'var(--err-text)' }}>
            ⚠️ {error}
          </div>
        )}

        {!result
          ? <InputForm onAnalyze={handleAnalyze} loading={loading} />
          : <AnalysisResult result={result} onReset={() => setResult(null)} />
        }
      </main>

      <footer className="relative z-10 mt-20" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between text-xs"
          style={{ color: 'var(--text-4)' }}>
          <span>React · TypeScript · Django · PyMuPDF · Groq API</span>
          <span>FitScore · Juan Manuel García Avella</span>
        </div>
      </footer>
    </div>
  )
}
