'use client'

import React, { useState } from 'react'
import { cn } from '@/src/lib/utils'

export interface TabsProps {
  items?: string[]
  defaultValue?: string
  children: React.ReactNode
  className?: string
}

export interface TabProps {
  value: string
  label?: string
  children: React.ReactNode
}

export function Tab({ children }: TabProps) {
  return <div>{children}</div>
}

export function Tabs({ items, defaultValue, children, className = '' }: TabsProps) {
  // Extract tab definitions from children if items is not explicitly provided
  const childTabs: { value: string; label: string; element: React.ReactNode }[] = []

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const props = child.props as TabProps
      if (props.value) {
        childTabs.push({
          value: props.value,
          label: props.label || props.value,
          element: child,
        })
      }
    }
  })

  const tabList = items ? items.map((item) => ({ value: item, label: item })) : childTabs
  const initialTab = defaultValue || tabList[0]?.value || ''
  const [activeTab, setActiveTab] = useState(initialTab)

  return (
    <div
      className={cn('shadow-xs my-6 overflow-hidden rounded-xl border border-border', className)}
    >
      {/* Tabs navigation header */}
      <div
        role="tablist"
        aria-label="Tab konten"
        className="flex items-center gap-1 overflow-x-auto border-b border-border bg-muted/50 p-1.5"
      >
        {tabList.map((tab) => {
          const isActive = activeTab === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'focus-visible:outline-hidden whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary active:scale-95',
                isActive
                  ? 'shadow-xs bg-background font-semibold text-foreground'
                  : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tabs content area */}
      <div className="bg-card/40 p-4">
        {childTabs.length > 0 ? (
          childTabs.map((tab) => (
            <div
              key={tab.value}
              role="tabpanel"
              tabIndex={0}
              aria-label={tab.label}
              className={cn(
                'focus-visible:outline-hidden',
                activeTab === tab.value ? 'block' : 'hidden'
              )}
            >
              {tab.element}
            </div>
          ))
        ) : (
          <div>{children}</div>
        )}
      </div>
    </div>
  )
}

Tabs.Tab = Tab
