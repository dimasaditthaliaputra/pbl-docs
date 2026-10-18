import React from 'react'
import { Info, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react'
import { cn } from '@/src/lib/utils'

export type CalloutType =
  'info' | 'warning' | 'peringatan' | 'danger' | 'larangan' | 'success' | 'tip'

export interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

const calloutConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>
    defaultTitle: string
    containerClass: string
    iconClass: string
    titleClass: string
  }
> = {
  info: {
    icon: Info,
    defaultTitle: 'Informasi',
    containerClass:
      'border-blue-500/30 bg-blue-50/60 dark:border-blue-500/30 dark:bg-blue-950/20 text-blue-950 dark:text-blue-100',
    iconClass: 'text-blue-600 dark:text-blue-400',
    titleClass: 'text-blue-900 dark:text-blue-300 font-semibold',
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: 'Peringatan',
    containerClass:
      'border-amber-500/30 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-950/20 text-amber-950 dark:text-amber-100',
    iconClass: 'text-amber-600 dark:text-amber-400',
    titleClass: 'text-amber-900 dark:text-amber-300 font-semibold',
  },
  peringatan: {
    icon: AlertTriangle,
    defaultTitle: 'Peringatan',
    containerClass:
      'border-amber-500/30 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-950/20 text-amber-950 dark:text-amber-100',
    iconClass: 'text-amber-600 dark:text-amber-400',
    titleClass: 'text-amber-900 dark:text-amber-300 font-semibold',
  },
  danger: {
    icon: AlertOctagon,
    defaultTitle: 'Larangan',
    containerClass:
      'border-red-500/30 bg-red-50/60 dark:border-red-500/30 dark:bg-red-950/20 text-red-950 dark:text-red-100',
    iconClass: 'text-red-600 dark:text-red-400',
    titleClass: 'text-red-900 dark:text-red-300 font-semibold',
  },
  larangan: {
    icon: AlertOctagon,
    defaultTitle: 'Larangan',
    containerClass:
      'border-red-500/30 bg-red-50/60 dark:border-red-500/30 dark:bg-red-950/20 text-red-950 dark:text-red-100',
    iconClass: 'text-red-600 dark:text-red-400',
    titleClass: 'text-red-900 dark:text-red-300 font-semibold',
  },
  success: {
    icon: CheckCircle2,
    defaultTitle: 'Tips & Praktik Baik',
    containerClass:
      'border-emerald-500/30 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    titleClass: 'text-emerald-900 dark:text-emerald-300 font-semibold',
  },
  tip: {
    icon: CheckCircle2,
    defaultTitle: 'Tips & Praktik Baik',
    containerClass:
      'border-emerald-500/30 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    titleClass: 'text-emerald-900 dark:text-emerald-300 font-semibold',
  },
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type] ?? calloutConfig.info
  const Icon = config.icon
  const displayTitle = title ?? config.defaultTitle
  const isAlert = type === 'danger' || type === 'larangan'

  return (
    <aside
      role={isAlert ? 'alert' : 'note'}
      aria-label={displayTitle}
      className={cn(
        'shadow-xs my-6 flex gap-3.5 rounded-xl border p-4 text-sm leading-relaxed transition-colors',
        config.containerClass
      )}
    >
      <div className="shrink-0 pt-0.5">
        <Icon className={cn('h-5 w-5', config.iconClass)} />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        {displayTitle && <p className={config.titleClass}>{displayTitle}</p>}
        <div className="prose-sm text-sm text-foreground/85 dark:text-foreground/90 [&>p]:m-0 [&>p]:leading-relaxed [&>ul]:my-2 [&>ul]:list-disc [&>ul]:pl-4">
          {children}
        </div>
      </div>
    </aside>
  )
}
