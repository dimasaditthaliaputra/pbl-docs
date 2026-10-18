import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-gfm'],
    rehypePlugins: [],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

export default withMDX(nextConfig)
