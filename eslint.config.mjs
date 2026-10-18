import nextConfig from 'eslint-config-next'

const config = [
  ...nextConfig,
  {
    rules: {
      'no-console': 'warn',
    },
  },
]

export default config
