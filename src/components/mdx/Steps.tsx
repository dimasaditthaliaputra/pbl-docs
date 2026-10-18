import React from 'react'
import { cn } from '@/src/lib/utils'

export interface StepsProps {
  children: React.ReactNode
  className?: string
}

export interface StepProps {
  title?: string
  stepNumber?: number
  children: React.ReactNode
  className?: string
}

export function Step({ title, stepNumber, children, className = '' }: StepProps) {
  return (
    <div className={cn('relative', className)}>
      {stepNumber !== undefined && (
        <span
          className="shadow-xs absolute -left-[35px] flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-bold text-primary-foreground"
          aria-hidden="true"
        >
          {stepNumber}
        </span>
      )}
      {title && (
        <h4 className="mb-2 text-base font-semibold tracking-tight text-foreground">{title}</h4>
      )}
      <div className="prose-sm text-sm leading-relaxed text-muted-foreground [&>p]:my-1 [&>p]:leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export function Steps({ children, className = '' }: StepsProps) {
  let counter = 1

  const childrenWithNumbers = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const stepNum = counter++
      return React.cloneElement(child as React.ReactElement<StepProps>, {
        stepNumber: (child.props as StepProps).stepNumber ?? stepNum,
      })
    }
    return child
  })

  return (
    <div className={cn('my-8 ml-4 space-y-8 border-l-2 border-border/70 pl-6', className)}>
      {childrenWithNumbers}
    </div>
  )
}

Steps.Step = Step
