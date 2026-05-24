import { useState, useRef } from 'react'
import { Briefcase, FileText, Upload, Zap, Loader2, X } from 'lucide-react'

interface Props {
  onAnalyze: (job: string, cv: string | File) => void
  loading: boolean
}

type CvMode = 'text' | 'pdf'

const inputStyle = {
  background: 'var(--input-bg)',
  border: '1px solid var(--border)',
  color: 'var(--text-1)',
  transition: 'border-color 0.2s',
}

export default function InputForm({ onAnalyze, loading }: Props) {
  const [job, setJob] = useState('')
  const [cvText, setCvText] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [mode, setMode] = useState<CvMode>('text')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'pdf' && cvFile) onAnalyze(job.trim(), cvFile)
    else if (mode === 'text' && cvText.trim()) onAnalyze(job.trim(), cvText.trim())
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type === 'application/pdf') setCvFile(file)
  }

  const cvReady = mode === 'text' ? cvText.trim().length > 100 : cvFile !== null
  const filled = job.trim().length > 50 && cvReady

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Oferta */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: 'var(--text-3)' }}>
          <Briefcase className="w-3.5 h-3.5" style={{ color: 'var(--accent-mid)' }} />
          Oferta de trabajo
        </label>
        <textarea
          value={job}
          onChange={e => setJob(e.target.value)}
          placeholder="Pega aquí la descripción completa de la oferta..."
          rows={8}
          required
          className="w-full resize-none rounded-2xl px-5 py-4 text-sm outline-none leading-relaxed"
          style={{ ...inputStyle, minHeight: '200px' }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <p className="text-xs mt-1.5 text-right" style={{ color: 'var(--text-4)' }}>{job.length} chars</p>
      </div>

      {/* CV */}
      <div>
        <div className="flex items-center gap-4 mb-3">
          <label className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--text-3)' }}>
            <FileText className="w-3.5 h-3.5" style={{ color: 'var(--accent-mid)' }} />
            Tu CV
          </label>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {(['text', 'pdf'] as CvMode[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setCvFile(null) }}
                className="px-3 py-1 text-xs font-medium transition-all"
                style={{
                  background: mode === m ? 'var(--accent)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-3)',
                }}
              >
                {m === 'text' ? 'Pegar texto' : 'Subir PDF'}
              </button>
            ))}
          </div>
        </div>

        {mode === 'text' ? (
          <>
            <textarea
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              placeholder="Pega aquí el texto de tu CV completo..."
              rows={8}
              className="w-full resize-none rounded-2xl px-5 py-4 text-sm outline-none leading-relaxed"
              style={{ ...inputStyle, minHeight: '200px' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-mid)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
            <p className="text-xs mt-1.5 text-right" style={{ color: 'var(--text-4)' }}>{cvText.length} chars</p>
          </>
        ) : (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl py-12 cursor-pointer transition-all"
            style={{
              background: dragging ? 'var(--drag-hover)' : 'var(--input-bg)',
              border: `2px dashed ${cvFile || dragging ? 'var(--accent-mid)' : 'var(--border)'}`,
            }}
          >
            <input ref={fileRef} type="file" accept=".pdf" className="hidden"
              onChange={e => setCvFile(e.target.files?.[0] || null)} />
            {cvFile ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl"
                  style={{ background: 'var(--skill-bg)', border: '1px solid var(--skill-border)' }}>
                  <FileText className="w-4 h-4" style={{ color: 'var(--accent-mid)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--accent-mid)' }}>{cvFile.name}</span>
                  <button type="button" onClick={e => { e.stopPropagation(); setCvFile(null) }}>
                    <X className="w-3.5 h-3.5" style={{ color: 'var(--accent-mid)' }} />
                  </button>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                  {(cvFile.size / 1024).toFixed(0)} KB · Haz clic para cambiar
                </p>
              </>
            ) : (
              <>
                <div className="p-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <Upload className="w-5 h-5" style={{ color: 'var(--accent-mid)' }} />
                </div>
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                  Arrastra tu PDF aquí o <span style={{ color: 'var(--accent-mid)' }}>haz clic</span>
                </p>
                <p className="text-xs" style={{ color: 'var(--text-4)' }}>Solo archivos PDF</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={!filled || loading}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: filled && !loading ? 'linear-gradient(135deg, var(--accent), var(--accent-mid))' : 'var(--surface)',
          color: filled && !loading ? '#fff' : 'var(--text-3)',
          border: `1px solid ${filled && !loading ? 'transparent' : 'var(--border)'}`,
          boxShadow: filled && !loading ? '0 0 30px rgba(16,185,129,0.25)' : 'none',
        }}
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Analizando con IA...</>
          : <><Zap className="w-4 h-4" /> Analizar compatibilidad</>
        }
      </button>
    </form>
  )
}
