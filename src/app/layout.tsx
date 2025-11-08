import type { Metadata } from 'next'
import './globals.css'
import { MSWProvider } from '@/components/MSWProvider'

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
      <body>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  )
}

