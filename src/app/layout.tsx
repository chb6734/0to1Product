import type { Metadata } from 'next'
import './globals.css'

// MSW 초기화 (개발 환경에서만)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('../mocks').catch(console.error)
}

export const metadata: Metadata = {
  title: 'FAN:STAGE - 음악 편지 서비스',
  description: '플랫폼 중립적 음악 편지 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

