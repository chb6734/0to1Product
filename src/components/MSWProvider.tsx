'use client'

/**
 * MSW 초기화 컴포넌트 (클라이언트 컴포넌트)
 * 
 * 목적: 개발 환경에서 MSW를 초기화하고 활성화
 * 주의: server.ts는 브라우저 번들에서 제외되어야 함
 */
import { useEffect } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // 브라우저 환경에서만 MSW 초기화 (server.ts는 import하지 않음)
      import('../mocks/init').catch(console.error)
    }
  }, [])

  return <>{children}</>
}

