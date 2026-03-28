import { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/content/blog/posts'
import { getExamSuite } from '@/lib/examSuite'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://apracademy.app'
  const now = new Date()
  const suite = getExamSuite()
  const blogEntries: MetadataRoute.Sitemap =
    suite === 'nursing'
      ? []
      : getAllBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const core: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...(suite !== 'nursing'
      ? [
          {
            url: `${baseUrl}/blog`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          },
        ]
      : []),
  ]

  return [...core, ...blogEntries]
}
