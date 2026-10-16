import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './lib/cloudinary.ts',
  },
  async redirects() {
    // Everything lives on the single canvas now.
    return [
      { source: '/work', destination: '/', permanent: true },
      { source: '/portfolio', destination: '/', permanent: true },
      { source: '/info', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
