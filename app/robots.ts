import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://kelvonagee.com/sitemap.xml',
    host: 'https://kelvonagee.com',
  }
}
