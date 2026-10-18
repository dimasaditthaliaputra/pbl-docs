export interface NavItem {
  title: string
  slug: string
  order: number
  group: string
  description?: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const NAV_ORDER: NavItem[] = [
  {
    title: 'Ringkasan Proyek',
    slug: 'index',
    order: 1,
    group: 'Pengantar',
    description: 'Gambaran umum PAGORA dan stack teknologi yang digunakan',
  },
  {
    title: 'Struktur Folder',
    slug: 'struktur-folder',
    order: 2,
    group: 'Pengantar',
    description: 'Struktur folder backend dan frontend proyek PAGORA',
  },
  {
    title: 'Arsitektur Backend',
    slug: 'arsitektur-backend',
    order: 3,
    group: 'Backend',
    description: 'MVC + Service Repository Pattern pada PAGORA',
  },
  {
    title: 'Alur Data',
    slug: 'alur-data',
    order: 4,
    group: 'Backend',
    description: 'Alur request, data flow, dan pola error PAGORA',
  },
  {
    title: 'Aturan Frontend',
    slug: 'frontend',
    order: 5,
    group: 'Frontend',
    description: 'Aturan React + Inertia dan komponen reusable',
  },
  {
    title: 'Standar Kode',
    slug: 'standar-kode',
    order: 6,
    group: 'Frontend',
    description: 'Standar penulisan kode PHP, React, dan keamanan',
  },
  {
    title: 'Membuat Fitur Baru',
    slug: 'fitur-baru',
    order: 7,
    group: 'Panduan',
    description: 'Urutan mengerjakan fitur baru beserta checklist',
  },
  {
    title: 'Panduan Git',
    slug: 'git',
    order: 8,
    group: 'Panduan',
    description: 'Aturan tim, nama branch, format commit, dan alur kerja',
  },
]

export function getNavGroups(): NavGroup[] {
  const grouped = new Map<string, NavItem[]>()

  for (const item of NAV_ORDER) {
    const existing = grouped.get(item.group) ?? []
    grouped.set(item.group, [...existing, item])
  }

  return Array.from(grouped.entries()).map(([title, items]) => ({
    title,
    items: items.sort((a, b) => a.order - b.order),
  }))
}

export function getPrevNext(slug: string): { prev: NavItem | null; next: NavItem | null } {
  const sorted = [...NAV_ORDER].sort((a, b) => a.order - b.order)
  const idx = sorted.findIndex((item) => item.slug === slug)

  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  }
}
