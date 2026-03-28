import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getAllBlogPosts } from '@/content/blog/posts'
import { getSiteUrl, toJsonLdScript } from '@/lib/structuredData'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {}
  }

  const canonical = `/blog/${post.slug}`

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical,
      languages: {
        'en-AU': canonical,
      },
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: canonical,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/opengraph-image'],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const siteUrl = getSiteUrl()
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`
  const articleJsonLd = toJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: 'en-AU',
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    author: {
      '@type': 'Organization',
      name: 'APRAcademy',
    },
    publisher: {
      '@type': 'Organization',
      name: 'APRAcademy',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.svg`,
      },
    },
    keywords: post.keywords.join(', '),
  })

  const relatedPosts = getAllBlogPosts().filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <main className="min-h-[100dvh] bg-white">
      <script
        id="structured-data-blog-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <Link href="/blog" className="text-sm font-medium text-blue-700 hover:text-blue-800">
          ← Back to blog
        </Link>
        <header className="mt-5">
          <p className="text-xs text-gray-500">
            {post.publishedAt} · Updated {post.updatedAt} · {post.readingTimeMinutes} min read
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">{post.title}</h1>
          <p className="mt-4 text-base md:text-lg text-gray-600">{post.description}</p>
        </header>

        <div className="mt-8 space-y-8">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{section.heading}</h2>
              <div className="mt-3 space-y-4 text-gray-700 leading-relaxed">
                {section.body.map((paragraph, index) => (
                  <p key={`${section.heading}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg font-bold text-gray-900">Ready to put this into practice?</h2>
          <p className="mt-2 text-sm text-gray-700">
            Turn strategy into results with adaptive NPPE practice questions, spaced-repetition flashcards, and full simulations.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/pricing" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              View pricing
            </Link>
            <Link href="/signin" className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Create free account
            </Link>
          </div>
        </section>
      </article>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-lg font-bold text-gray-900">Related guides</h2>
        <div className="mt-4 grid gap-3">
          {relatedPosts.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-blue-700"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
