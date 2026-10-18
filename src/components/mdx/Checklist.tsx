'use client'

import { useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { cn } from '@/src/lib/utils'

export interface ChecklistItem {
  id: string
  label: string
  detail?: string
}

export interface ChecklistProps {
  title?: string
  items: ChecklistItem[]
  className?: string
}

export function Checklist({
  title = 'Checklist Sebelum Selesai',
  items,
  className = '',
}: ChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const resetAll = () => {
    setChecked({})
  }

  const completedCount = items.filter((item) => checked[item.id]).length
  const totalCount = items.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div
      className={cn(
        'shadow-xs my-8 overflow-hidden rounded-xl border border-border bg-card/60',
        className
      )}
    >
      {/* Header with progress */}
      <div className="border-b border-border bg-muted/40 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {title}
            </h4>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {completedCount} dari {totalCount} kriteria terpenuhi ({progressPercent}%)
            </p>
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 self-start rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:self-auto"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="divide-y divide-border/60 p-2 sm:p-3">
        {items.map((item) => {
          const isDone = !!checked[item.id]

          return (
            <label
              key={item.id}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent/50',
                isDone && 'opacity-70'
              )}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={isDone}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                  isDone
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/40 bg-background hover:border-primary'
                )}
              >
                {isDone && <Check className="h-3 w-3 stroke-[3]" />}
              </button>

              <div className="min-w-0 flex-1 text-xs sm:text-sm">
                <span
                  className={cn(
                    'font-medium transition-all',
                    isDone
                      ? 'text-muted-foreground line-through decoration-muted-foreground/50'
                      : 'text-foreground'
                  )}
                >
                  {item.label}
                </span>
                {item.detail && (
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                )}
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
