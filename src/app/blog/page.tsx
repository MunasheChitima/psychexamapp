import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts } from '@/content/blog/posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Australian-first NPPE prep guides, study plans, and exam strategy articles from APRAcademy.',
  alternates: {
    canonical: '/blog',
    languages: {
      'en-AU': '/blog',
    },
  },
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()

  return (
    <main className="min-h-[100dvh] bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-sm font-semibold tracking-wide text-blue-700 uppercase">APRAcademy Blog</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-900">NPPE Study Guides for Australian Candidates</h1>
          <p className="mt-4 text-base md:text-lg text-gray-600 max-w-3xl">
            Practical exam strategy, domain-specific preparation tips, and high-yield revision guidance for the
            Australian National Psychology Practice Examination.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-gray-200 p-5 md:p-6 hover:border-gray-300 transition-colors">
              <p className="text-xs text-gray-500">
                {post.publishedAt} · {post.readingTimeMinutes} min read
              </p>
              <h2 className="mt-2 text-xl font-bold text-gray-900">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-700 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm md:text-base text-gray-600">{post.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.keywords.slice(0, 3).map((keyword) => (
                  <span key={keyword} className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {keyword}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
