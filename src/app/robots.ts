import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/signin', '/check-email', '/dashboard', '/psych/dashboard', '/nursing/dashboard'],
    },
    sitemap: `${process.env.NEXTAUTH_URL || 'https://apracademy.app'}/sitemap.xml`,
  }
}
