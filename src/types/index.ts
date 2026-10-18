export interface DocFrontmatter {
  title: string
  description: string
  order: number
  group: string
}

export interface DocPage {
  slug: string
  frontmatter: DocFrontmatter
  content: string
}

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
