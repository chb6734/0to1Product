/**
 * 기본 플랫폼 설정 테스트
 * 
 * 목적: 사용자 기본 플랫폼 설정 기능 검증
 * 시나리오:
 * - 온보딩 시 기본 플랫폼 설정
 * - 기본 플랫폼 조회
 * - 기본 플랫폼 변경
 * 
 * 기반: PRD v4 - 기본 플랫폼 설정 기능
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useDefaultPlatform } from '../hooks/useDefaultPlatform'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'

// useAuth 모킹
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: {
      id: 'user-1',
      email: 'test@example.com',
      defaultPlatform: null,
    },
  })),
}))

describe('useDefaultPlatform', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * 테스트: 기본 플랫폼 설정
   * 시나리오: 사용자가 온보딩 시 기본 플랫폼을 선택함
   * Given: 사용자가 온보딩 페이지에 있음
   * When: Spotify를 기본 플랫폼으로 선택함
   * Then: 사용자 프로필에 defaultPlatform이 저장됨
   */
  it('should set default platform', async () => {
    const { result } = renderHook(() => useDefaultPlatform())

    await act(async () => {
      await result.current.setDefaultPlatform('spotify')
    })

    await waitFor(() => {
      expect(result.current.defaultPlatform).toBe('spotify')
    })
  })

  /**
   * 테스트: 기본 플랫폼 조회
   * 시나리오: 사용자의 기본 플랫폼을 조회함
   * Given: 사용자 프로필에 기본 플랫폼이 설정되어 있음
   * When: 기본 플랫폼을 조회함
   * Then: 설정된 플랫폼이 반환됨
   */
  it('should get default platform', async () => {
    // 프로필에 기본 플랫폼이 설정되어 있다고 가정
    server.use(
      http.get('/api/auth/user', () => {
        return HttpResponse.json({
          user: {
            id: 'user-1',
            email: 'test@example.com',
            defaultPlatform: 'spotify',
          },
        })
      })
    )

    const { result } = renderHook(() => useDefaultPlatform())

    await waitFor(() => {
      expect(result.current.defaultPlatform).toBe('spotify')
    })
  })

  /**
   * 테스트: 기본 플랫폼 변경
   * 시나리오: 사용자가 기본 플랫폼을 변경함
   * Given: 사용자 프로필에 기본 플랫폼이 설정되어 있음
   * When: 다른 플랫폼으로 변경함
   * Then: 기본 플랫폼이 업데이트됨
   */
  it('should update default platform', async () => {
    const { result } = renderHook(() => useDefaultPlatform())

    await act(async () => {
      await result.current.setDefaultPlatform('spotify')
    })

    await waitFor(() => {
      expect(result.current.defaultPlatform).toBe('spotify')
    })

    await act(async () => {
      await result.current.setDefaultPlatform('apple')
    })

    await waitFor(() => {
      expect(result.current.defaultPlatform).toBe('apple')
    })
  })

  /**
   * 테스트: 기본 플랫폼 없음 처리
   * 시나리오: 사용자가 기본 플랫폼을 설정하지 않음
   * Given: 사용자 프로필에 기본 플랫폼이 없음
   * When: 기본 플랫폼을 조회함
   * Then: null을 반환함
   */
  it('should return null when default platform is not set', async () => {
    server.use(
      http.get('/api/auth/user', () => {
        return HttpResponse.json({
          user: {
            id: 'user-1',
            email: 'test@example.com',
            defaultPlatform: null,
          },
        })
      })
    )

    const { result } = renderHook(() => useDefaultPlatform())

    await waitFor(() => {
      expect(result.current.defaultPlatform).toBeNull()
    })
  })
})

