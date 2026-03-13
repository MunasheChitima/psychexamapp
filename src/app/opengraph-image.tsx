import { ImageResponse } from 'next/og'

export const alt = 'APRAcademy - Pass the National Psychology Exam'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const runtime = 'edge'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '16px',
              fontSize: '32px',
            }}
          >
            📘
          </div>
          <span
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            APRAcademy
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              color: '#ffffff',
              fontSize: '56px',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 20px 0',
              letterSpacing: '-2px',
              maxWidth: '900px',
            }}
          >
            Pass the National Psychology Exam with Confidence
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '24px',
              margin: 0,
              maxWidth: '700px',
              lineHeight: 1.5,
            }}
          >
            1,493+ practice questions · 1,007+ flashcards · Exam simulations · Adaptive learning
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '48px',
          }}
        >
          {[
            { label: 'Ethics', weight: '30%' },
            { label: 'Assessment', weight: '30%' },
            { label: 'Interventions', weight: '30%' },
            { label: 'Communication', weight: '10%' },
          ].map((domain) => (
            <div
              key={domain.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '12px',
                padding: '16px 24px',
              }}
            >
              <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>
                {domain.weight}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '4px' }}>
                {domain.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
