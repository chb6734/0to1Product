import { createClient } from '@/shared/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * OAuth 콜백 라우트
 * 
 * 목적: Supabase OAuth 인증 후 콜백 처리
 * 플로우:
 * 1. OAuth 제공자에서 리다이렉트됨
 * 2. 코드를 세션으로 교환
 * 3. 사용자 정보 조회
 * 4. 온보딩 여부 확인 후 리다이렉트
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 세션 교환 성공 시 사용자 정보 확인
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // users 테이블에 사용자 정보가 있는지 확인
        const { data: profile } = await supabase
          .from('users')
          .select('nickname')
          .eq('id', user.id)
          .single()

        // 닉네임이 없으면 온보딩 페이지로, 있으면 메인 페이지로
        const redirectUrl = profile?.nickname ? '/' : '/onboarding'
        return NextResponse.redirect(new URL(redirectUrl, request.url))
      }
    }

    // 에러 발생 시 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }

  // 코드가 없으면 로그인 페이지로 리다이렉트
  return NextResponse.redirect(new URL('/login', request.url))
}

