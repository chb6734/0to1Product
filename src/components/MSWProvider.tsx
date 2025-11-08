'use client'

/**
 * MSW 초기화 컴포넌트 (클라이언트 컴포넌트)
 * 
 * 목적: 개발 환경에서 MSW를 초기화하고 활성화
 * 주의: server.ts는 브라우저 번들에서 제외되어야 함
 */
import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      // 브라우저 환경에서만 MSW 초기화 (server.ts는 import하지 않음)
      import('../mocks/init')
        .then(() => {
          // MSW 초기화 완료 대기
          setTimeout(() => {
            setIsReady(true)
          }, 100)
        })
        .catch((error) => {
          console.error('MSW 초기화 실패:', error)
          setIsReady(true) // 에러가 나도 앱은 계속 실행
        })
    } else {
      setIsReady(true)
    }
  }, [])

  // MSW가 준비될 때까지 로딩 표시 (선택적)
  if (!isReady) {
    return null // 또는 로딩 스피너
  }

  return <>{children}</>
}

