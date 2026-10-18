import React from 'react'
import { Workflow, Layers, ArrowRight, CornerDownLeft, Database } from 'lucide-react'
import { cn } from '@/src/lib/utils'

export interface DiagramProps {
  title?: string
  caption?: string
  type?: 'request-flow' | 'data-flow' | 'architecture' | 'custom'
  children?: React.ReactNode
  className?: string
}

export function Diagram({
  title,
  caption,
  type = 'request-flow',
  children,
  className = '',
}: DiagramProps) {
  return (
    <figure
      className={cn(
        'shadow-xs my-8 overflow-hidden rounded-xl border border-border bg-card',
        className
      )}
    >
      {/* Diagram Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Workflow className="h-4 w-4 text-primary" />
          <span>{title || 'Diagram Alur Sistem PAGORA'}</span>
        </div>
        <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
          SVG Vector
        </span>
      </div>

      {/* Diagram Canvas */}
      <div
        role="img"
        aria-label={title || 'Diagram Alur Sistem PAGORA'}
        className="overflow-x-auto p-6"
      >
        {type === 'request-flow' && <RequestFlowDiagram />}
        {type === 'data-flow' && <DataFlowDiagram />}
        {type === 'architecture' && <ArchitectureDiagram />}
        {type === 'custom' && children}
      </div>

      {/* Diagram Caption */}
      {caption && (
        <figcaption className="border-t border-border/60 bg-muted/20 px-4 py-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function RequestFlowDiagram() {
  const steps = [
    {
      layer: 'Browser / React',
      file: 'Inertia useForm',
      color:
        'border-blue-500/40 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200',
      badge: 'Frontend',
    },
    {
      layer: 'Route',
      file: 'routes/web.php',
      color:
        'border-slate-500/40 bg-slate-50/70 dark:bg-slate-900/30 text-slate-900 dark:text-slate-200',
      badge: 'Routing',
    },
    {
      layer: 'Form Request',
      file: 'StoreKomoditasRequest',
      color:
        'border-indigo-500/40 bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200',
      badge: 'Validasi',
    },
    {
      layer: 'Controller',
      file: 'KomoditasController (Tipis)',
      color:
        'border-purple-500/40 bg-purple-50/70 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200',
      badge: 'Controller',
    },
    {
      layer: 'Service',
      file: 'KomoditasService',
      color:
        'border-amber-500/40 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200',
      badge: 'Bisnis & Transaksi',
    },
    {
      layer: 'Repository',
      file: 'KomoditasRepositoryInterface',
      color:
        'border-teal-500/40 bg-teal-50/70 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200',
      badge: 'Interface Query',
    },
    {
      layer: 'Model',
      file: 'Komoditas (Eloquent)',
      color:
        'border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200',
      badge: 'ORM',
    },
    {
      layer: 'Database',
      file: 'PostgreSQL',
      color:
        'border-cyan-500/40 bg-cyan-50/70 dark:bg-cyan-950/30 text-cyan-900 dark:text-cyan-200',
      badge: 'RDBMS',
    },
  ]

  return (
    <div className="min-w-[760px] space-y-6">
      {/* Request Flow (Left to Right) */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          1. Alur Request (Masuk ke Database)
        </p>
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.layer}>
              <div
                className={cn(
                  'shadow-xs flex flex-col items-center justify-center rounded-lg border px-3 py-2.5 text-center',
                  step.color
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  {step.badge}
                </span>
                <span className="text-xs font-bold">{step.layer}</span>
                <span className="mt-0.5 font-mono text-[10px] opacity-80">{step.file}</span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Response Flow (Right to Left) */}
      <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          2. Alur Response (Kembali ke Browser)
        </p>
        <div className="mt-2 flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <CornerDownLeft className="h-3.5 w-3.5 text-primary" />
            ResponseHelper::success() / Inertia::render()
          </span>
          <span className="text-xs">
            FlashHandler (suara + toast) ← HandleInertiaRequests ← Controller ← Service ← Model
          </span>
        </div>
      </div>
    </div>
  )
}

function DataFlowDiagram() {
  return (
    <div className="min-w-[700px] space-y-4">
      <div className="grid grid-cols-4 gap-3 text-center text-xs">
        <div className="rounded-lg border border-blue-500/30 bg-blue-50/50 p-3 dark:bg-blue-950/20">
          <p className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
            Frontend
          </p>
          <p className="mt-1 font-semibold text-foreground">Index.jsx</p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            TanStack Table (search, sort, page)
          </p>
        </div>

        <div className="rounded-lg border border-purple-500/30 bg-purple-50/50 p-3 dark:bg-purple-950/20">
          <p className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
            Controller
          </p>
          <p className="mt-1 font-semibold text-foreground">KomoditasController@index</p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            IndexKomoditasRequest validasi query
          </p>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-50/50 p-3 dark:bg-amber-950/20">
          <p className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
            Service & Repo
          </p>
          <p className="mt-1 font-semibold text-foreground">KomoditasRepository</p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            Whitelist sort, paginate(min(perPage, 100))
          </p>
        </div>

        <div className="rounded-lg border border-emerald-500/30 bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
          <p className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
            Resource
          </p>
          <p className="mt-1 font-semibold text-foreground">KomoditasResource</p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            Collection data tanpa expose id (hanya uuid)
          </p>
        </div>
      </div>
    </div>
  )
}

function ArchitectureDiagram() {
  return (
    <div className="min-w-[650px] space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
        <div className="flex items-center justify-center gap-2 font-semibold text-primary">
          <Layers className="h-4 w-4" />
          <span>PAGORA Monolith (Satu Project / Repositori)</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs">
        <div className="rounded-lg border border-border bg-card p-3.5">
          <p className="font-semibold text-foreground">Backend: Laravel 11</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• MVC + Service Repository</li>
            <li>• Fortify (Email) + Socialite (Google)</li>
            <li>• PostgreSQL Database</li>
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg border border-primary/30 bg-primary/10 p-3.5 text-center">
          <p className="font-bold text-primary">Inertia.js Bridge</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Inertia::render() langsung menyajikan React tanpa REST API terpisah
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3.5">
          <p className="font-semibold text-foreground">Frontend: React + Vite</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• shadcn/ui & Tailwind CSS</li>
            <li>• TanStack Table & Dropzone</li>
            <li>• Sound & Toast Notifications</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
