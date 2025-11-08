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
        // window.location을 사용하여 강제 리다이렉트 (클라이언트 네비게이션 문제 해결)
        window.location.href = '/onboarding'
      } else {
        console.log('[LoginPage] 닉네임 있음 → 메인 페이지로 리다이렉트')
        // window.location을 사용하여 강제 리다이렉트
        window.location.href = '/'
      }
    }
  }, [isAuthenticated, user])

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

