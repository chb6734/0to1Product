/**
 * useAuth 훅 테스트
 * 
 * 목적: 사용자 인증 및 프로필 관리 기능 검증
 * 시나리오:
 * - 소셜 로그인 (Google/Kakao/Apple)
 * - 로그아웃
 * - 프로필 조회 및 수정
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '../hooks/useAuth'

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * 테스트: Google 소셜 로그인
   * 시나리오: 사용자가 Google 계정으로 로그인함
   * Given: 사용자가 로그아웃 상태임
   * When: Google 로그인을 시도함
   * Then: 사용자가 로그인되고 프로필 정보가 반환됨
   */
  it('should login with Google account', async () => {
    const { result } = renderHook(() => useAuth())

    await waitFor(async () => {
      await result.current.loginWithGoogle()
    })

    expect(result.current.user).toBeDefined()
    expect(result.current.user?.email).toBeDefined()
    expect(result.current.isAuthenticated).toBe(true)
  })

  /**
   * 테스트: Kakao 소셜 로그인
   * 시나리오: 사용자가 Kakao 계정으로 로그인함
   * Given: 사용자가 로그아웃 상태임
   * When: Kakao 로그인을 시도함
   * Then: 사용자가 로그인되고 프로필 정보가 반환됨
   */
  it('should login with Kakao account', async () => {
    const { result } = renderHook(() => useAuth())

    await waitFor(async () => {
      await result.current.loginWithKakao()
    })

    expect(result.current.user).toBeDefined()
    expect(result.current.isAuthenticated).toBe(true)
  })

  /**
   * 테스트: Apple 소셜 로그인
   * 시나리오: 사용자가 Apple 계정으로 로그인함
   * Given: 사용자가 로그아웃 상태임
   * When: Apple 로그인을 시도함
   * Then: 사용자가 로그인되고 프로필 정보가 반환됨
   */
  it('should login with Apple account', async () => {
    const { result } = renderHook(() => useAuth())

    await waitFor(async () => {
      await result.current.loginWithApple()
    })

    expect(result.current.user).toBeDefined()
    expect(result.current.isAuthenticated).toBe(true)
  })

  /**
   * 테스트: 로그아웃
   * 시나리오: 사용자가 로그아웃함
   * Given: 사용자가 로그인되어 있음
   * When: 로그아웃을 시도함
   * Then: 사용자가 로그아웃되고 세션이 제거됨
   */
  it('should logout user', async () => {
    const { result } = renderHook(() => useAuth())

    // 먼저 로그인
    await waitFor(async () => {
      await result.current.loginWithGoogle()
    })

    expect(result.current.isAuthenticated).toBe(true)

    // 로그아웃
    await waitFor(async () => {
      await result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  /**
   * 테스트: 프로필 수정
   * 시나리오: 사용자가 프로필 정보를 수정함
   * Given: 사용자가 로그인되어 있음
   * When: 닉네임과 프로필 이미지를 변경함
   * Then: 프로필 정보가 업데이트되고 즉시 반영됨
   */
  it('should update user profile', async () => {
    const { result } = renderHook(() => useAuth())

    // 먼저 로그인
    await waitFor(async () => {
      await result.current.loginWithGoogle()
    })

    const newProfile = {
      nickname: 'newusername',
      profileImage: 'https://example.com/image.jpg'
    }

    await waitFor(async () => {
      await result.current.updateProfile(newProfile)
    })

    expect(result.current.user?.nickname).toBe('newusername')
    expect(result.current.user?.profileImage).toBe('https://example.com/image.jpg')
  })

  /**
   * 테스트: 중복 닉네임 검증
   * 시나리오: 사용자가 이미 사용 중인 닉네임을 입력함
   * Given: 사용자가 프로필 수정 화면에 있음
   * When: 이미 사용 중인 닉네임을 입력함
   * Then: 에러 메시지가 표시되고 프로필이 업데이트되지 않음
   */
  it('should reject duplicate nickname', async () => {
    const { result } = renderHook(() => useAuth())

    await waitFor(async () => {
      await result.current.loginWithGoogle()
    })

    const duplicateProfile = {
      nickname: 'existinguser'
    }

    await expect(
      result.current.updateProfile(duplicateProfile)
    ).rejects.toThrow('이미 사용 중인 닉네임입니다')
  })

  /**
   * 테스트: 소셜 로그인 실패 처리
   * 시나리오: 소셜 로그인 중 네트워크 오류 발생
   * Given: 사용자가 소셜 로그인을 시도함
   * When: 네트워크 오류가 발생함
   * Then: 에러 메시지가 표시되고 로그인이 실패함
   */
  it('should handle social login failure', async () => {
    const { result } = renderHook(() => useAuth())

    // 네트워크 오류 시뮬레이션
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    await expect(
      result.current.loginWithGoogle()
    ).rejects.toThrow('연결에 실패했습니다')

    expect(result.current.isAuthenticated).toBe(false)
  })
})

