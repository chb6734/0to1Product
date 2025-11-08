import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-indigo-600">FAN:STAGE</h1>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="ghost">로그인</Button>
              </Link>
              <Link href="/create">
                <Button variant="primary">시작하기</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            음악으로 모인 사람들이,<br />
            음악으로 살아갈 수 있도록
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            플랫폼 중립적 음악 편지 서비스로<br />
            어떤 스트리밍 서비스를 사용하든 음악을 공유하세요
          </p>
          <Link href="/create">
            <Button size="lg" variant="primary" className="text-lg px-8 py-4">
              편지 만들기
            </Button>
          </Link>
        </div>
      </section>

      {/* 핵심 가치 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">플랫폼 중립성</h3>
            <p className="text-gray-600">
              Spotify, YouTube Music, Apple Music 어떤 플랫폼을 사용하든 음악을 공유할 수 있습니다
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">감성 전달</h3>
            <p className="text-gray-600">
              단순 링크가 아닌 메시지와 함께 음악을 전달하여 더 깊은 감성을 공유합니다
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">영구 보관</h3>
            <p className="text-gray-600">
              받은 편지를 영구적으로 보관하고 언제든지 다시 찾아볼 수 있습니다
            </p>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            음악으로 마음을 전하는 새로운 경험을 시작해보세요
          </p>
          <Link href="/create">
            <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
              편지 만들기
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

