'use client'

import { useAuth } from '@/domains/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { loginWithGoogle, loginWithKakao, loginWithApple, isLoading, error, isAuthenticated, user } = useAuth()
  const router = useRouter()

  console.log('[LoginPage] 렌더링:', { isAuthenticated, user, isLoading, error: error?.message })

  useEffect(() => {
    console.log('[LoginPage] useEffect 실행:', { isAuthenticated, user, hasNickname: !!user?.nickname })
    if (isAuthenticated && user) {
      // 닉네임이 없으면 온보딩 페이지로, 있으면 메인 페이지로
      if (!user.nickname) {
        console.log('[LoginPage] 닉네임 없음 → 온보딩 페이지로 리다이렉트')
        router.push('/onboarding')
        return // 리다이렉트 후 즉시 반환
      } else {
        console.log('[LoginPage] 닉네임 있음 → 메인 페이지로 리다이렉트')
        router.push('/')
        return // 리다이렉트 후 즉시 반환
      }
    }
  }, [isAuthenticated, user, router])

  // 로그인된 상태면 리다이렉트만 처리 (화면 표시 안 함)
  if (isAuthenticated) {
    console.log('[LoginPage] 이미 로그인됨, 리다이렉트 대기 중...')
    return null
  }

  const handleLogin = async (loginFn: () => Promise<any>) => {
    try {
      console.log('[LoginPage] 로그인 버튼 클릭')
      const userData = await loginFn()
      console.log('[LoginPage] 로그인 완료, 사용자 데이터:', userData)
      // 로그인 성공 후 리다이렉트는 useEffect에서 처리됨
    } catch (error) {
      console.error('[LoginPage] 로그인 실패:', error)
      // 에러는 useAuth의 error state로 처리됨
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">FAN:STAGE</h1>
          <p className="text-gray-600">음악으로 모인 사람들이, 음악으로 살아갈 수 있도록</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">시작하기</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error.message}
            </div>
          )}

          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-3"
              onClick={() => handleLogin(loginWithGoogle)}
              isLoading={isLoading}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 로그인
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black"
              onClick={() => handleLogin(loginWithKakao)}
              isLoading={isLoading}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
              </svg>
              Kakao로 로그인
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3"
              onClick={() => handleLogin(loginWithApple)}
              isLoading={isLoading}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple로 로그인
            </Button>
          </div>

          <p className="mt-6 text-xs text-center text-gray-500">
            계속 진행하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}

