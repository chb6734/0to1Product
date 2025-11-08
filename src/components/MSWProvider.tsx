'use client'

/**
 * MSW 초기화 컴포넌트 (클라이언트 컴포넌트)
 * 
 * 목적: 개발 환경에서 MSW를 초기화하고 활성화
 */
import { useEffect } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('../mocks').catch(console.error)
    }
  }, [])

  return <>{children}</>
}

