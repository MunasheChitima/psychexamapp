const DEFAULT_SITE_URL = 'https://apracademy.app'

export function getSiteUrl(): string {
  return (process.env.NEXTAUTH_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')
}

export function toJsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function getOrganizationJsonLd() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name: 'APRAcademy',
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    sameAs: [],
  }
}

export function getWebsiteJsonLd() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    url: siteUrl,
    name: 'APRAcademy',
    inLanguage: 'en-AU',
    publisher: {
      '@id': `${siteUrl}#organization`,
    },
  }
}

export function getHomePageJsonLd() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/#webpage`,
    url: `${siteUrl}/`,
    name: 'APRAcademy - Pass the National Psychology Exam with Confidence',
    description:
      'Adaptive NPPE prep with 1,493+ practice questions, 1,007+ flashcards, and full exam simulations.',
    inLanguage: 'en-AU',
    isPartOf: {
      '@id': `${siteUrl}#website`,
    },
    about: {
      '@type': 'EducationalOccupationalCredential',
      name: 'National Psychology Practice Examination (NPPE)',
    },
  }
}

export function getPricingFaqJsonLd(failDiscountPercent: number) {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}/pricing#faq`,
    url: `${siteUrl}/pricing`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What happens when my exam date arrives?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your access automatically expires on your exam start date. No action needed - you will never be charged again. This is a one-time payment, not a subscription.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I get the resit discount?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Go to "Submit Results" and provide your AHPRA candidate number and result notification details. Once your result is verified, the ${failDiscountPercent}% discount is automatically unlocked on the pricing page.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Why is it cheaper to start earlier?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Spaced practice over more time is more effective for exam preparation. APRAcademy rewards early starts with a lower total price.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this a one-time payment?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Pay once and get full access until your exam date. No recurring charges, no subscription to cancel.',
        },
      },
    ],
  }
}
